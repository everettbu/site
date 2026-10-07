"use client";

import { createContext, useContext } from "react";

/**
 * Lets a room taller than the viewport hand its scroll container to the sprite,
 * whose camera then scrolls it as the sprite walks or flies. Usage in a tile:
 *   <div ref={useRoomScroller()} className="h-full overflow-hidden">…</div>
 */
export const RoomScrollContext = createContext<(el: HTMLElement | null) => void>(() => {});

export const useRoomScroller = () => useContext(RoomScrollContext);
