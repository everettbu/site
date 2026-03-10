import { Direction } from "@/lib/grid";

interface AboutTileProps {
  onMove: (d: Direction) => void;
}

export default function AboutTile({ onMove }: AboutTileProps) {
  return (
    <div className="h-full w-full flex items-center justify-center bg-amber-100/20 relative">
      <button
        onClick={() => onMove("down")}
        className="absolute bottom-[65px] text-xs font-light tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        Home
      </button>
      <button
        onClick={() => onMove("left")}
        className="absolute left-12 text-xs font-light tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        &larr; Guestbook
      </button>
      <h2 className="text-2xl font-light tracking-widest uppercase text-neutral-800">
        About
      </h2>
    </div>
  );
}
