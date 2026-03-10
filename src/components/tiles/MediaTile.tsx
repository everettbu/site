import { Direction } from "@/lib/grid";

interface MediaTileProps {
  onMove: (d: Direction) => void;
}

export default function MediaTile({ onMove }: MediaTileProps) {
  return (
    <div className="h-full w-full flex items-center justify-center bg-sky-100/20 relative">
      <button
        onClick={() => onMove("up")}
        className="absolute top-[65px] text-xs font-light tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        Home
      </button>
      <button
        onClick={() => onMove("down")}
        className="absolute bottom-12 text-xs font-light tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        Photo Reel &darr;
      </button>
      <button
        onClick={() => onMove("left")}
        className="absolute left-12 text-xs font-light tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        &larr; Collections
      </button>
      <button
        onClick={() => onMove("right")}
        className="absolute right-12 text-xs font-light tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        Montages &rarr;
      </button>
      <h2 className="text-2xl font-light tracking-widest uppercase text-neutral-800">
        Media
      </h2>
    </div>
  );
}
