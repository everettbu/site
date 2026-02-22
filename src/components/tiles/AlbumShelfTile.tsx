import { Direction } from "@/lib/grid";

interface AlbumShelfTileProps {
  onMove: (d: Direction) => void;
}

export default function AlbumShelfTile({ onMove }: AlbumShelfTileProps) {
  return (
    <div className="h-full w-full flex items-center justify-center bg-rose-100/30 relative">
      <button
        onClick={() => onMove("down")}
        className="absolute bottom-12 text-xs font-light tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        Library &darr;
      </button>
      <h2 className="text-2xl font-light tracking-widest uppercase text-neutral-800">
        Album Shelf
      </h2>
    </div>
  );
}
