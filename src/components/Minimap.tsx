import { RoomId, rooms, getAvailableDirections, Direction } from "@/lib/grid";

interface MinimapProps {
  currentRoom: RoomId;
  onToggle: () => void;
}

const ARROW: Record<Direction, { label: string; className: string }> = {
  up: { label: "\u2191", className: "col-start-2 row-start-1" },
  down: { label: "\u2193", className: "col-start-2 row-start-3" },
  left: { label: "\u2190", className: "col-start-1 row-start-2" },
  right: { label: "\u2192", className: "col-start-3 row-start-2" },
};

export default function Minimap({ currentRoom, onToggle }: MinimapProps) {
  const available = getAvailableDirections(currentRoom);
  const room = rooms[currentRoom];

  return (
    <button
      onClick={onToggle}
      className="fixed bottom-6 right-6 z-[60] flex flex-col items-center gap-1.5 rounded-lg bg-white/80 backdrop-blur-sm border border-neutral-200 hover:border-neutral-400 p-2.5 cursor-pointer transition-colors"
    >
      <div className="grid grid-cols-3 grid-rows-3 w-[42px] h-[42px] place-items-center">
        {(["up", "down", "left", "right"] as Direction[]).map((dir) => (
          <span
            key={dir}
            className={`${ARROW[dir].className} text-[11px] leading-none transition-opacity duration-300 ${
              available.includes(dir) ? "text-neutral-500 opacity-100" : "opacity-0"
            }`}
          >
            {ARROW[dir].label}
          </span>
        ))}
        {/* Center dot — you are here */}
        <span className="col-start-2 row-start-2 w-2 h-2 rounded-full bg-neutral-900" />
      </div>
      <span className="text-[9px] font-light tracking-widest uppercase text-neutral-400">
        {room?.label}
      </span>
    </button>
  );
}
