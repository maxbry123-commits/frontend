import { hasFtyp, MAX_IMPORT_BYTES } from "./model";

export async function sha256Hex(bytes: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function readFileHead(file: Blob): Promise<{ bytes: ArrayBuffer; sniffedMp4: boolean; tooBig: boolean }> {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_IMPORT_BYTES) {
      resolve({ bytes: new ArrayBuffer(0), sniffedMp4: false, tooBig: true });
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
    reader.onload = () => {
      const bytes = reader.result;
      if (!(bytes instanceof ArrayBuffer)) {
        reject(new Error("Lectura vacía."));
        return;
      }
      resolve({ bytes, sniffedMp4: hasFtyp(new Uint8Array(bytes)), tooBig: false });
    };
    reader.readAsArrayBuffer(file);
  });
}

export function probeVideo(blob: Blob): Promise<{ durationMs: number; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    const finish = (err?: Error, value?: { durationMs: number; width: number; height: number }) => {
      window.clearTimeout(timer);
      URL.revokeObjectURL(url);
      video.removeAttribute("src");
      video.load();
      if (err) reject(err);
      else if (value) resolve(value);
    };
    const timer = window.setTimeout(() => finish(new Error("Tiempo de lectura agotado.")), 8000);
    video.onloadedmetadata = () => {
      const durationMs = Math.round(video.duration * 1000);
      if (!Number.isFinite(video.duration) || durationMs <= 0) {
        finish(new Error("Ese video no declara una duración usable."));
        return;
      }
      finish(undefined, {
        durationMs,
        width: video.videoWidth,
        height: video.videoHeight,
      });
    };
    video.onerror = () => finish(new Error("El navegador no puede abrir ese video."));
    video.src = url;
  });
}

export function captureFrame(blob: Blob): Promise<Blob | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    let settled = false;
    const finish = (frame: Blob | null) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      URL.revokeObjectURL(url);
      video.removeAttribute("src");
      video.load();
      resolve(frame);
    };
    const timer = window.setTimeout(() => finish(null), 5000);
    video.onerror = () => finish(null);
    video.onloadeddata = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      video.currentTime = duration > 0.3 ? 0.2 : 0;
    };
    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      const w = video.videoWidth || 90;
      const h = video.videoHeight || 160;
      const scale = 180 / Math.max(w, h);
      canvas.width = Math.max(1, Math.round(w * scale));
      canvas.height = Math.max(1, Math.round(h * scale));
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        finish(null);
        return;
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((frame) => finish(frame), "image/jpeg", 0.72);
    };
    video.src = url;
  });
}

export async function storageLabel(): Promise<string> {
  if (!navigator.storage?.estimate) return "este navegador no informa la cuota";
  try {
    const estimate = await navigator.storage.estimate();
    const usage = estimate.usage ?? 0;
    const quota = estimate.quota ?? 0;
    const used = `${(usage / 1_000_000).toFixed(1)} MB`;
    if (!quota) return `${used} usados`;
    return `${used} usados de ${(quota / 1_000_000).toFixed(0)} MB de cuota`;
  } catch {
    return "no se pudo leer la cuota";
  }
}
