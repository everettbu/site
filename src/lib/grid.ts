export type Direction = "up" | "down" | "left" | "right";

export type RoomId = string;

export const OPPOSITE: Record<Direction, Direction> = { up: "down", down: "up", left: "right", right: "left" };

export const isVertical = (d: Direction) => d === "up" || d === "down";

export interface RoomConfig {
  id: RoomId;
  label: string;
  hash: string; // "" for home, "#about" etc.
  neighbors: Partial<Record<Direction, RoomId>>;
  water?: Direction[]; // edges bordered by water — crossed by the bridges
  tint?: string; // wash over the whole room, water included; blended across long bridges
}

export const DEFAULT_ROOM: RoomId = "home";

export const rooms: Record<RoomId, RoomConfig> = {
  home: {
    id: "home",
    label: "Home",
    hash: "",
    neighbors: { up: "about", down: "media", left: "library", right: "projects" },
    water: ["up", "down", "left", "right"], // an island
  },
  about: {
    id: "about",
    label: "About",
    hash: "#about",
    neighbors: { down: "home", left: "guestbook" },
    water: ["down"], // across the bridge from home
    tint: "rgb(254 243 199 / 0.2)", // amber-100/20
  },
  library: {
    id: "library",
    label: "Library",
    hash: "#library",
    neighbors: { right: "home", up: "album-shelf", left: "book-shelf", down: "world-map" },
    water: ["right"], // across the bridge from home
    tint: "rgb(255 228 230 / 0.2)", // rose-100/20
  },
  media: {
    id: "media",
    label: "Media",
    hash: "#media",
    neighbors: { up: "home", left: "collections", right: "montages", down: "photo-reel" },
    water: ["up"], // across the bridge from home
    tint: "rgb(224 242 254 / 0.2)", // sky-100/20
  },
  projects: {
    id: "projects",
    label: "Projects",
    hash: "#projects",
    neighbors: { left: "home" },
    water: ["left"], // across the bridge from home
    tint: "rgb(204 251 241 / 0.2)", // teal-100/20
  },
  guestbook: {
    id: "guestbook",
    label: "Guestbook",
    hash: "#guestbook",
    neighbors: { right: "about" },
    tint: "rgb(254 243 199 / 0.3)", // amber-100/30
  },
  "album-shelf": {
    id: "album-shelf",
    label: "Album Shelf",
    hash: "#album-shelf",
    neighbors: { down: "library" },
    tint: "rgb(255 228 230 / 0.3)", // rose-100/30
  },
  "book-shelf": {
    id: "book-shelf",
    label: "Book Shelf",
    hash: "#book-shelf",
    neighbors: { right: "library" },
    tint: "rgb(255 228 230 / 0.3)", // rose-100/30
  },
  "world-map": {
    id: "world-map",
    label: "World Map",
    hash: "#world-map",
    neighbors: { up: "library", down: "collections" },
    tint: "rgb(255 228 230 / 0.3)", // rose-100/30
  },
  montages: {
    id: "montages",
    label: "Montages",
    hash: "#montages",
    neighbors: { left: "media" },
    tint: "rgb(224 242 254 / 0.3)", // sky-100/30
  },
  collections: {
    id: "collections",
    label: "Collections",
    hash: "#collections",
    neighbors: { right: "media", up: "world-map" },
    tint: "rgb(224 242 254 / 0.3)", // sky-100/30
  },
  "photo-reel": {
    id: "photo-reel",
    label: "Photo Reel",
    hash: "#photo-reel",
    neighbors: { up: "media" },
  },
};

// Derived lookup: URL hash → room id
export const hashToRoom: Record<string, RoomId> = Object.fromEntries(
  Object.values(rooms).map((r) => [r.hash, r.id])
);

export function getNextRoom(current: RoomId, direction: Direction): RoomId | null {
  const room = rooms[current];
  if (!room) return null;
  return room.neighbors[direction] ?? null;
}

export function getAvailableDirections(roomId: RoomId): Direction[] {
  const room = rooms[roomId];
  if (!room) return [];
  return Object.keys(room.neighbors) as Direction[];
}
