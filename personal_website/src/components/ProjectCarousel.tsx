import React, { useRef, useEffect, useState, useMemo } from "react";
import Image from "next/image"; // ✅ Correct!

const cards = [
  {
    id: 0,
    title: "Midilyzer",
    image_path: "/images/projects/midilyzer_app.png",
  },
  {
    id: 1,
    title: "Line Tracking Bot",
    image_path: "/images/projects/line_following_robot.png",
  },
  {
    id: 2,
    title: "Spill The Tea!",
    image_path: "/images/projects/spill_the_tea_discord_bot.png",
  },
  // { id: 3, title: "Project 4" },
  // { id: 4, title: "Project 5" },
];

const firstTwoCards = cards.slice(0, 2);
const lastTwoCards = cards.slice(-2);

const carouselCards = [...lastTwoCards, ...cards, ...firstTwoCards];

console.log(carouselCards);

export default function ProjectCarousel() {
  const numCards = cards.length;
  const [activeIndex, setActiveIndex] = useState(
    Math.floor((carouselCards.length - 1) / 2)
  );

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [viewportWidth, setViewportWidth] = useState(0);

  const trackWidth = (viewportWidth / 3) * carouselCards.length;
  const cardContainerWidth = viewportWidth / 3;
  const [isLocked, setIsLocked] = useState(false);

  const offsetX = useMemo(
    () => (activeIndex - 1) * cardContainerWidth,
    [activeIndex, cardContainerWidth]
  );

  const [isTransitioning, setIsTransitioning] = useState(true);
  const disableTransition = () => setIsTransitioning(false);
  const enableTransition = () => setIsTransitioning(true);

  useEffect(() => {
    if (viewportRef.current) {
      const width = viewportRef.current.offsetWidth;
      setViewportWidth(width);
    }
  });
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (activeIndex === 1) {
      // At the far left clone — reset to last real card
      timeout = setTimeout(() => {
        disableTransition();
        setActiveIndex(carouselCards.length - 3); // jump to real
        setTimeout(() => setIsLocked(false), 50); // small delay to allow re-render
      }, 300); // match CSS transition duration
    } else if (activeIndex === carouselCards.length - 2) {
      // At the far right clone — reset to first real card
      timeout = setTimeout(() => {
        disableTransition();
        setActiveIndex(2);
        setTimeout(() => setIsLocked(false), 50); // small delay to allow re-render
      }, 300);
    } else {
      // Any normal move, just make sure transition is enabled
      enableTransition();
      timeout = setTimeout(() => setIsLocked(false), 350); // unlock normal move
    }
    return () => clearTimeout(timeout);
  }, [activeIndex]);

  const handleLeft = () => {
    if (isLocked) return;
    setIsLocked(true); // lock further clicks
    setActiveIndex((prev) => prev - 1);
  };

  const handleRight = () => {
    if (isLocked) return;
    setIsLocked(true); // lock further clicks
    setActiveIndex((prev) => prev + 1);
  };

  return (
    // Carousel Container
    <div className="flex flex-row justify-center w-full">
      <button onClick={handleLeft}>go left</button>

      {/* Cards Viewport */}
      <div
        ref={viewportRef}
        className="flex flex-row overflow-hidden w-full max-w-screen-lg bg-white"
      >
        {/* Cards Track */}
        <div
          className={`flex ${
            isTransitioning
              ? "transition-transform duration-300 ease-in-out"
              : ""
          }`}
          style={{
            transform: `translateX(-${offsetX}px)`,
            width: `${trackWidth}px`,
          }}
        >
          {isTransitioning &&
            carouselCards.map((card, index) => {
              const isActive = index === activeIndex;
              if (isActive) {
                console.log("Rendering active card:", index, activeIndex);
              }
              return (
                // Card Container
                <div
                  key={index}
                  className={
                    "flex justify-center items-center h-full bg-red-500 border-4 border-blue-500"
                  }
                  style={{
                    width: `${cardContainerWidth}px`,
                    height: `${cardContainerWidth}px`,
                  }}
                >
                  {/* Card */}
                  <div
                    className={`flex flex-col justify-center items-center w-1/2 h-1/2
                                  transition-all duration-300 ease-in-out
                   ${isActive ? "scale-140 z-10 hover:scale-150 " 
                              : "scale-70 opacity-90 hover:scale-80 "
                      }
                    hover:z-20 hover:opacity-100 cursor-pointer
                `}
                  >
                    <Image
                      src={carouselCards[index].image_path}
                      alt={carouselCards[index].title}
                      width={200}
                      height={200}
                    />

                    {/* <p className="text-[black]">{card.title}</p> */}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <button onClick={handleRight}>go right</button>
    </div>
  );
}
