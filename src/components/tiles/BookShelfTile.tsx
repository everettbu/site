import { Direction } from "@/lib/grid";

interface BookShelfTileProps {
  onMove: (d: Direction) => void;
}

export default function BookShelfTile({ onMove }: BookShelfTileProps) {
  return (
    <div className="h-full w-full flex items-center justify-center bg-rose-100/30 relative">
      <button
        onClick={() => onMove("right")}
        className="absolute right-12 text-xs font-light tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        Library &rarr;
      </button>
      <h2 className="text-2xl font-light tracking-widest uppercase text-neutral-800">
        Book Shelf
      </h2>
    </div>
  );
}
