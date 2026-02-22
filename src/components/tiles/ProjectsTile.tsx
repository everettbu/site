import { Direction } from "@/lib/grid";

interface ProjectsTileProps {
  onMove: (d: Direction) => void;
}

export default function ProjectsTile({ onMove }: ProjectsTileProps) {
  return (
    <div className="h-full w-full flex items-center justify-center bg-teal-100/20 relative">
      <button
        onClick={() => onMove("left")}
        className="absolute left-12 text-xs font-light tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        &larr; Home
      </button>
      <h2 className="text-2xl font-light tracking-widest uppercase text-neutral-800">
        Projects
      </h2>
    </div>
  );
}
