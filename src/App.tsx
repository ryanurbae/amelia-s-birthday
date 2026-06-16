import { useState } from "react";
import { LandingScreen } from "./components/LandingScreen";
import { CameraView } from "./components/CameraView";
import { ResultScreen } from "./components/ResultScreen";
import { composeGridImage } from "./utils/composeImage";

type Step = "landing" | "capture" | "result";

function App() {
  const [step, setStep] = useState<Step>("landing");
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [isComposing, setIsComposing] = useState<boolean>(false);

  const handleCompleteCapture = async (photos: string[]) => {
    setIsComposing(true);
    try {
      const composed = await composeGridImage(photos);
      setFinalImage(composed);
      setStep("result");
    } catch (error) {
      console.error("Gagal memproses foto:", error);
      // Fallback jika terjadi error
      setStep("landing");
    } finally {
      setIsComposing(false);
    }
  };

  return (
    <div className="bg-[#0d0d0f] min-h-screen">
      {step === "landing" && (
        <LandingScreen onStart={() => setStep("capture")} />
      )}

      {step === "capture" && (
        <CameraView totalShots={3} onComplete={handleCompleteCapture} />
      )}

      {step === "result" && finalImage && (
        <ResultScreen
          finalImage={finalImage}
          onRetakeAll={() => {
            setFinalImage(null);
            setStep("landing");
          }}
        />
      )}

      {/* Loading Overlay */}
      {isComposing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d0d0f]">
          <p className="font-mono text-[#f5f1ea]">Developing your photos...</p>
        </div>
      )}
    </div>
  );
}

export default App;