"use client";

interface NavigationHintProps {
  visible: boolean;
}

export default function NavigationHint({ visible }: NavigationHintProps) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 text-xs font-light tracking-widest uppercase text-neutral-400 transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      Scroll or use arrows to explore
    </div>
  );
}
