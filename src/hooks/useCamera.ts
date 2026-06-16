import { useState, useEffect, useRef, useCallback } from 'react';

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isReady: boolean;
  error: string | null;
  capturePhoto: () => string;
  stopCamera: () => void;
  switchCamera: () => void;
  facingMode: 'user' | 'environment';
}

export function useCamera(): UseCameraReturn {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsReady(false);
  }, []);

  const switchCamera = useCallback(() => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  }, []);

  useEffect(() => {
    let mounted = true;

    const initCamera = async () => {
      // Hentikan stream yang ada sebelum memulai stream dengan arah kamera baru
      stopCamera();

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (!mounted) {
          // Jika komponen keburu unmount sebelum promise selesai, hentikan stream
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current
              ?.play()
              .then(() => {
                if (mounted) setIsReady(true);
              })
              .catch((err) => {
                if (mounted) {
                  console.error('Error playing video:', err);
                  setError('Gagal memutar video dari kamera.');
                }
              });
          };
        }
      } catch (err: any) {
        if (mounted) {
          console.error('Camera access error:', err);
          setError(err.message || 'Akses kamera ditolak atau tidak tersedia.');
        }
      }
    };

    initCamera();

    // Cleanup function yang akan dijalankan saat komponen unmount
    return () => {
      mounted = false;
      stopCamera();
    };
  }, [facingMode, stopCamera]);

  const capturePhoto = useCallback((): string => {
    const video = videoRef.current;
    if (!video) {
      throw new Error('Video reference is not ready.');
    }

    const canvas = document.createElement('canvas');
    // Gunakan resolusi asli video agar tidak ada distorsi/double-crop
    const targetWidth = video.videoWidth;
    const targetHeight = video.videoHeight;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2d canvas context.');
    }

    // Jika menggunakan kamera depan, mirror hasil canvas agar sesuai dengan preview
    if (facingMode === 'user') {
      ctx.translate(targetWidth, 0);
      ctx.scale(-1, 1);
    }

    // Gambar full frame dari video tanpa crop (crop akan dihandle murni oleh composeImage.ts)
    ctx.drawImage(video, 0, 0, targetWidth, targetHeight);

    // Mengembalikan URL base64 format image/jpeg dengan kualitas 0.9
    return canvas.toDataURL('image/jpeg', 0.9);
  }, [facingMode]);

  return { videoRef, isReady, error, capturePhoto, stopCamera, switchCamera, facingMode };
}