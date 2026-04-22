// pair-qr.tsx — generates QR code for phone pairing
import { useEffect, useState } from "react";
import QRCode from "qrcode";

/**
 * Generates a real, scannable QR code from `url`.
 * Falls back to a placeholder while the canvas renders.
 */
export function PairQr({ url, size = 168 }: { url: string; size?: number }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!url || url.includes("loading")) return;
    QRCode.toDataURL(url, {
      width: size * 2, // render at 2× for crisp display on retina
      margin: 1,
      color: { dark: "#1a2e1a", light: "#ffffff" },
      errorCorrectionLevel: "M",
    })
      .then(setDataUrl)
      .catch(() => setDataUrl(null));
  }, [url, size]);

  if (!dataUrl) {
    // Placeholder skeleton while generating
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-md bg-muted animate-pulse"
      />
    );
  }

  return (
    <img
      src={dataUrl}
      alt={`QR code — scan to open ${url}`}
      width={size}
      height={size}
      className="rounded-md"
    />
  );
}
