"use client";

interface HomeButtonProps {
  visible: boolean;
  onPress: () => void;
}

export default function HomeButton({ visible, onPress }: HomeButtonProps) {
  return (
    <button
      onClick={onPress}
      className={`fixed top-6 right-6 z-50 px-3 py-1.5 text-xs font-light tracking-widest uppercase text-neutral-500 bg-white/80 backdrop-blur-sm border border-neutral-200 rounded-lg hover:text-neutral-900 hover:border-neutral-400 transition-all duration-300 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      H / Home
    </button>
  );
}
