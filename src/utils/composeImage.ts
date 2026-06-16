export async function composeGridImage(photos: string[]): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Gagal mendapatkan 2d canvas context");
  }

  // Load semua gambar dari array photos
  const loadedImages = await Promise.all(
    photos.map(
      (src) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error(`Gagal memuat gambar: ${src}`));
          img.src = src;
        })
    )
  );

  // 1. HEADER & BACKGROUND KESELURUHAN
  // Background
  ctx.fillStyle = "#0d0d0f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Teks Header Kiri - Kecil
  ctx.fillStyle = "#888888";
  ctx.font = "28px monospace";
  ctx.textAlign = "left";
  const paddingX = 40; // Memberikan sedikit jarak dari pinggir kiri
  ctx.fillText("Memories · Today · Session 01", paddingX, 60);

  // Teks Header Kanan - Tanggal DD.MM.YYYY
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  
  ctx.textAlign = "right";
  ctx.fillText(`${day}.${month}.${year}`, 1040, 60);

  // Teks Header Utama - Judul
  ctx.fillStyle = "#f5f1ea";
  ctx.font = "bold 96px Georgia, serif";
  ctx.textAlign = "left";
  ctx.fillText("Amel's Birthday", paddingX, 150);

  // 2. TIGA FOTO VERTIKAL
  const startY = 200;
  const endY = 1860;
  const gap = 16;
  const totalArea = endY - startY;
  
  // Tinggi masing-masing foto
  const photoHeight = (totalArea - 2 * gap) / 3;
  const photoWidth = 1080;
  
  const borderColors = ["#1e3ed8", "#f4c01f", "#e85d9e"];
  const borderWidth = 6;

  for (let i = 0; i < 3; i++) {
    // Jika ada foto kurang dari 3, lewati sisa looping
    if (!loadedImages[i]) break; 

    const img = loadedImages[i];
    const currentY = startY + i * (photoHeight + gap);

    // Gambar area kotak (sebagai border)
    ctx.fillStyle = borderColors[i] || "#2e2e2e";
    ctx.fillRect(0, currentY, photoWidth, photoHeight);

    // Logika Crop Cover & Inset Image
    // Inset sebesar borderWidth dari semua sisi kotak
    const targetW = photoWidth - 2 * borderWidth;
    const targetH = photoHeight - 2 * borderWidth;
    const targetX = borderWidth;
    const targetY = currentY + borderWidth;

    const imgRatio = img.width / img.height;
    const targetRatio = targetW / targetH;

    let sWidth = img.width;
    let sHeight = img.height;
    let sx = 0;
    let sy = 0;

    if (imgRatio > targetRatio) {
      // Gambar sumber lebih lebar, potong sisi kiri-kanan
      sWidth = img.height * targetRatio;
      sx = (img.width - sWidth) / 2;
    } else {
      // Gambar sumber lebih tinggi, potong sisi atas-bawah
      sHeight = img.width / targetRatio;
      sy = (img.height - sHeight) / 2;
    }

    // Gambar foto di dalam border area
    ctx.drawImage(img, sx, sy, sWidth, sHeight, targetX, targetY, targetW, targetH);
  }

  // 3. FOOTER
  // Garis Tipis
  ctx.fillStyle = "#2e2e2e";
  ctx.fillRect(0, 1860, canvas.width, 1);

  // Teks Footer
  ctx.fillStyle = "#555555";
  ctx.font = "24px monospace";
  ctx.textAlign = "center";
  ctx.fillText("Captured with love · #AmelsBirthday2026", canvas.width / 2, 1900);

  // Kembalikan Data URL Format PNG
  return canvas.toDataURL("image/png");
}