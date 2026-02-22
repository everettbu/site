import { Direction } from "@/lib/grid";

interface PhotoReelTileProps {
  onMove: (d: Direction) => void;
}

export default function PhotoReelTile({ onMove }: PhotoReelTileProps) {
  return (
    <div className="h-full w-full flex items-center justify-center bg-sky-100/30 relative">
      <button
        onClick={() => onMove("up")}
        className="absolute top-12 text-xs font-light tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        Media &uarr;
      </button>
      <h2 className="text-2xl font-light tracking-widest uppercase text-neutral-800">
        Photo Reel
      </h2>
    </div>
  );
}
