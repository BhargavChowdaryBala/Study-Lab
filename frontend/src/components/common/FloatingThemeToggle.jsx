import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export const FloatingThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="fixed bottom-5 left-5 z-40">
      <button
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to Light Background" : "Change background to Black"}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-xs shadow-elevated transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md ${
          isDark
            ? 'bg-neutral-900/95 hover:bg-neutral-800 text-amber-300 border-2 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
            : 'bg-slate-950/95 hover:bg-black text-white border-2 border-indigo-500/70 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
        }`}
        title={isDark ? "Click to switch to Light background" : "Click to change background to Black"}
      >
        {isDark ? (
          <>
            <Sun className="w-4 h-4 text-amber-400 fill-amber-400 animate-spin-slow" />
            <span className="tracking-wide">Switch to Light BG</span>
          </>
        ) : (
          <>
            <Moon className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="tracking-wide">Change BG to Black</span>
          </>
        )}
      </button>
    </div>
  );
};

