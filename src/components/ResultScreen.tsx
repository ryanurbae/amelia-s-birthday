import React, { useState } from "react";

interface ResultScreenProps {
  finalImage: string;
  onRetakeAll: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  finalImage,
  onRetakeAll,
}) => {
  const [shareError, setShareError] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState<boolean>(false);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.download = "amels-birthday-photobooth.png";
    link.href = finalImage;
    link.click();
  };

  const handleShare = async () => {
    setIsSharing(true);
    setShareError(null);
    
    try {
      // Convert data URL base64/PNG ke File object
      const response = await fetch(finalImage);
      const blob = await response.blob();
      const file = new File([blob], "amels-birthday.png", { type: "image/png" });

      // Cek apakah browser mendukung fitur Web Share API untuk file ini
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Amel's Birthday",
          text: "#Amels22ndBirthday",
        });
      } else {
        setShareError(
          "Direct share is only available on mobile browsers (Chrome / Safari). Please download and upload manually to your Instagram Story."
        );
      }
    } catch (error) {
      console.error("Error sharing:", error);
      // Error biasanya dilempar saat pengguna membatalkan share (AbortError)
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0f] max-w-screen-sm mx-auto p-6 flex flex-col">
      {/* 1. BREADCRUMB */}
      <div className="font-mono text-xs text-[#555555] mb-2">
        Memories / Today / Final Result
      </div>

      {/* 2. JUDUL */}
      <h1 className="font-serif text-5xl text-[#f5f1ea] mb-6">
        Your memory is ready.
      </h1>

      {/* 3. PREVIEW GAMBAR */}
      <img
        src={finalImage}
        alt="Final Photobooth"
        className="w-full object-cover border border-[#2e2e2e] rounded-sm"
        style={{ aspectRatio: "9/16" }}
      />

      {/* 4. TOMBOL-TOMBOL */}
      <div className="mt-6 flex flex-col gap-3 w-full">
        <button
          onClick={handleDownload}
          className="w-full bg-[#1e3ed8] rounded-lg py-4 font-mono text-sm uppercase tracking-widest text-white hover:opacity-90 transition-opacity"
        >
          DOWNLOAD IMAGE
        </button>
        <button
          onClick={handleShare}
          disabled={isSharing}
          className="w-full bg-[#e85d9e] rounded-lg py-4 font-mono text-sm uppercase tracking-widest text-white disabled:opacity-75 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          {isSharing ? "SHARING..." : "SHARE TO INSTAGRAM STORY"}
        </button>
        {shareError && (
          <p className="font-mono text-[#888888] text-xs mt-2 text-center">
            {shareError}
          </p>
        )}
      </div>

      {/* 5. TOMBOL RETAKE */}
      <div className="mt-4 text-center">
        <button
          onClick={onRetakeAll}
          className="font-mono text-[#555555] text-xs underline cursor-pointer hover:text-[#888888] transition-colors bg-transparent border-none"
        >
          ← retake all
        </button>
      </div>
    </div>
  );
};