export type Direction = "up" | "down" | "left" | "right";

export type RoomId = string;

export interface RoomConfig {
  id: RoomId;
  label: string;
  hash: string; // "" for home, "#about" etc.
  neighbors: Partial<Record<Direction, RoomId>>;
}

export const DEFAULT_ROOM: RoomId = "home";

export const rooms: Record<RoomId, RoomConfig> = {
  home: {
    id: "home",
    label: "Home",
    hash: "",
    neighbors: { up: "about", down: "media", left: "library", right: "projects" },
  },
  about: {
    id: "about",
    label: "About",
    hash: "#about",
    neighbors: { down: "home", left: "guestbook" },
  },
  library: {
    id: "library",
    label: "Library",
    hash: "#library",
    neighbors: { right: "home", up: "album-shelf", left: "book-shelf", down: "world-map" },
  },
  media: {
    id: "media",
    label: "Media",
    hash: "#media",
    neighbors: { up: "home", left: "collections", right: "montages", down: "photo-reel" },
  },
  projects: {
    id: "projects",
    label: "Projects",
    hash: "#projects",
    neighbors: { left: "home" },
  },
  guestbook: {
    id: "guestbook",
    label: "Guestbook",
    hash: "#guestbook",
    neighbors: { right: "about" },
  },
  "album-shelf": {
    id: "album-shelf",
    label: "Album Shelf",
    hash: "#album-shelf",
    neighbors: { down: "library" },
  },
  "book-shelf": {
    id: "book-shelf",
    label: "Book Shelf",
    hash: "#book-shelf",
    neighbors: { right: "library" },
  },
  "world-map": {
    id: "world-map",
    label: "World Map",
    hash: "#world-map",
    neighbors: { up: "library", down: "collections" },
  },
  montages: {
    id: "montages",
    label: "Montages",
    hash: "#montages",
    neighbors: { left: "media" },
  },
  collections: {
    id: "collections",
    label: "Collections",
    hash: "#collections",
    neighbors: { right: "media", up: "world-map" },
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
