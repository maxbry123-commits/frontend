import { useEffect, useMemo, useState } from "react";
import nuevoCatalog from "../../../public/cinema/nuevo.json";
import libraryCatalog from "@/lib/cinema/library.json";
import { previewPathPrefix } from "@/lib/preview-path-prefix";
import { VERSION, VERSIONES } from "@/lib/cinema/versiones";
import { ENGINE_LINE } from "@/lib/cinema/engines";
import { AGENTS, PORTS, SCORE } from "@/lib/cinema/partitura";
import { loadLibrary, putBlob, putClip } from "@/lib/cinema/db";
import { probeVideo, sha256Hex } from "@/lib/cinema/media";
import {
  classifyIncoming,
  hasFtyp,
  ingestClip,
  nextSequenceIndex,
  SCHEMA_VERSION,
  type Clip,
  type ProfileId,
} from "@/lib/cinema/model";

type Film = { id: string; title: string; src: string; poster: string };

type Youtube = {
  status: string;
  reason: string;
  title: string;
  description: string;
  tags: string[];
  chaptersNote: string;
  thumbnail: string;
  pinned: string;
  disclosure: string;
};

type Result = {
  status: "READY" | "RENDERING" | "PLAN" | "FAILED";
  jobId: string | null;
  plantilla: { id: string; name: string; engine: string };
  code: string;
  qwen: { id: string; name: string; code: string };
  youtube: Youtube;
  video: string | null;
  note?: string;
  error?: string | null;
};

function publicPath(path: string) {
  if (typeof window === "undefined") return path;
  const prefix = previewPathPrefix(window.location.hostname, window.location.pathname) ?? "";
  return `${prefix}${path}`;
}

const archive: Film[] = [
  { id: "reel-59", title: "Reel 59 s", src: "/cinema/films/reel-59.mp4", poster: "/cinema/posters/reel-59.jpg" },
  { id: "yt-01", title: "Corto · El arquitecto", src: "/cinema/films/yt-01.mp4", poster: "/cinema/posters/yt-01.jpg" },
  { id: "yt-02", title: "Corto · La escotilla", src: "/cinema/films/yt-02.mp4", poster: "/cinema/posters/yt-02.jpg" },
  ...nuevoCatalog.films.map((film) => ({
    id: film.id,
    title: film.title,
    src: film.src,
    poster: film.poster,
  })),
  ...libraryCatalog.films.map((film) => ({
    id: film.id,
    title: film.title,
    src: film.src,
    poster: `/cinema/posters/${film.id}.jpg`,
  })),
];

export function Replica() {
  const [url, setUrl] = useState("");
  const [filmId, setFilmId] = useState(archive[0]?.id ?? "");
  const [image, setImage] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<string | null>(null);
  const [fileLabel, setFileLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [note, setNote] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [direction, setDirection] = useState("");
  const [queueNote, setQueueNote] = useState("Leyendo la cola local.");
  const [landId, setLandId] = useState("land-01");
  const film = useMemo(() => archive.find((item) => item.id === filmId) ?? archive[0], [filmId]);
  const lands = useMemo(() => archive.filter((item) => item.id.startsWith("land-")), []);
  const land = lands.find((item) => item.id === landId) ?? lands[0];
  const playing = result?.video || film?.src || "";

  useEffect(() => {
    const saved = localStorage.getItem("yaiwes-nota");
    const files = localStorage.getItem("yaiwes-adjuntos");
    if (saved) setNote(saved);
    if (files) {
      try {
        const names = JSON.parse(files) as unknown;
        if (Array.isArray(names)) setAttachments(names.filter((item): item is string => typeof item === "string").slice(0, 8));
      } catch {
        /* memoria vacía */
      }
    }
    loadLibrary()
      .then(({ clips }) => setQueueNote(`${clips.length} clips en la cola de este navegador.`))
      .catch(() => setQueueNote("La cola local no respondió."));
  }, []);

  async function followScore() {
    const text = note.trim();
    if (!text) {
      setError("Escribe la nota de lo que debe construir.");
      return;
    }
    setBusy(true);
    setError("");
    localStorage.setItem("yaiwes-nota", text);
    localStorage.setItem("yaiwes-adjuntos", JSON.stringify(attachments));
    try {
      const response = await fetch(publicPath("/api/studio"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "seguir", note: text, attachments }),
      });
      const body = (await response.json()) as { ok?: boolean; error?: string; director?: { text?: string | null; error?: string | null } };
      if (!response.ok || body.ok === false) {
        setError(body.error || "La partitura no avanzó.");
        return;
      }
      setDirection(body.director?.text || "Hermes dejó la cadena lista. El modelo remoto no añadió texto.");
    } catch {
      setError("No se pudo seguir la partitura.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!result || result.status !== "RENDERING" || !result.jobId) return;
    let stop = false;
    let timer = 0;
    const tick = async () => {
      try {
        const response = await fetch(publicPath("/api/studio"), {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action: "replicate_status", jobId: result.jobId }),
        });
        const body = (await response.json()) as Result & { ok?: boolean; error?: string };
        if (stop) return;
        if (!response.ok || body.ok === false) {
          setError(body.error || "No se pudo seguir el plano.");
          setBusy(false);
          return;
        }
        setResult(body);
        if (body.status === "RENDERING") timer = window.setTimeout(tick, 4000);
        else setBusy(false);
      } catch {
        if (!stop) timer = window.setTimeout(tick, 4000);
      }
    };
    timer = window.setTimeout(tick, 4000);
    return () => {
      stop = true;
      window.clearTimeout(timer);
    };
  }, [result]);

  async function onFile(file: File | undefined) {
    setError("");
    setImage(null);
    setVideoFile(null);
    setFileLabel("");
    if (!file) return;
    const imageOk = file.type.startsWith("image/") && file.size <= 1_600_000;
    const videoOk = file.type.startsWith("video/") && file.size <= 12_000_000;
    if (!imageOk && !videoOk) {
      setError(file.type.startsWith("video/") ? "Ese video pesa demasiado. Elige una toma del archivo." : "Usa una imagen de menos de 1.5 MB.");
      return;
    }
    const data = await file.arrayBuffer();
    const bytes = new Uint8Array(data);
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    const encoded = `data:${file.type};base64,${btoa(binary)}`;
    if (imageOk) setImage(encoded);
    else setVideoFile(encoded);
    setFileLabel(file.name);
    if (!videoOk) return;
    try {
      const probe = await probeVideo(file);
      const profile: ProfileId = probe.height > probe.width ? "REEL_59" : "LANDSCAPE_5";
      const judged = classifyIncoming({
        sniffedMp4: hasFtyp(bytes),
        width: probe.width,
        height: probe.height,
        profile,
      });
      const hash = await sha256Hex(data);
      const library = await loadLibrary();
      const scope = { projectId: "sala", topicId: "import", profile };
      const incoming: Clip = {
        schemaVersion: SCHEMA_VERSION,
        jobId: `job-${hash.slice(0, 12)}`,
        clipId: `clip-${hash.slice(0, 12)}`,
        idempotencyKey: hash,
        projectId: scope.projectId,
        topicId: scope.topicId,
        agentId: "grok-session-01",
        profile,
        sequenceIndex: nextSequenceIndex(library.clips, scope),
        fileName: file.name.slice(0, 80),
        sha256: hash,
        declaredDurationMs: null,
        measuredDurationMs: probe.durationMs,
        width: probe.width,
        height: probe.height,
        mimeType: file.type || "video/mp4",
        language: "es-419",
        status: judged.status,
        hasBlob: true,
        aspectAccepted: judged.status === "READY",
        createdAt: new Date().toISOString(),
        note: judged.note,
      };
      const stored = ingestClip(library.clips, incoming);
      if (!stored.ok) {
        setQueueNote(stored.reason);
        return;
      }
      if (stored.action === "CREATED") {
        await putClip(stored.clip);
        await putBlob(stored.clip.clipId, file);
      }
      const again = await loadLibrary();
      setQueueNote(
        `${again.clips.length} clips. Último: ${stored.action}, ${probe.durationMs} ms, ${probe.width}×${probe.height}, ${judged.status}.`,
      );
    } catch {
      setQueueNote("El archivo se eligió, pero la cola no pudo medirlo.");
    }
  }

  async function replicate() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(publicPath("/api/studio"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "replicate",
          url: image || videoFile ? "" : url.trim(),
          filmId: image || videoFile || url.trim() ? "" : filmId,
          title: film?.title ?? "",
          imageBase64: image,
          videoBase64: videoFile,
        }),
      });
      const body = (await response.json()) as Result & { ok?: boolean; error?: string };
      if (!response.ok || body.ok === false) {
        setError(body.error || "No se pudo replicar.");
        setBusy(false);
        return;
      }
      setResult(body);
      if (body.status !== "RENDERING") setBusy(false);
    } catch {
      setError("No se pudo replicar.");
      setBusy(false);
    }
  }

  return (
    <main className="min-h-dvh bg-bg text-fg antialiased">
      <div className="mx-auto flex min-w-0 max-w-5xl flex-col gap-4 p-3 lg:p-5">
        <header className="flex items-baseline justify-between gap-3">
          <div>
            <p className="text-sm text-muted">YAIWES</p>
            <h1 className="text-balance text-2xl font-medium tracking-tight">Réplica</h1>
          </div>
          <p className="text-sm tabular-nums text-muted">{VERSION}</p>
        </header>
        <p className="max-w-2xl text-pretty text-muted">
          Sube una imagen, pega un enlace visible de YouTube o elige una toma del archivo. El modelo replica el código de la plantilla. Tú no ajustas la luz.
        </p>
        <p className="max-w-2xl text-pretty text-sm text-muted">{ENGINE_LINE}</p>
        <section className="grid min-w-0 gap-3 rounded-2xl bg-panel p-3 lg:grid-cols-[minmax(0,1fr)_auto]">
          <label className="block min-w-0">
            <span className="mb-1 block text-sm text-muted">Enlace de YouTube</span>
            <input
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://www.youtube.com/watch?v="
              className="min-h-11 w-full min-w-0 rounded-lg border border-line bg-well px-3 text-fg outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            />
          </label>
          <div className="flex flex-wrap items-end gap-2">
            <label className="inline-flex min-h-11 cursor-pointer items-center rounded-lg border border-line bg-module px-4 text-sm">
              Imagen o video
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                className="sr-only"
                onChange={(event) => void onFile(event.target.files?.[0])}
              />
            </label>
            <button
              type="button"
              className="min-h-11 rounded-lg bg-accent px-4 font-medium text-accent-ink disabled:opacity-50"
              disabled={busy}
              onClick={() => void replicate()}
            >
              {busy ? "Replicando" : "Replicar"}
            </button>
          </div>
          {fileLabel ? <p className="text-sm text-muted lg:col-span-2">{fileLabel}</p> : null}
          {error ? <p className="text-sm text-danger lg:col-span-2">{error}</p> : null}
        </section>

        <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="flex min-w-0 flex-col gap-3">
            <div className="grid min-w-0 gap-3 lg:grid-cols-2">
              <div className="min-w-0">
                <p className="mb-1 text-sm text-muted">9:16 · archivo seleccionado</p>
                {playing ? (
                  <video
                    key={playing}
                    className="aspect-[9/16] max-h-[68dvh] w-auto max-w-full rounded-lg bg-well"
                    src={playing.startsWith("http") ? playing : publicPath(playing)}
                    poster={film && !result?.video ? publicPath(film.poster) : undefined}
                    controls
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <p className="p-8 text-muted">El archivo está vacío.</p>
                )}
                <p className="mt-1 text-sm text-muted">Contrato 9:16: reel-59 mide 59.000 ms. El original de 60 s sigue en el archivo.</p>
              </div>
              <div className="min-w-0">
                <label className="mb-1 flex items-center justify-between gap-2 text-sm text-muted">
                  <span>16:9</span>
                  <select
                    value={land?.id ?? "land-01"}
                    onChange={(event) => setLandId(event.target.value)}
                    className="min-h-11 rounded-lg border border-line bg-well px-2 text-fg"
                  >
                    {lands.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </label>
                <video
                  key={land?.src ?? "land"}
                  className="aspect-video w-full rounded-lg bg-well"
                  src={publicPath(land?.src ?? "/cinema/films/land-01.mp4")}
                  poster={publicPath(land?.poster ?? "/cinema/posters/land-01.jpg")}
                  controls
                  playsInline
                  preload="metadata"
                />
                <p className="mt-1 text-sm text-muted">
                  {land?.id === "land-01" ? "land-01 decodifica 300.000 ms, 1280×720." : "Este horizontal aún no tiene decodificación completa."} {queueNote} No hay un MP4 de 600.000 ms.
                </p>
              </div>
            </div>
            {result ? (
              <div className="min-w-0 rounded-2xl bg-panel p-3">
                <p className="text-sm text-muted">
                  {result.plantilla.engine} · {result.plantilla.id}
                </p>
                <h2 className="text-lg font-medium">{result.plantilla.name}</h2>
                <p className="mt-1 text-sm text-muted">{result.note || result.error || result.status}</p>
                <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-well p-3 text-sm text-fg">{result.code}</pre>
                <h3 className="mt-4 text-sm font-medium text-muted">Código Qwen, sin ejecutar</h3>
                <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap rounded-lg bg-well p-3 text-sm">{result.qwen.code}</pre>
              </div>
            ) : null}
          </div>
          <aside className="min-w-0 rounded-2xl bg-panel p-3">
            <h2 className="text-sm font-medium">YouTube</h2>
            {result ? (
              <div className="mt-2 flex flex-col gap-2 text-sm">
                <p className="font-medium">{result.youtube.title}</p>
                <p className="text-danger">{result.youtube.status} · {result.youtube.reason}</p>
                <p className="whitespace-pre-wrap text-muted">{result.youtube.description}</p>
                <p className="text-muted">{result.youtube.chaptersNote}</p>
                <p>Miniatura: {result.youtube.thumbnail}</p>
                <p>Fijado: {result.youtube.pinned}</p>
                <p className="text-muted">{result.youtube.tags.join(" · ")}</p>
                <p>{result.youtube.disclosure}</p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted">El paquete aparece cuando el modelo replica. No se publica.</p>
            )}
          </aside>
        </section>

        <section className="min-w-0">
          <h2 className="mb-2 text-sm font-medium">Archivo de tomas</h2>
          <div className="flex min-w-0 gap-2 overflow-x-auto">
            {archive.map((item) => (
              <button
                key={item.id}
                type="button"
                data-active={item.id === filmId}
                onClick={() => {
                  setFilmId(item.id);
                  setImage(null);
                  setVideoFile(null);
                  setFileLabel("");
                }}
                className="w-28 shrink-0 rounded-2xl bg-panel p-2 text-left data-[active=true]:bg-selected"
              >
                <img src={publicPath(item.poster)} alt="" className="aspect-[9/16] w-full rounded-lg object-cover" />
                <span className="mt-1 block text-sm">{item.title}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-panel p-3">
          <h2 className="text-sm font-medium">Partitura</h2>
          <p className="mt-1 text-sm text-muted">Hermes dirige. Guion, Plano y Montaje ejecutan en este orden. Hermes no corre en el teléfono.</p>
          <label className="mt-3 block">
            <span className="mb-1 block text-sm text-muted">Nota para la AI</span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value.slice(0, 800))}
              rows={3}
              className="min-h-24 w-full min-w-0 rounded-lg border border-line bg-well px-3 py-2 text-fg outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            />
          </label>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <label className="inline-flex min-h-11 cursor-pointer items-center rounded-lg border border-line bg-module px-4 text-sm">
              Adjuntos de memoria
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,text/plain,application/json"
                className="sr-only"
                onChange={(event) => {
                  const files = Array.from(event.target.files ?? []).slice(0, 8);
                  const names = files.map((file) => file.name.slice(0, 80));
                  setAttachments(names);
                  localStorage.setItem("yaiwes-adjuntos", JSON.stringify(names));
                  const request = indexedDB.open("yaiwes-handoff", 1);
                  request.onupgradeneeded = () => {
                    if (!request.result.objectStoreNames.contains("files")) request.result.createObjectStore("files");
                  };
                  request.onsuccess = () => {
                    const db = request.result;
                    const tx = db.transaction("files", "readwrite");
                    const store = tx.objectStore("files");
                    store.clear();
                    for (const file of files) {
                      if (file.size <= 8_000_000) store.put(file, file.name);
                    }
                  };
                }}
              />
            </label>
            <button
              type="button"
              className="min-h-11 rounded-lg bg-accent px-4 font-medium text-accent-ink disabled:opacity-50"
              disabled={busy}
              onClick={() => void followScore()}
            >
              Seguir partitura
            </button>
          </div>
          {attachments.length ? <p className="mt-2 text-sm text-muted">{attachments.join(" · ")}</p> : null}
          {direction ? <p className="mt-2 text-sm">{direction}</p> : null}
          <ol className="mt-3 flex flex-col gap-1">
            {SCORE.map((row) => (
              <li key={row.id} className="text-sm">
                <span className="tabular-nums text-muted">{row.step}.</span> {row.title}
                <span className="text-muted"> — {row.agent}. {row.must}</span>
              </li>
            ))}
          </ol>
          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <p>HTTP {PORTS.http}</p>
            <p>MCP {PORTS.mcp}</p>
            <p>SDK {PORTS.sdk}</p>
            <p>LLM local {PORTS.llmLocal}</p>
            <p>Hermes {PORTS.hermesRuntime}</p>
            <p>APK {PORTS.apk}</p>
            <p className="sm:col-span-2 text-muted">Almacén local del navegador. Capacitor y Media3 no están instalados.</p>
          </div>
          <ul className="mt-2 flex flex-col gap-1">
            {AGENTS.map((agent) => (
              <li key={agent.id} className="text-sm">
                <span className="font-medium">{agent.name}</span>
                <span className="text-muted"> — {agent.duty}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl bg-panel p-3">
          <h2 className="text-sm font-medium">Versiones</h2>
          <ul className="mt-2 flex flex-col gap-2">
            {VERSIONES.map((item) => (
              <li key={item.id} className="text-sm">
                <span className="font-medium">{item.id}</span>
                <span className="text-muted"> — {item.note}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
