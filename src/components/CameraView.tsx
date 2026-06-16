import React, { useState, useEffect, useCallback } from "react";
import { useCamera } from "../hooks/useCamera";

interface CameraViewProps {
  totalShots: number;
  onComplete: (photos: string[]) => void;
}

const ACCENT_COLORS = ["#1e3ed8", "#f4c01f", "#e85d9e"];

export const CameraView: React.FC<CameraViewProps> = ({
  totalShots,
  onComplete,
}) => {
  const { videoRef, isReady, error, capturePhoto, switchCamera, facingMode } = useCamera();

  const [currentShot, setCurrentShot] = useState<number>(0);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isTimerEnabled, setIsTimerEnabled] = useState<boolean>(true);

  const activeColor = ACCENT_COLORS[currentShot % ACCENT_COLORS.length];

  const executeCapture = useCallback(() => {
    setIsCapturing(true);

    // 2. Beri sedikit jeda agar animasi flash terlihat
    setTimeout(() => {
      try {
        const photoDataUrl = capturePhoto();
        setPreviewPhoto(photoDataUrl);
      } catch (err) {
        console.error("Gagal mengambil foto:", err);
      } finally {
        // 3. Matikan efek flash
        setIsCapturing(false);
      }
    }, 150);
  }, [capturePhoto]);

  // Effect untuk timer
  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      executeCapture();
      setCountdown(null);
    }
  }, [countdown, executeCapture]);

  const handleCapture = () => {
    if (countdown !== null) return; // Mencegah klik multiple
    if (isTimerEnabled) {
      setCountdown(5);
    } else {
      executeCapture();
    }
  };

  const handleConfirm = () => {
    if (!previewPhoto) return;

    const newPhotos = [...capturedPhotos, previewPhoto];
    setCapturedPhotos(newPhotos);
    setPreviewPhoto(null);

    if (newPhotos.length >= totalShots) {
      onComplete(newPhotos);
    } else {
      setCurrentShot((prev) => prev + 1);
      if (isTimerEnabled) setCountdown(5);
    }
  };

  const handleRetake = () => {
    setPreviewPhoto(null);
    if (isTimerEnabled) setCountdown(5);
  };

  // Kondisi error: jika akses kamera ditolak
  if (error) {
    return (
      <div className="min-h-screen bg-[#0d0d0f] flex items-center justify-center p-6">
        <p className="text-[#e8432f] font-mono text-center">
          Camera access denied. Please allow camera permission and refresh.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-[#0d0d0f] flex flex-col text-[#f5f1ea]">
      {/* 1. HEADER BAR */}
      <div className="shrink-0 flex flex-row justify-between items-center p-4 border-b border-[#2e2e2e]">
        <span className="font-mono text-xs text-[#888888]">
          Memories / Today / Capture
        </span>
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setIsTimerEnabled(!isTimerEnabled)}
            className={`flex items-center justify-center h-9 px-3 rounded-full active:scale-95 transition-colors font-mono text-xs font-bold ${
              isTimerEnabled ? "bg-[#f5f1ea] text-[#0d0d0f]" : "bg-[#2e2e2e] text-[#888888]"
            }`}
          >
            {isTimerEnabled ? "TIMER: 5S" : "TIMER: OFF"}
          </button>
          <button
            onClick={switchCamera}
            className="flex items-center justify-center w-9 h-9 bg-[#f5f1ea] text-[#0d0d0f] rounded-full active:scale-95 transition-transform"
            aria-label="Switch Camera"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 16V14a2 2 0 0 0-2-2h-4" />
              <path d="m17 15 3-3-3-3" />
              <path d="M4 8v2a2 2 0 0 0 2 2h4" />
              <path d="m7 9-3 3 3 3" />
            </svg>
          </button>
          <span
            className="font-mono text-sm font-bold"
            style={{ color: activeColor }}
          >
            0{currentShot + 1} / 0{totalShots}
          </span>
        </div>
      </div>

      {/* 2. AREA KAMERA */}
      <div className="flex-1 min-h-0 flex items-center justify-center bg-[#0d0d0f] p-2 md:p-4">
        <div
          className="relative overflow-hidden w-full h-auto max-h-full max-w-full aspect-[9/16] md:w-auto md:h-full md:aspect-[1080/542]"
          style={{
            border: `3px solid ${activeColor}`,
            margin: "0 auto",
          }}
        >
          {/* Video sengaja SELALU dirender di background agar stream kamera tidak freeze saat next capture */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover z-0"
            style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
          />

          {/* Overlay Preview (Menutupi video) */}
          {previewPhoto && (
            <div className="absolute inset-0 z-10 bg-[#0d0d0f]">
              <img src={previewPhoto} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Overlay Kotak Bantuan - Hanya untuk mobile (vertikal). Desktop sudah otomatis proporsional */}
          <div className="absolute inset-0 pointer-events-none z-20 flex flex-col md:hidden">
            <div className="flex-1 bg-black/60"></div>
            {/* Area Tengah (Jendela) yang persis akan masuk final image */}
            <div className="w-full border-y border-white/40" style={{ aspectRatio: "1080/542" }}></div>
            <div className="flex-1 bg-black/60"></div>
          </div>

          {/* Status Label (Capture # atau Preview) */}
          <div className="absolute top-0 left-0 bg-black/60 px-2 py-1 z-30">
            <span className="font-mono text-xs" style={{ color: previewPhoto ? "#888888" : activeColor }}>
              {previewPhoto ? "PREVIEW" : `Capture 0${currentShot + 1}`}
            </span>
          </div>

          {/* Timer Countdown */}
          {countdown !== null && countdown > 0 && (
            <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
              <span className="text-9xl font-serif text-white">
                {countdown}
              </span>
            </div>
          )}

          {/* Efek Flash Kamera */}
          {isCapturing && (
            <div className="absolute inset-0 bg-white opacity-80 z-50 transition-opacity" />
          )}
        </div>
      </div>

      {/* 3. KONTROL BAWAH */}
      <div className="shrink-0 h-[120px] pb-4 flex flex-col items-center justify-center gap-4">
        {!previewPhoto ? (
          <>
            <button
              onClick={handleCapture}
              disabled={!isReady || countdown !== null}
              className="w-16 h-16 rounded-full border-2 flex items-center justify-center bg-transparent cursor-pointer hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderColor: activeColor }}
            >
              <div
                className="w-12 h-12 rounded-full transition-colors"
                style={{ backgroundColor: activeColor }}
              />
            </button>
            <span className="font-mono text-xs text-[#555555]">
              {countdown !== null ? "GET READY..." : "TAP TO START"}
            </span>
          </>
        ) : (
          <div className="flex flex-row gap-4">
            <button
              onClick={handleRetake}
              className="rounded-full px-8 py-3 border border-[#f5f1ea] bg-transparent text-[#f5f1ea] font-mono font-bold text-sm hover:bg-[#f5f1ea]/10 transition-colors"
            >
              RETAKE
            </button>
            <button
              onClick={handleConfirm}
              className="rounded-full px-8 py-3 text-white font-mono font-bold text-sm hover:opacity-90 transition-opacity"
              style={{ backgroundColor: activeColor }}
            >
              {currentShot === totalShots - 1 ? "FINISH" : "NEXT"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};