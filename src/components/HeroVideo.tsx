import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface HeroVideoProps {
  src: string;
  poster: string;
  altText: string;
}

interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

const isLowDataMode = (): boolean => {
  if (typeof navigator === "undefined") return false;
  const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (!conn) return false;
  if (conn.saveData) return true;
  return conn.effectiveType === "slow-2g" || conn.effectiveType === "2g";
};

const HeroVideo = ({ src, poster, altText }: HeroVideoProps) => {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [failed, setFailed] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduceMotion || isLowDataMode()) return;
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [reduceMotion]);

  const showStaticPoster = failed || reduceMotion || isLowDataMode();

  return (
    <div ref={containerRef} className="relative rounded-3xl overflow-hidden shadow-card">
      {showStaticPoster || !shouldLoad ? (
        <img
          src={poster}
          alt={altText}
          width={1600}
          height={1200}
          className="w-full h-auto object-cover aspect-video"
          loading="eager"
          decoding="async"
        />
      ) : (
        <>
          <video
            className="w-full h-auto object-cover aspect-video"
            src={src}
            poster={poster}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            preload="metadata"
            aria-label={altText}
            onError={() => setFailed(true)}
          />
          <button
            type="button"
            onClick={() => setIsMuted((prev) => !prev)}
            aria-label={isMuted ? "Включить звук" : "Выключить звук"}
            className="absolute right-3 bottom-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-foreground shadow-soft backdrop-blur hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </>
      )}
    </div>
  );
};

export default HeroVideo;
