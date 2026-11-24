import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useLayoutEffect,
  useCallback,
} from "react";
import Image from "next/image";
import { Play, ChevronLeft, ChevronRight, Pause } from "lucide-react";

const musicItems = [
  {
    id: 3,
    title: "Run To the Sky",
    image_path: "/images/music/moments.jpg",
    music_path: "/music/run_to_the_sky.wav",
    duration: 133.245329,
    links: [{ name: "Youtube", url: "https://www.youtube.com/watch?v=TDhDLmACNuk" }],
  },
  {
    id: 1,
    title: "Fairytale",
    image_path: "/images/music/classical_volume_i.png",
    music_path: "/music/fairytale.wav",
    duration: 100.3239,
    links: [{ name: "Youtube", url: "https://www.youtube.com/watch?v=_sNgREHWZGA" }],
  },
  {
    id: 0,
    title: "About Love [FLIP]",
    image_path: "/images/music/about_love.jpg",
    music_path: "/music/about_love.wav",
    duration: 125.200023,
    links: [{ name: "Youtube", url: "https://www.youtube.com/watch?v=PvpUp4rHLYc" }],
  },
  {
    id: 2,
    title: "She Left",
    image_path: "/images/music/classical_volume_i.png",
    music_path: "/music/she_left.wav",
    duration: 95.423379,
    links: [{ name: "Youtube", url: "https://youtu.be/kS3GQEDsoSs" }],
  },
  {
    id: 3,
    title: "OMG [FLIP]",
    image_path: "/images/music/omg_frnk.jpg",
    music_path: "/music/omg_make_my_own.wav",
    duration: 89.488186,
    links: [{ name: "Youtube", url: "https://www.youtube.com/watch?v=k0wS6eJ7-7U" }],
  },
];

const firstTwo = musicItems.slice(0, 2);
const lastTwo = musicItems.slice(-2);
const carouselItems = [...lastTwo, ...musicItems, ...firstTwo];

const TRANSITION_DURATION = 300;
const WRAP_DELAY = 50;
const WRAP_LOCK_DURATION = 600;

const formatTime = (seconds: number) => {
  const total = Math.floor(Number.isFinite(seconds) ? seconds : 0);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
};

const isCurrentTrack = (audio: HTMLAudioElement, path: string) =>
  Boolean(audio.currentSrc) && new URL(audio.currentSrc).pathname === path;

export default function MusicCarousel() {
  const playerRef = useRef<HTMLDivElement | null>(null);
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

  const lock = useCallback((duration = TRANSITION_DURATION * 2) => {
    if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
    setIsLocked(true);
    lockTimeoutRef.current = setTimeout(() => {
      setIsLocked(false);
      isWrappingRef.current = false;
    }, duration);
  }, []);

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
  }, [activeIndex, lock]);

  const handleLeft = useCallback(() => {
    if (isLocked) return;
    lock();
    setActiveIndex((prev) => prev - 1);
  }, [isLocked, lock]);

  const handleRight = useCallback(() => {
    if (isLocked) return;
    lock();
    setActiveIndex((prev) => prev + 1);
  }, [isLocked, lock]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented || event.isComposing || event.repeat ||
        event.altKey || event.ctrlKey || event.metaKey || event.shiftKey ||
        (event.key !== "ArrowLeft" && event.key !== "ArrowRight")
      ) return;

      // Keep native arrow-key behavior for seeking and editable controls.
      if (event.target instanceof HTMLElement && event.target.closest(
        'input, textarea, select, [contenteditable]:not([contenteditable="false"])'
      )) return;

      const bounds = playerRef.current?.getBoundingClientRect();
      if (!bounds || bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;

      event.preventDefault();
      if (event.key === "ArrowLeft") handleLeft();
      else handleRight();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleLeft, handleRight]);

  // Audio
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playbackRequestedRef = useRef(false);
  const musicPath = carouselItems[activeIndex].music_path;
  // Measured from the bundled WAV files, so track changes never flash 0:00.
  const trackDuration = carouselItems[activeIndex].duration;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(trackDuration);
  const [isSeeking, setIsSeeking] = useState(false);
  const seekStartRef = useRef<number | null>(null);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  useLayoutEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    let cancelled = false;
    // Cached metadata can load before React attaches the media event handlers.
    // Read the element on mount/source changes as well as listening for events.
    const hasCurrentMetadata = audio.readyState >= 1 && isCurrentTrack(audio, musicPath);
    setCurrentTime(hasCurrentMetadata ? audio.currentTime : 0);
    setDuration(hasCurrentMetadata && Number.isFinite(audio.duration) ? audio.duration : trackDuration);
    setIsSeeking(false);
    setIsPlaying(!audio.paused && !audio.ended);

    if (playbackRequestedRef.current) {
      audio.play().catch((error: unknown) => {
        if (cancelled || (error instanceof DOMException && error.name === "AbortError")) return;
        playbackRequestedRef.current = false;
        setIsPlaying(false);
      });
    }
    return () => { cancelled = true; };
  }, [musicPath, trackDuration]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playbackRequestedRef.current) {
      playbackRequestedRef.current = false;
      audio.pause();
    } else {
      playbackRequestedRef.current = true;
      audio.play().catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        playbackRequestedRef.current = false;
        setIsPlaying(false);
      });
    }
  };

  const seek = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const availableDuration = Number.isFinite(audio.duration) ? audio.duration : trackDuration;
    if (availableDuration <= 0) return;
    const nextTime = Math.max(0, Math.min(seconds, availableDuration));
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const finishSeeking = () => {
    seekStartRef.current = null;
    setIsSeeking(false);
  };

  return (
    <div ref={playerRef} className="w-full flex flex-col items-center gap-4">
      {/* On narrow screens, give the selected track the available space. */}
      <a
        href={carouselItems[activeIndex].links[0].url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full max-w-[20rem] flex-col items-center gap-3 rounded-xl text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:hidden"
        aria-label={`Listen to ${carouselItems[activeIndex].title} on YouTube`}
      >
        <Image
          src={carouselItems[activeIndex].image_path}
          alt={carouselItems[activeIndex].title}
          width={320}
          height={320}
          sizes="(max-width: 767px) 288px, 240px"
          className="aspect-square w-[min(100%,clamp(10rem,38dvh,18rem))] rounded-xl object-cover"
        />
        <span className="text-lg font-medium leading-snug text-white">
          {carouselItems[activeIndex].title}
        </span>
      </a>

      {/* Carousel Viewport */}
      <div
        ref={viewportRef}
        className="hidden md:flex flex-row overflow-hidden w-full max-w-screen-lg min-h-[150px]"
        
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
      <div className="w-full max-w-[20rem] px-2 md:max-w-screen-lg md:px-6 flex flex-col items-center gap-2">
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={handleLeft}
            disabled={isLocked}
            aria-label="Previous track"
            aria-keyshortcuts="ArrowLeft"
            className="rounded-full p-2.5 md:p-1 text-white cursor-pointer transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:opacity-40 disabled:cursor-default"
          >
            <ChevronLeft
              className="w-6 h-6
                               hover:color-[#333] hover:scale-103 disabled:opacity-50 hover:cursor-pointer
            "
            />
          </button>

          <button
            onClick={togglePlayback}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="bg-white text-black p-4 md:p-2 rounded-full cursor-pointer transition-transform hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
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
            aria-label="Next track"
            aria-keyshortcuts="ArrowRight"
            className="rounded-full p-2.5 md:p-1 text-white cursor-pointer transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:opacity-40 disabled:cursor-default"
          >
            <ChevronRight
              className="w-6 h-6
                               hover:color-[#333] hover:scale-103 disabled:opacity-50 hover:cursor-pointer
            "
            />
          </button>
        </div>

        <div className="order-first w-full md:order-none md:w-1/2">
          <div className="music-seek-control" data-seeking={isSeeking}>
            <span className="music-seek-rail" aria-hidden="true">
              <span className="music-seek-fill" style={{ width: `${progress}%` }} />
              <span className="music-seek-thumb" style={{ left: `${progress}%` }} />
            </span>
            <input
              type="range"
              min={0}
              max={duration || 1}
              step="0.1"
              value={Math.min(currentTime, duration)}
              disabled={duration <= 0}
              onChange={(event) => seek(Number(event.target.value))}
              onPointerDown={(event) => { seekStartRef.current = event.clientX; }}
              onPointerMove={(event) => {
                if (seekStartRef.current !== null && Math.abs(event.clientX - seekStartRef.current) > 3) {
                  setIsSeeking(true);
                }
              }}
              onPointerUp={finishSeeking}
              onPointerCancel={finishSeeking}
              onBlur={finishSeeking}
              aria-label="Seek through track"
              aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
              className="music-seek"
            />
          </div>
          <div className="flex justify-between text-[0.8125rem] text-gray-400 tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
      <audio
        ref={audioRef}
        src={musicPath}
        preload="metadata"
        onEmptied={() => {
          setCurrentTime(0);
        }}
        onLoadedMetadata={(event) => {
          if (!isCurrentTrack(event.currentTarget, musicPath)) return;
          const seconds = event.currentTarget.duration;
          if (Number.isFinite(seconds) && seconds > 0) setDuration(seconds);
        }}
        onDurationChange={(event) => {
          if (!isCurrentTrack(event.currentTarget, musicPath)) return;
          const seconds = event.currentTarget.duration;
          if (Number.isFinite(seconds) && seconds > 0) setDuration(seconds);
        }}
        onTimeUpdate={(event) => {
          if (isCurrentTrack(event.currentTarget, musicPath)) {
            setCurrentTime(event.currentTarget.currentTime);
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={(event) => {
          if (!isCurrentTrack(event.currentTarget, musicPath)) return;
          playbackRequestedRef.current = true;
          lock();
          // The trailing clone already represents the first song during wraparound.
          setActiveIndex((prev) => prev === carouselItems.length - 2 ? 3 : prev + 1);
        }}
        onError={() => {
          playbackRequestedRef.current = false;
          setIsPlaying(false);
          setCurrentTime(0);
          setDuration(0);
        }}
      />
    </div>
  );
}
