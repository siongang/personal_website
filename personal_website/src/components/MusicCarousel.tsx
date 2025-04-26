import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useLayoutEffect,
} from "react";
import Image from "next/image";
import { Play, ChevronLeft, ChevronRight, Pause } from "lucide-react";

const musicItems = [
  {
    id: 3,
    title: "Run To the Sky",
    image_path: "/images/music/moments.jpg",
    music_path: "/music/run_to_the_sky.wav",
    links: [{ name: "Youtube", url: "https://www.youtube.com/watch?v=TDhDLmACNuk" }],
  },
  {
    id: 1,
    title: "Fairytale",
    image_path: "/images/music/classical_volume_i.png",
    music_path: "/music/fairytale.wav",
    links: [{ name: "Youtube", url: "https://www.youtube.com/watch?v=_sNgREHWZGA" }],
  },
  {
    id: 0,
    title: "About Love [FLIP]",
    image_path: "/images/music/about_love.jpg",
    music_path: "/music/about_love.wav",
    links: [{ name: "Youtube", url: "https://www.youtube.com/watch?v=PvpUp4rHLYc" }],
  },
  {
    id: 2,
    title: "She Left",
    image_path: "/images/music/classical_volume_i.png",
    music_path: "/music/she_left.wav",
    links: [{ name: "Youtube", url: "https://youtu.be/kS3GQEDsoSs" }],
  },
  {
    id: 3,
    title: "OMG [FLIP]",
    image_path: "/images/music/omg_frnk.jpg",
    music_path: "/music/omg_make_my_own.wav",
    links: [{ name: "Youtube", url: "https://www.youtube.com/watch?v=k0wS6eJ7-7U" }],
  },
];

const firstTwo = musicItems.slice(0, 2);
const lastTwo = musicItems.slice(-2);
const carouselItems = [...lastTwo, ...musicItems, ...firstTwo];

const TRANSITION_DURATION = 300;
const WRAP_DELAY = 50;
const WRAP_LOCK_DURATION = 600;

export default function MusicCarousel() {
  const [activeIndex, setActiveIndex] = useState(
    Math.floor((carouselItems.length - 1) / 2)
  );
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [viewportWidth, setViewportWidth] = useState(0);

  const trackWidth = (viewportWidth / 3) * carouselItems.length;
  const itemContainerWidth = viewportWidth / 3;
  const offsetX = useMemo(
    () => (activeIndex - 1) * itemContainerWidth,
    [activeIndex, itemContainerWidth]
  );

  const [isAnimating, setIsAnimating] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const lockTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isWrappingRef = useRef<boolean>(false);

  const lock = (duration = TRANSITION_DURATION * 2) => {
    if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
    setIsLocked(true);
    lockTimeoutRef.current = setTimeout(() => {
      setIsLocked(false);
      isWrappingRef.current = false;
    }, duration);
  };

  const unlock = () => {
    if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
    lockTimeoutRef.current = null;
    setIsLocked(false);
  };

  useLayoutEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry && entry.contentRect.width)
        setViewportWidth(entry.contentRect.width);
    });
    if (viewportRef.current) observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const handleTransitionEnd = () => {
      if (isLocked && isAnimating && !isWrappingRef.current) unlock();
    };
    track.addEventListener("transitionend", handleTransitionEnd);
    return () =>
      track.removeEventListener("transitionend", handleTransitionEnd);
  }, [isLocked, isAnimating]);

  useEffect(() => {
    let wrapTimeout: NodeJS.Timeout;
    if (activeIndex === 1) {
      isWrappingRef.current = true;
      lock(WRAP_LOCK_DURATION);
      wrapTimeout = setTimeout(() => {
        setIsAnimating(false);
        setActiveIndex(carouselItems.length - 3);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setIsAnimating(true));
        });
      }, TRANSITION_DURATION + WRAP_DELAY);
    } else if (activeIndex === carouselItems.length - 2) {
      isWrappingRef.current = true;
      lock(WRAP_LOCK_DURATION);
      wrapTimeout = setTimeout(() => {
        setIsAnimating(false);
        setActiveIndex(2);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setIsAnimating(true));
        });
      }, TRANSITION_DURATION + WRAP_DELAY);
    }
    return () => clearTimeout(wrapTimeout);
  }, [activeIndex, carouselItems.length]);

  const handleLeft = () => {
    if (isLocked) return;
    lock();
    // togglePlayback();
    // setProgress(0);
    setActiveIndex((prev) => prev - 1);
  };

  const handleRight = () => {
    if (isLocked) return;
    lock();
    // togglePlayback();
    // setProgress(0);
    setActiveIndex((prev) => prev + 1);
  };

  // Audio
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [progress, setProgress] = useState(0); // 0 to 100

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (activeIndex === 1 || activeIndex === carouselItems.length - 2) return;

    // Reset playback
    audio.currentTime = 0;
    setProgress(0);

    // Optionally start playing new track if one was already playing
    if (isPlaying) {
      audio.play();
    }
  }, [activeIndex, isAnimating]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    setIsPlaying(!isPlaying);
  };

  // Progress Bar
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        setProgress(percent);
      }
    };

    audio.addEventListener("timeupdate", updateProgress);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, [activeIndex]);

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Carousel Viewport */}
      <div
        ref={viewportRef}
        className="flex flex-row overflow-hidden w-full max-w-screen-lg min-w-[350px] min-h-[150px]"
        
      >
        <div
          ref={trackRef}
          className={`flex ${
            isAnimating ? "transition-transform duration-300 ease-in-out" : ""
          }`}
          style={{
            transform: `translateX(-${offsetX}px)`,
            width: `${trackWidth}px`,
          }}
        >
          {carouselItems.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                className="flex justify-center items-center h-full"
                style={{
                  width: `${itemContainerWidth}px`,
                  height: `${itemContainerWidth}px`,
                }}
              >
                {/* Card */}
                <div
                  className={`flex flex-col items-center w-[80%] h-[80%] p-2 hover:cursor-pointer
										${isAnimating ? "transition-all duration-300" : ""}
										 ${isActive ? "opacity-100" : "opacity-50"}`}

                    onClick={() => window.open(item.links[0].url, "_blank")}

                >
                  <Image
                    src={item.image_path}
                    alt={item.title}
                    width={240}
                    height={240}
                    priority={isActive}
                    className="rounded-xl"
                  />
                  <p className="text-white text-sm text-center mt-2">
                    {item.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Control Panel */}
      <div className="w-full max-w-screen-lg min-w-[450px] px-6 flex flex-col  items-center gap-2">
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={handleLeft}
            disabled={isLocked}
            className="text-white cursor-pointer"
          >
            <ChevronLeft
              className="w-6 h-6
                               hover:color-[#333] hover:scale-103 disabled:opacity-50 hover:cursor-pointer
            "
            />
          </button>

          <button
            onClick={togglePlayback}
            className="bg-white text-black p-2 rounded-full cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>

          <button
            onClick={handleRight}
            disabled={isLocked}
            className="text-white cursor-pointer"
          >
            <ChevronRight
              className="w-6 h-6
                               hover:color-[#333] hover:scale-103 disabled:opacity-50 hover:cursor-pointer
            "
            />
          </button>
        </div>

        {/* Progress bar below buttons */}
        <div className="w-1/2 justify-center h-1 bg-gray-700 rounded overflow-hidden">
          <div
            className="w-full h-1 bg-gray-700 rounded overflow-hidden cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const barWidth = rect.width;
              const ratio = clickX / barWidth;

              const audio = audioRef.current;
              if (audio && audio.duration) {
                audio.currentTime = ratio * audio.duration;
              }
            }}
          >
            <div
              className="h-full bg-white transition-all duration-200"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
      <audio
        ref={audioRef}
        src={carouselItems[activeIndex].music_path}
        preload="auto"
      />
    </div>
  );
}
