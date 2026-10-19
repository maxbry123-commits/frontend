const PROFILES = {
  REEL_59: { label: "Reel 59 s", target: 59000, portrait: true },
  LANDSCAPE_5: { label: "Horizontal 5 min", target: 300000, portrait: false },
  LANDSCAPE_10: { label: "Horizontal 10 min", target: 600000, portrait: false },
};
const AGENTS = Array.from({ length: 12 }, (_, i) => `grok-session-${String(i + 1).padStart(2, "0")}`);
const DB = "yaiwes-ui-videos";

const statusEl = document.querySelector("#status");
const rowsEl = document.querySelector("#rows");
const planEl = document.querySelector("#plan");
const profileEl = document.querySelector("#profile");
const agentEl = document.querySelector("#agent");
const filesEl = document.querySelector("#files");

for (const agent of AGENTS) {
  const option = document.createElement("option");
  option.value = agent;
  option.textContent = agent;
  agentEl.append(option);
}

let clips = [];
let closed = false;
let finalIndex = null;
const videos = { reel: null, land: null };
const urls = { reel: null, land: null };

function cell(text) {
  const td = document.createElement("td");
  td.textContent = String(text);
  return td;
}

function say(text) {
  statusEl.textContent = text;
}

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("clips")) db.createObjectStore("clips", { keyPath: "clipId" });
      if (!db.objectStoreNames.contains("blobs")) db.createObjectStore("blobs");
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx(names, mode, fn) {
  const db = await openDb();
  try {
    const transaction = db.transaction(names, mode);
    const done = new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
    const result = await fn(transaction);
    await done;
    return result;
  } finally {
    db.close();
  }
}

function req(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function load() {
  clips = await tx(["clips"], "readonly", (transaction) => req(transaction.objectStore("clips").getAll()));
  render();
}

function hasFtyp(bytes) {
  return bytes.length >= 8 && bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70;
}

function probe(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    const timer = setTimeout(() => fail(new Error("Tiempo de lectura agotado.")), 8000);
    const fail = (error) => {
      clearTimeout(timer);
      URL.revokeObjectURL(url);
      reject(error);
    };
    video.onloadedmetadata = () => {
      const durationMs = Math.round(video.duration * 1000);
      if (!Number.isFinite(durationMs) || durationMs <= 0) {
        fail(new Error("Sin duración usable."));
        return;
      }
      clearTimeout(timer);
      URL.revokeObjectURL(url);
      resolve({ durationMs, width: video.videoWidth, height: video.videoHeight });
    };
    video.onerror = () => fail(new Error("El navegador no abre ese video."));
    video.src = url;
  });
}

async function sha256(buffer) {
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function scope(clip) {
  return clip.profile === profileEl.value;
}

async function importFiles(list) {
  if (closed) {
    say("Secuencia cerrada. Reabrir sigue el mismo tema. No hay MP4.");
    return;
  }
  const notes = [];
  for (const file of list) {
    if (file.size > 80 * 1024 * 1024) {
      notes.push(`${file.name} supera 80 MB.`);
      continue;
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    const mp4 = hasFtyp(bytes);
    let meta;
    try {
      meta = await probe(file);
    } catch (error) {
      notes.push(error.message);
      continue;
    }
    const hash = await sha256(bytes.buffer);
    const agent = agentEl.value;
    const profile = profileEl.value;
    const key = `${agent}|${profile}|${hash}`;
    const prior = clips.find((clip) => clip.idempotencyKey === key);
    if (prior) {
      notes.push(`ACK: índice ${prior.sequenceIndex} ya tenía este archivo.`);
      continue;
    }
    const sameIndex = clips.filter(scope);
    const sequenceIndex = sameIndex.length ? Math.max(...sameIndex.map((clip) => clip.sequenceIndex)) + 1 : 0;
    const taken = sameIndex.find((clip) => clip.sequenceIndex === sequenceIndex && clip.sha256 !== hash);
    if (taken) {
      notes.push(`Conflicto en el índice ${sequenceIndex}.`);
      continue;
    }
    const portrait = meta.height > meta.width;
    const wantsPortrait = PROFILES[profile].portrait;
    const status = !mp4 ? "BLOCKED" : portrait === wantsPortrait ? "READY" : "NEEDS_REVIEW";
    const clip = {
      clipId: crypto.randomUUID(),
      idempotencyKey: key,
      agentId: agent,
      profile,
      sequenceIndex,
      fileName: file.name,
      sha256: hash,
      measuredDurationMs: meta.durationMs,
      width: meta.width,
      height: meta.height,
      status,
      note: status === "BLOCKED" ? "No es MP4." : status === "NEEDS_REVIEW" ? "Encuadre distinto." : "",
    };
    await tx(["clips", "blobs"], "readwrite", async (transaction) => {
      transaction.objectStore("blobs").put(file, clip.clipId);
      transaction.objectStore("clips").put(clip);
    });
    clips.push(clip);
    notes.push(`${file.name} índice ${sequenceIndex} · ${meta.durationMs} ms · ${status}.`);
  }
  say(notes.join(" ") || "Nada nuevo.");
  render();
}

function contiguous() {
  const ready = new Map(clips.filter((clip) => scope(clip) && clip.status === "READY").map((clip) => [clip.sequenceIndex, clip]));
  let ms = 0;
  let n = 0;
  const missing = [];
  while (ready.has(n)) {
    ms += ready.get(n).measuredDurationMs;
    n += 1;
  }
  const max = clips.filter(scope).reduce((m, clip) => Math.max(m, clip.sequenceIndex), -1);
  for (let i = 0; i <= max; i += 1) if (!ready.has(i)) missing.push(i);
  return { ms, end: n - 1, missing };
}

function planText() {
  if (!closed || finalIndex == null) return "Manifiesto abierto. Cerrar la secuencia no exporta un MP4.";
  const spec = PROFILES[profileEl.value];
  const mine = clips.filter(scope).sort((a, b) => a.sequenceIndex - b.sequenceIndex);
  const missing = [];
  for (let i = 0; i <= finalIndex; i += 1) {
    const clip = mine.find((item) => item.sequenceIndex === i && item.status === "READY");
    if (!clip) missing.push(i);
  }
  if (missing.length) return `GAP. Faltan índices ${missing.join(", ")}. No se ensambla.`;
  const ordered = mine.filter((clip) => clip.sequenceIndex <= finalIndex && clip.status === "READY");
  const total = ordered.reduce((sum, clip) => sum + clip.measuredDurationMs, 0);
  if (total < spec.target) return `DURATION_SHORT. Medido ${total} ms, objetivo ${spec.target} ms. No se inventa metraje.`;
  let remain = spec.target;
  const lines = [];
  for (const clip of ordered) {
    if (remain <= 0) break;
    const use = Math.min(clip.measuredDurationMs, remain);
    lines.push(`índice ${clip.sequenceIndex}: usar ${use} ms${clip.measuredDurationMs > use ? `, recortar ${clip.measuredDurationMs - use} ms en la copia` : ""}`);
    remain -= use;
  }
  return `PLAN_ONLY. Salida prevista ${spec.target} ms.\nSOLO_EN_APK. verifiedExport=false.\n${lines.join("\n")}`;
}

function mount(which, clip) {
  const well = document.querySelector(which === "reel" ? "#well-reel" : "#well-land");
  const bar = document.querySelector(`.transport[data-which="${which}"]`);
  bar.replaceChildren();
  if (urls[which]) {
    URL.revokeObjectURL(urls[which]);
    urls[which] = null;
  }
  videos[which] = null;
  if (!clip) {
    well.replaceChildren(Object.assign(document.createElement("p"), { textContent: "Sin archivo." }));
    return;
  }
  tx(["blobs"], "readonly", (transaction) => req(transaction.objectStore("blobs").get(clip.clipId))).then((blob) => {
    if (!blob) {
      well.replaceChildren(Object.assign(document.createElement("p"), { textContent: "Manifiesto sin archivo." }));
      return;
    }
    if (urls[which]) URL.revokeObjectURL(urls[which]);
    const url = URL.createObjectURL(blob);
    urls[which] = url;
    const video = document.createElement("video");
    video.src = url;
    video.playsInline = true;
    videos[which] = video;
    well.replaceChildren(video);
    const play = document.createElement("button");
    play.type = "button";
    play.textContent = "Reproducir";
    play.addEventListener("click", () => {
      if (video.paused) video.play();
      else video.pause();
    });
    const seek = document.createElement("input");
    seek.type = "range";
    seek.min = "0";
    seek.step = "0.01";
    seek.value = "0";
    video.addEventListener("loadedmetadata", () => {
      seek.max = String(video.duration || 0);
    });
    video.addEventListener("timeupdate", () => {
      seek.value = String(video.currentTime);
    });
    seek.addEventListener("input", () => {
      video.currentTime = Number(seek.value);
    });
    const vol = document.createElement("input");
    vol.type = "range";
    vol.min = "0";
    vol.max = "1";
    vol.step = "0.05";
    vol.value = "1";
    vol.addEventListener("input", () => {
      video.volume = Number(vol.value);
    });
    bar.append(play, seek, vol);
  });
}

function render() {
  const reel = clips.filter((clip) => clip.profile === "REEL_59").sort((a, b) => a.sequenceIndex - b.sequenceIndex);
  const landProfile = profileEl.value === "REEL_59" ? "LANDSCAPE_5" : profileEl.value;
  const land = clips.filter((clip) => clip.profile === landProfile).sort((a, b) => a.sequenceIndex - b.sequenceIndex);
  mount("reel", reel[0] ?? null);
  mount("land", land[0] ?? null);
  rowsEl.replaceChildren();
  const visible = clips.filter(scope).sort((a, b) => a.sequenceIndex - b.sequenceIndex);
  if (visible.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = "<td colspan='6'>No hay clips de este perfil.</td>";
    rowsEl.append(tr);
  }
  for (const clip of visible) {
    const tr = document.createElement("tr");
    const name = cell(clip.fileName);
    const order = cell(clip.sequenceIndex);
    const agent = cell(clip.agentId);
    const duration = cell(`${clip.measuredDurationMs} ms`);
    const state = cell(clip.status);
    state.className = clip.status === "READY" ? "ok" : clip.status === "BLOCKED" ? "bad" : "hold";
    tr.append(name, order, agent, duration, state);
    const td = document.createElement("td");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "small";
    button.textContent = "Ver";
    button.addEventListener("click", () => mount(clip.profile === "REEL_59" ? "reel" : "land", clip));
    td.append(button);
    tr.append(td);
    rowsEl.append(tr);
  }
  const run = contiguous();
  planEl.textContent = `${planText()}\nTramo contiguo ${run.ms} ms de ${PROFILES[profileEl.value].target} ms.`;
}

filesEl.addEventListener("change", () => {
  const list = [...filesEl.files];
  filesEl.value = "";
  importFiles(list);
});
profileEl.addEventListener("change", render);
document.querySelector("#close").addEventListener("click", () => {
  const run = contiguous();
  if (run.end < 0) {
    say("No hay un clip READY en el índice 0.");
    return;
  }
  closed = true;
  finalIndex = run.end;
  say(`Tema cerrado en 0..${finalIndex}. No empezó otro tema y no hay MP4.`);
  render();
});
document.querySelector("#reopen").addEventListener("click", () => {
  closed = false;
  finalIndex = null;
  say("Secuencia reabierta. Sigue el mismo tema. No hay MP4.");
  render();
});
document.querySelector("#export").title = "SOLO_EN_APK";

load().catch(() => say("Este navegador no abrió la biblioteca local."));
