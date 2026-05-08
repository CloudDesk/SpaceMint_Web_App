import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import heroVideo from "../../../assets/contemporary_kitchen_mp_.mp4";
// import heroVideo from "../../../assets/A_second_cinematic_K_fps.mp4";

export function HeroCarousel() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () =>
      setIsMuted(video.muted || video.volume === 0);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("volumechange", handleVolumeChange);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("volumechange", handleVolumeChange);
    };
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (video.paused) {
      void video.play();
      return;
    }

    video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = !video.muted;

    if (!video.muted && video.paused) {
      void video.play();
    }

    setIsMuted(video.muted);
  };

  return (
    <section
      className="relative min-h-svh overflow-hidden bg-primary"
      aria-label="Space Mint interior film"
    >
      <video
        ref={videoRef}
        aria-label="Space Mint modular interior hero film"
        autoPlay
        className="absolute inset-0 h-full w-full object-cover"
        loop
        muted
        playsInline
        preload="metadata"
        src={heroVideo}
      />
      <div className="absolute inset-0 bg-primary/10" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/36 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-primary/34 to-transparent" />
      <div className="absolute bottom-5 right-5 z-10 flex items-center gap-2 sm:bottom-8 sm:right-8">
        <HeroVideoButton
          label={isPlaying ? "Pause hero film" : "Play hero film"}
          onClick={togglePlayback}
        >
          {isPlaying ? (
            <Pause className="size-4" aria-hidden="true" />
          ) : (
            <Play className="size-4" aria-hidden="true" />
          )}
        </HeroVideoButton>
        <HeroVideoButton
          label={isMuted ? "Unmute hero film" : "Mute hero film"}
          onClick={toggleMute}
        >
          {isMuted ? (
            <VolumeX className="size-4" aria-hidden="true" />
          ) : (
            <Volume2 className="size-4" aria-hidden="true" />
          )}
        </HeroVideoButton>
      </div>
    </section>
  );
}

function HeroVideoButton({
  children,
  label,
  onClick,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      className="grid size-11 place-items-center rounded-sm border border-white/28 bg-primary/58 text-primary-foreground backdrop-blur-md transition-colors duration-smooth hover:bg-accent hover:text-accent-foreground"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
