import React, { useRef, useEffect, useState, useMemo, useLayoutEffect } from "react";
import Image from "next/image";
import ProjectModal, { Project } from "./ProjectCard";

const cards = [
  {
    id: 0,
    title: "Midilyzer",
    image_path: "/images/projects/midilyzer_app.png",
    description: "alsdfjkaslkdfjalsdkfa",
    tools: ["Pyside, Python"],
    links: [{ name: "Github", url: "https://github.com/siongang/Midilyzer" }],
  },
  {
    id: 1,
    title: "Line Tracking Bot",
    image_path: "/images/projects/line_following_robot.png",
    description: "alskdjflaskdjfalskdjal",
    tools: ["C, Arduino"],
  },
  {
    id: 2,
    title: "Spill The Tea!",
    image_path: "/images/projects/spill_the_tea_discord_bot.png",
    description: "alaslkdfjalskdfjalskdjfalskdjflak",
    tools: ["Python"],
  },
  // { id: 3, title: "Project 4" },
  // { id: 4, title: "Project 5" },
];

const firstTwoCards = cards.slice(0, 2);
const lastTwoCards = cards.slice(-2);

const carouselCards = [...lastTwoCards, ...cards, ...firstTwoCards];

// match the transition time for move
const TRANSITION_DURATION = 300;

// add a small buffer when resetting to real index
const WRAP_DELAY = 50;
// Slightly longer lock during wrap operations
const WRAP_LOCK_DURATION = 600;

export default function ProjectCarousel() {
  const numCards = cards.length;
  const [activeIndex, setActiveIndex] = useState(
    Math.floor((carouselCards.length - 1) / 2)
  );

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [viewportWidth, setViewportWidth] = useState(0);

  const trackWidth = (viewportWidth / 3) * carouselCards.length;
  const cardContainerWidth = viewportWidth / 3;

  const offsetX = useMemo(
    () => (activeIndex - 1) * cardContainerWidth,
    [activeIndex, cardContainerWidth]
  );

  // State for tracking transitions
  const [isAnimating, setIsAnimating] = useState(true);
  
  // Improved locking mechanism with timeout tracking
  const [isLocked, setIsLocked] = useState(false);
  const lockTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [selectedCard, setSelectedCard] = useState<Project | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isWrappingRef = useRef(false);
  // Centralized locking function with safety timeout
  const lock = (duration = TRANSITION_DURATION * 2) => {
    // Clear any existing unlock timeout
    if (lockTimeoutRef.current) {
      clearTimeout(lockTimeoutRef.current);
    }
    
    setIsLocked(true);
    
    // Safety timeout - ensure we unlock after maximum transition time
    // This prevents the carousel from getting permanently locked
    lockTimeoutRef.current = setTimeout(() => {
      setIsLocked(false);
      isWrappingRef.current = false;  // Add this line
    }, duration);
  };
  
  const unlock = () => {
    if (lockTimeoutRef.current) {
      clearTimeout(lockTimeoutRef.current);
      lockTimeoutRef.current = null;
    }
    setIsLocked(false);
  };

  useLayoutEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const carouselTrack = entries[0];
      if (carouselTrack && carouselTrack.contentRect.width) {
        setViewportWidth(carouselTrack.contentRect.width);
      }
    });

    if (viewportRef.current) {
      observer.observe(viewportRef.current);
    }

    return () => {
      if (viewportRef.current) {
        observer.unobserve(viewportRef.current);
      }
    };
  }, []);

  // Handle transition end event
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
  
    const handleTransitionEnd = () => {
      if (isLocked && isAnimating && !isWrappingRef.current) {
        unlock();
      }
    };
  
    track.addEventListener("transitionend", handleTransitionEnd);
    return () => {
      track.removeEventListener("transitionend", handleTransitionEnd);
    };
  }, [isLocked, isAnimating]);

  // Handle wrapping logic
  useEffect(() => {
    let wrapTimeout: NodeJS.Timeout;
  
    if (activeIndex === 1) {
      isWrappingRef.current = true;
      // Use a longer lock duration for wrapping
      lock(WRAP_LOCK_DURATION);
      
      // Wrap left → jump to last real card
      wrapTimeout = setTimeout(() => {
        setIsAnimating(false); // Disable transition before jump
        setActiveIndex(carouselCards.length - 3); // Jump immediately
  
        // Use requestAnimationFrame to ensure DOM has updated
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsAnimating(true); // Restore transition
          });
        });
      }, TRANSITION_DURATION + WRAP_DELAY);
    } else if (activeIndex === carouselCards.length - 2) {
      isWrappingRef.current = true;
      // Use a longer lock duration for wrapping
      lock(WRAP_LOCK_DURATION);
      
      // Wrap right → jump to first real card
      wrapTimeout = setTimeout(() => {
        setIsAnimating(false);
        setActiveIndex(2);
  
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsAnimating(true);
          });
        });
      }, TRANSITION_DURATION + WRAP_DELAY);
    }
  
    return () => {
      if (wrapTimeout) clearTimeout(wrapTimeout);
    };
  }, [activeIndex, carouselCards.length]);
  
  // Improved button handlers
  const handleLeft = () => {
    if (isLocked) return;
    lock();
    setActiveIndex((prev) => prev - 1);
  };

  const handleRight = () => {
    if (isLocked) return;
    lock(); 
    setActiveIndex((prev) => prev + 1);
  };

  return (
    // Carousel Container
    <div className="flex flex-row justify-center w-full">
      <button 
        onClick={handleLeft}
        disabled={isLocked}
        className={isLocked ? "opacity-50 cursor-not-allowed" : ""}
      >
        go left
      </button>

      {selectedCard && (
        <ProjectModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}

      {/* Cards Viewport */}
      <div
        ref={viewportRef}
        className="flex flex-row overflow-hidden w-full max-w-screen-lg"
      >
        {/* Cards Track */}
        <div
          ref={trackRef}
          className={`flex ${
            isAnimating
              ? "transition-transform duration-300 ease-in-out"
              : ""
          }`}
          style={{
            transform: `translateX(-${offsetX}px)`,
            width: `${trackWidth}px`,
          }}
        >
          {carouselCards.map((card, index) => {
            const isActive = index === activeIndex;
            return (
              // Card Container
              <div
                key={index}
                className={"flex justify-center items-center h-full"}
                style={{
                  width: `${cardContainerWidth}px`,
                  height: `${cardContainerWidth}px`,
                }}
              >
                {/* Card */}
                <div
                  className={`flex flex-col justify-center items-center w-1/2 h-1/2
                    ${isAnimating ? "transition-all duration-300 ease-in-out" : ""}
                    ${isActive ? "scale-140 z-10 hover:scale-150" : "scale-70 opacity-80 hover:scale-80 "}
                    hover:z-20 hover:opacity-100  cursor-pointer
                  `}
                  onClick={() => setSelectedCard(card)}
                >
                  <Image
                    src={card.image_path}
                    alt={card.title}
                    width={200}
                    height={200}
                    priority={isActive}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button 
        onClick={handleRight}
        disabled={isLocked}
        className={isLocked ? "opacity-50 cursor-not-allowed" : ""}
      >
        go right
      </button>
    </div>
  );
}