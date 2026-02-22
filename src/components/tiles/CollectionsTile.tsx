import { Direction } from "@/lib/grid";

interface CollectionsTileProps {
  onMove: (d: Direction) => void;
}

export default function CollectionsTile({ onMove }: CollectionsTileProps) {
  return (
    <div className="h-full w-full flex items-center justify-center bg-sky-100/30 relative">
      <button
        onClick={() => onMove("up")}
        className="absolute top-12 text-xs font-light tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        World Map &uarr;
      </button>
      <button
        onClick={() => onMove("right")}
        className="absolute right-12 text-xs font-light tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        Media &rarr;
      </button>
      <h2 className="text-2xl font-light tracking-widest uppercase text-neutral-800">
        Collections
      </h2>
    </div>
  );
}
