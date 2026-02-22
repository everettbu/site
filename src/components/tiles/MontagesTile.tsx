import { Direction } from "@/lib/grid";

interface MontagesTileProps {
  onMove: (d: Direction) => void;
}

export default function MontagesTile({ onMove }: MontagesTileProps) {
  return (
    <div className="h-full w-full flex items-center justify-center bg-sky-100/30 relative">
      <button
        onClick={() => onMove("left")}
        className="absolute left-12 text-xs font-light tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        &larr; Media
      </button>
      <h2 className="text-2xl font-light tracking-widest uppercase text-neutral-800">
        Montages
      </h2>
    </div>
  );
}
