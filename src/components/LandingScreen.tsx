import React, { useEffect, useState } from "react";

interface LandingScreenProps {
  onStart: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onStart }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animasi fade-in setelah 100ms
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Format tanggal: DD.MM.YYYY
  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, "0")}.${String(
    today.getMonth() + 1
  ).padStart(2, "0")}.${today.getFullYear()}`;

  return (
    <div
      className="min-h-screen bg-bg flex flex-col pb-12"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.6s ease-in-out",
      }}
    >
      {/* 1. NAVBAR */}
      <nav className="flex justify-between items-center py-4 px-6 border-b border-line">
        <span className="font-mono text-xs uppercase tracking-widest text-[#888888]">
          PHOTOBOOTH
        </span>
        <span className="font-mono text-xs text-[#888888]">
          {formattedDate}
        </span>
      </nav>

      {/* 2. BREADCRUMB */}
      <div className="mt-8 px-6">
        <span className="font-mono text-xs text-[#555555]">
          Memories / Today / Session 01
        </span>
      </div>

      {/* 3. JUDUL SECTION */}
      <div className="mt-4 px-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <h1 className="text-7xl md:text-8xl font-serif text-cream leading-tight">
          Amel's Birthday
        </h1>
      </div>

      {/* 4. GARIS PEMBATAS */}
      <div className="my-8 mx-6 border-t border-line"></div>

      {/* 5. TOMBOL UTAMA */}
      <div className="px-6">
        <button
          onClick={onStart}
          className="w-full bg-accent-pink rounded-lg py-10 px-8 text-left hover:scale-[1.02] transition-transform duration-200 cursor-pointer flex flex-col gap-2 border-none outline-none"
        >
          <span className="font-mono font-bold uppercase text-xl text-white">
            CELEBRATE AMEL'S BIRTHDAY!
          </span>
          <span className="font-mono text-sm text-[#ffcce8]">
            tap anywhere on this card to begin
          </span>
        </button>
      </div>
    </div>
  );
};