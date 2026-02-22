import { Direction } from "@/lib/grid";

interface GuestbookTileProps {
  onMove: (d: Direction) => void;
}

export default function GuestbookTile({ onMove }: GuestbookTileProps) {
  return (
    <div className="h-full w-full flex items-center justify-center bg-amber-100/30 relative">
      <button
        onClick={() => onMove("right")}
        className="absolute right-12 text-xs font-light tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        About &rarr;
      </button>
      <h2 className="text-2xl font-light tracking-widest uppercase text-neutral-800">
        Guestbook
      </h2>
    </div>
  );
}
