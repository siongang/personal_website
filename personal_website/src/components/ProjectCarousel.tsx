import React, { useRef, useEffect, useState, useMemo } from "react";

const cards = [
  { id: 0, title: "Project 1" },
  { id: 1, title: "Project 2" },
  { id: 2, title: "Project 3" },
  { id: 3, title: "Project 4" },
  { id: 4, title: "Project 5" },
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

  const offsetX = useMemo(
    () => (activeIndex - 1) * cardContainerWidth,
    [activeIndex, cardContainerWidth]
  );

  const [isTransitioning, setIsTransitioning] = useState(true);
  const disableTransition = () => setIsTransitioning(false);
  const enableTransition = () => setIsTransitioning(true);
  console.log(`CTIVE INDEX: ${activeIndex}: ${carouselCards[activeIndex].id}`);

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
      }, 300); // match CSS transition duration
    } else if (activeIndex === carouselCards.length - 2) {
      // At the far right clone — reset to first real card
      timeout = setTimeout(() => {
        disableTransition();
        setActiveIndex(2);
      }, 300);
    } else {
      // Any normal move, just make sure transition is enabled
      enableTransition();
    }
  
    return () => clearTimeout(timeout);
  }, [activeIndex]);
  
  
  const handleLeft = () => {
    setActiveIndex((prev) => prev - 1);
  };
  
  const handleRight = () => {
    setActiveIndex((prev) => prev + 1);
  };
  
  // console.log(high_bound)
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
          {carouselCards.map((card, index) => (
            // Card Container
            <div
              key={index}
              className="flex justify-center items-center h-full bg-red-500 border-4 border-blue-500"
              style={{
                width: `${cardContainerWidth}px`,
                height: `${cardContainerWidth}px`,
              }}
            >
              {/* Card */}
              <div className="flex w-1/2 h-1/2 bg-white">
                <p className="text-[black]">{card.id}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleRight}>go right</button>
    </div>
  );
}
