"use client";

interface NavigationHintProps {
  visible: boolean;
}

export default function NavigationHint({ visible }: NavigationHintProps) {
  return (
    <div
      className={`fixed top-[calc(50%+48px)] left-1/2 -translate-x-1/2 z-50 pointer-events-none text-xs font-light tracking-widest uppercase text-neutral-400 transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      Scroll to explore · Arrows to walk
    </div>
  );
}
