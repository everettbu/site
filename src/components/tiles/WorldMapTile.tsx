import { Direction } from "@/lib/grid";

interface WorldMapTileProps {
  onMove: (d: Direction) => void;
}

export default function WorldMapTile({ onMove }: WorldMapTileProps) {
  return (
    <div className="h-full w-full flex items-center justify-center bg-rose-100/30 relative">
      <button
        onClick={() => onMove("up")}
        className="absolute top-12 text-xs font-light tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        Library &uarr;
      </button>
      <button
        onClick={() => onMove("down")}
        className="absolute bottom-12 text-xs font-light tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        Collections &darr;
      </button>
      <h2 className="text-2xl font-light tracking-widest uppercase text-neutral-800">
        World Map
      </h2>
    </div>
  );
}
