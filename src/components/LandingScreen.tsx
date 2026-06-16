import React, { useEffect, useState } from "react";

interface LandingScreenProps {
  onStart: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onStart }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [flowers, setFlowers] = useState<
    Array<{ id: number; left: string; duration: string; delay: string; size: string; opacity: number }>
  >([]);

  useEffect(() => {
    // Trigger animasi fade-in setelah 100ms
    const timer = setTimeout(() => setIsVisible(true), 100);

    // Generate random flowers for endless falling animation
    const generatedFlowers = Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: `${Math.random() * 12 + 10}s`, // Sangat lambat (10s - 22s)
      delay: `${Math.random() * 5}s`, // Muncul acak di 5 detik pertama
      size: `${Math.random() * 10 + 8}px`, // Ukuran 8px - 18px
      opacity: Math.random() * 0.4 + 0.3, // Opacity transparan
    }));
    setFlowers(generatedFlowers);

    return () => clearTimeout(timer);
  }, []);

  // Format tanggal: DD.MM.YYYY
  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, "0")}.${String(
    today.getMonth() + 1
  ).padStart(2, "0")}.${today.getFullYear()}`;

  return (
    <div
      className="relative h-[100dvh] w-full overflow-hidden bg-bg flex flex-col"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.6s ease-in-out",
      }}
    >
      <style>
        {`
          @keyframes falling-petals {
            0% { transform: translate3d(0, -10vh, 0) rotate(0deg); }
            100% { transform: translate3d(5vw, 110vh, 0) rotate(360deg); }
          }
        `}
      </style>

      {/* BACKGROUND FLOWERS */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {flowers.map((flower) => (
          <div
            key={flower.id}
            className="absolute bg-accent-pink"
            style={{
              left: flower.left,
              top: "-10vh",
              width: flower.size,
              height: flower.size,
              opacity: flower.opacity,
              borderRadius: "50% 0 50% 0", // Memberikan bentuk kelopak daun / bunga
              animation: `falling-petals ${flower.duration} linear ${flower.delay} infinite`,
            }}
          />
        ))}
      </div>

      {/* 1. NAVBAR */}
      <nav className="relative z-10 flex justify-between items-center py-4 px-6 border-b border-line">
        <span className="font-mono text-xs uppercase tracking-widest text-[#888888]">
          PHOTOBOOTH
        </span>
        <span className="font-mono text-xs text-[#888888]">
          {formattedDate}
        </span>
      </nav>

      {/* 2. BREADCRUMB */}
      <div className="relative z-10 mt-12 px-6 text-center">
        <span className="font-mono text-xs text-[#555555]">
          Memories / Today / Session 01
        </span>
      </div>

      {/* 3. JUDUL SECTION */}
      <div className="relative z-10 mt-4 px-6 flex flex-col items-center justify-center">
        <h1 className="text-7xl md:text-8xl font-serif text-cream leading-tight text-center">
          Amel's Birthday
        </h1>
      </div>

      {/* 4. GARIS PEMBATAS */}
      <div className="relative z-10 my-8 mx-6 border-t border-line"></div>

      {/* 5. TOMBOL UTAMA */}
      <div className="relative z-10 px-6">
        <button
          onClick={onStart}
          className="w-full bg-accent-pink rounded-lg py-10 px-8 text-center items-center hover:scale-[1.02] transition-transform duration-200 cursor-pointer flex flex-col gap-2 border-none outline-none"
        >
          <span className="font-mono font-bold uppercase text-xl text-white">
            CELEBRATE AMEL'S BIRTHDAY!
          </span>
          <span className="font-mono text-sm text-[#ffcce8]">
            tap anywhere on this card to begin
          </span>
        </button>
      </div>

      {/* 6. WATERMARK */}
      <div className="relative z-10 mt-auto pb-4 px-6 text-center w-full">
        <p className="font-mono text-[10px] text-[#555555]">
          Made by Pacar Paling Tampan, Sangar, Pemberani, Rajin Menabung, Soleh, Siap Mengimami Dunia dan Akhirat | Egar Ryan Pratama
        </p>
      </div>
    </div>
  );
};