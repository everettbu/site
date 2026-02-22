# Everett Butler — Personal Site

## Tech Stack

- **Next.js 16** with App Router (single-page, client-rendered)
- **TypeScript** (strict mode)
- **Tailwind CSS** for styling
- **Motion** (motion/react) for animations
- Path alias: `@/*` maps to `./src/*`

## Architecture

The site is a 2D spatial grid world. Each "room" is a full-screen tile. Users navigate between rooms via scroll/swipe/keyboard/click, with slide or crossfade transitions.

### Core Files

| File | Purpose |
|------|---------|
| `src/lib/grid.ts` | Room graph definition — every room's id, label, URL hash, and neighbors |
| `src/lib/useGridNavigation.ts` | Navigation hook — handles wheel, keyboard, touch input + animation state |
| `src/components/GridWorld.tsx` | Root component — renders current/previous room with Motion transitions |

### Navigation System

`grid.ts` defines the room graph as a `Record<RoomId, RoomConfig>`. Each room has directional neighbors (`up`, `down`, `left`, `right`). Connections must be **bidirectional** — if room A has `right: "B"`, room B must have `left: "A"`.

`useGridNavigation` provides:
- `move(direction)` — directional slide transition
- `moveTo(roomId)` — direct crossfade to any room (used by map overlay)
- `moveToHome()` — crossfade to home
- `disabled` option — suppresses all input (used when map overlay is open)
- Wheel cooldown (400ms post-animation) to prevent trackpad inertia overshoot

### Adding a New Room

1. **`src/lib/grid.ts`** — Add the room entry with neighbors. Ensure reciprocal neighbors are updated on connected rooms.
2. **`src/components/tiles/NewTile.tsx`** — Create the tile component. Props: `{ onMove: (d: Direction) => void }`. Add directional arrow buttons matching the neighbors defined in grid.ts.
3. **`src/components/GridWorld.tsx`** — Import the tile and add it to the `tileComponents` map.
4. **`src/components/MapOverlay.tsx`** — Add position in `ROOM_POSITIONS`. Connected rooms must share either the same `x` (vertical line) or same `y` (horizontal line) for orthogonal map edges.

### Tile Arrow Conventions

Each tile has clickable arrow buttons for its neighbors, positioned absolutely:
- Top center: `up` neighbor
- Bottom center: `down` neighbor
- Left center: `left` neighbor
- Right center: `right` neighbor

Labels follow the pattern: `← Name` (left), `Name →` (right), `Name ↑` (up), `Name ↓` (down). These are hardcoded per tile and **must stay in sync** with `grid.ts` neighbors.

### Map Overlay

`MapOverlay.tsx` renders a full-screen SVG graph of all rooms. Room positions are hand-tuned percentages. Edges are auto-derived from `grid.ts` neighbors. All edge lines must be orthogonal (horizontal or vertical only). The minimap button (`z-[60]`) sits above the overlay (`z-50`).

### Current Room Graph

```
              guestbook ── about
  album-shelf              │
       │                   │
  book-shelf ── library ── home ── projects
                  │        │
              world-map  media ── montages
                  │      │    │
              collections    photo-reel
```

## Commands

- `npm run dev` — local dev server
- `npm run build` — production build (use to verify changes)
- `npm run lint` — ESLint
