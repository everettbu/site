import { Direction } from "@/lib/grid";

interface PhotosTileProps {
  onMove: (d: Direction) => void;
}

export default function PhotosTile({ onMove }: PhotosTileProps) {
  return (
    <div className="h-full w-full flex items-center justify-center bg-sky-100/30 relative">
      <button
        onClick={() => onMove("up")}
        className="absolute top-12 text-xs font-light tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        Media &uarr;
      </button>
      <button
        onClick={() => onMove("down")}
        className="absolute bottom-12 text-xs font-light tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        Photo Reel &darr;
      </button>
      <h2 className="text-2xl font-light tracking-widest uppercase text-neutral-800">
        Photos
      </h2>
    </div>
  );
}
