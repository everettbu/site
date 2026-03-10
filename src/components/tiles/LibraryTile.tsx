import { Direction } from "@/lib/grid";

interface LibraryTileProps {
  onMove: (d: Direction) => void;
}

export default function LibraryTile({ onMove }: LibraryTileProps) {
  return (
    <div className="h-full w-full flex items-center justify-center bg-rose-100/20 relative">
      <button
        onClick={() => onMove("up")}
        className="absolute top-12 text-xs font-light tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        Album Shelf &uarr;
      </button>
      <button
        onClick={() => onMove("down")}
        className="absolute bottom-12 text-xs font-light tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        World Map &darr;
      </button>
      <button
        onClick={() => onMove("left")}
        className="absolute left-12 text-xs font-light tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        &larr; Book Shelf
      </button>
      <button
        onClick={() => onMove("right")}
        className="absolute right-[67px] text-xs font-light tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        Home
      </button>
      <h2 className="text-2xl font-light tracking-widest uppercase text-neutral-800">
        Library
      </h2>
    </div>
  );
}
