import { Direction } from "@/lib/grid";

interface HomeTileProps {
  onMove: (d: Direction) => void;
}

export default function HomeTile({ onMove }: HomeTileProps) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative">
      <button
        onClick={() => onMove("up")}
        className="absolute top-12 text-xs font-light tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        About &uarr;
      </button>
      <button
        onClick={() => onMove("down")}
        className="absolute bottom-12 text-xs font-light tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        Media &darr;
      </button>
      <button
        onClick={() => onMove("left")}
        className="absolute left-12 text-xs font-light tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        &larr; Library
      </button>
      <button
        onClick={() => onMove("right")}
        className="absolute right-12 text-xs font-light tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        Projects &rarr;
      </button>

      <h1 className="text-2xl font-light tracking-widest uppercase">
        Everett Butler
      </h1>
    </div>
  );
}
