"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { Direction } from "@/lib/grid";

export interface Photo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const photos: Photo[] = [
  // { src: "/photos/example.jpg", alt: "Description", width: 2400, height: 1600 },
];

const PLACEHOLDERS = [
  "aspect-[3/4]",
  "aspect-[4/3]",
  "aspect-[2/3]",
  "aspect-[3/2]",
  "aspect-[4/5]",
  "aspect-[3/4]",
  "aspect-[4/3]",
  "aspect-[2/3]",
  "aspect-[3/2]",
  "aspect-[4/5]",
  "aspect-[3/4]",
  "aspect-[4/3]",
];

interface PhotoReelTileProps {
  onMove: (d: Direction) => void;
}

function Lightbox({
  photos,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const photo = photos[index];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl p-2 cursor-pointer"
        aria-label="Previous photo"
      >
        &#8249;
      </button>

      <div
        className="max-w-[90vw] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes="90vw"
          className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
        />
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl p-2 cursor-pointer"
        aria-label="Next photo"
      >
        &#8250;
      </button>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl p-2 cursor-pointer"
        aria-label="Close lightbox"
      >
        &#10005;
      </button>
    </div>
  );
}

export default function PhotoReelTile({ onMove }: PhotoReelTileProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const edgeAccum = useRef(0);

  const [scrollable, setScrollable] = useState(false);

  // Disable overflow until the entrance animation finishes
  useEffect(() => {
    const timer = setTimeout(() => setScrollable(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;

    const atTop = el.scrollTop <= 0;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
    const scrollingUp = e.deltaY < 0;
    const scrollingDown = e.deltaY > 0;

    const atEdge = (atTop && scrollingUp) || (atBottom && scrollingDown);

    if (atEdge) {
      // Accumulate momentum at the edge — only let through after sustained intent
      edgeAccum.current += Math.abs(e.deltaY);
      if (edgeAccum.current < 400) {
        e.stopPropagation();
        return;
      }
      // Threshold met — let event through to grid navigation
      edgeAccum.current = 0;
      return;
    }

    // Not at edge — scroll normally, reset accumulator
    edgeAccum.current = 0;
    e.stopPropagation();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`h-full w-full relative ${scrollable ? "overflow-y-auto" : "overflow-hidden"}`}
      onWheel={handleWheel}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      {/* Navigation arrow */}
      <button
        onClick={() => onMove("up")}
        className="w-full py-4 text-xs font-light tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer text-center"
      >
        Media &uarr;
      </button>

      {/* Header */}
      <header className="py-12 text-center">
        <h2 className="text-2xl font-light tracking-widest uppercase text-neutral-800">
          Photo Reel
        </h2>
      </header>

      {/* Photo grid */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        {photos.length === 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            {PLACEHOLDERS.map((aspect, i) => (
              <div
                key={i}
                className={`mb-4 break-inside-avoid ${aspect} rounded bg-neutral-100`}
              />
            ))}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            {photos.map((photo, index) => (
              <button
                key={photo.src}
                onClick={() => setLightboxIndex(index)}
                className="mb-4 break-inside-avoid block w-full cursor-pointer"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="w-full h-auto"
                />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() =>
            setLightboxIndex(
              (lightboxIndex - 1 + photos.length) % photos.length
            )
          }
          onNext={() =>
            setLightboxIndex((lightboxIndex + 1) % photos.length)
          }
        />
      )}
    </div>
  );
}
