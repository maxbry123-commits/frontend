/** Contratos locales de YAIWES Cinema. La base de índices es 0. */

export const SCHEMA_VERSION = "yaiwes.clip.v1" as const;
export const SEQUENCE_BASE = 0;
export const MAX_IMPORT_BYTES = 80 * 1024 * 1024;

export const PROFILES = {
  REEL_59: {
    id: "REEL_59",
    label: "Reel 59 s",
    short: "59 s",
    targetMs: 59_000,
    aspect: "9:16",
    orientation: "portrait",
  },
  LANDSCAPE_5: {
    id: "LANDSCAPE_5",
    label: "Horizontal 5 min",
    short: "5 min",
    targetMs: 300_000,
    aspect: "16:9",
    orientation: "landscape",
  },
  LANDSCAPE_10: {
    id: "LANDSCAPE_10",
    label: "Horizontal 10 min",
    short: "10 min",
    targetMs: 600_000,
    aspect: "16:9",
    orientation: "landscape",
  },
} as const;

export type ProfileId = keyof typeof PROFILES;

export const AGENTS = Array.from(
  { length: 12 },
  (_, i) => `grok-session-${String(i + 1).padStart(2, "0")}`,
);

export type ClipStatus = "READY" | "NEEDS_REVIEW" | "BLOCKED";

export interface Clip {
  schemaVersion: typeof SCHEMA_VERSION;
  jobId: string;
  clipId: string;
  idempotencyKey: string;
  projectId: string;
  topicId: string;
  agentId: string;
  profile: ProfileId;
  sequenceIndex: number;
  fileName: string;
  sha256: string;
  declaredDurationMs: number | null;
  measuredDurationMs: number;
  width: number;
  height: number;
  mimeType: string;
  language: string;
  status: ClipStatus;
  hasBlob: boolean;
  aspectAccepted: boolean;
  createdAt: string;
  note: string | null;
}

export interface Project {
  key: string;
  projectId: string;
  topicId: string;
  profile: ProfileId;
  closed: boolean;
  finalSequenceIndex: number | null;
  revision: number;
  status: "OPEN" | "CLOSED";
}

export interface CinemaEvent {
  eventId: string;
  entityId: string;
  type: string;
  createdAt: string;
  details: string;
}

export type GoalStatus = "PASS" | "PARTIAL" | "BLOCKED" | "PENDING" | "FAIL";

export interface GoalRecord {
  id: string;
  name: string;
  status: GoalStatus;
  note: string;
}

export const GOAL_LEDGER: GoalRecord[] = [
  { id: "G01", name: "DISCOVER_AND_BASELINE", status: "PARTIAL", note: "Baseline leído. No hay Android SDK." },
  { id: "G02", name: "COUNCIL_SECURITY_PLAN", status: "PARTIAL", note: "Una instancia, no doce modelos." },
  { id: "G03", name: "FRONTEND_REAL_PREVIEW", status: "PARTIAL", note: "Preview de navegador. No es una APK." },
  { id: "G04", name: "CAPACITOR_ANDROID_SHELL", status: "BLOCKED", note: "Sin Android SDK. No hay APK." },
  { id: "G05", name: "ROOM_STORAGE_BRIDGE", status: "BLOCKED", note: "Room no corre. IndexedDB no es almacenamiento de Android." },
  { id: "G06", name: "LOCAL_INGEST_QUEUE", status: "PARTIAL", note: "Idempotencia y huecos tienen pruebas. No hay WorkManager." },
  { id: "G07", name: "MEDIA3_EXPORT", status: "BLOCKED", note: "No hay export Media3. SOLO_EN_APK." },
  { id: "G08", name: "RELAY_HTTP_MCP", status: "BLOCKED", note: "Relay no configurado. No se inventó un endpoint." },
  { id: "G09", name: "MINI_AGENT_LLM", status: "PARTIAL", note: "Chat local. LLM_NOT_CONFIGURED." },
  { id: "G10", name: "YOUTUBE_PUBLISHER", status: "PARTIAL", note: "YOUTUBE_NOT_CONFIGURED. No publica." },
  { id: "G11", name: "RELEASE_UPDATE", status: "BLOCKED", note: "No hay asset ni URL de release." },
  { id: "G12", name: "END_TO_END_AUDIT", status: "PARTIAL", note: "No es RELEASE_READY ni FULL_59_300_600_READY." },
];

export const REFUTATIONS: { id: string; status: GoalStatus; note: string }[] = [
  { id: "F01", status: "PENDING", note: "No hay teléfono en esta sesión." },
  { id: "F02", status: "PARTIAL", note: "Los MP4 no entran en Git." },
  { id: "F03", status: "PASS", note: "El plan obliga verifiedExport false." },
  { id: "F04", status: "PASS", note: "12x5000 ms recortan a 59000 ms." },
  { id: "F05", status: "PASS", note: "Si falta el índice 6 el plan responde GAP." },
  { id: "F06", status: "PASS", note: "Diez ingestas, un clip." },
  { id: "F07", status: "PASS", note: "Sin ftyp queda BLOCKED." },
  { id: "F08", status: "PENDING", note: "No hay APK ajena." },
  { id: "F09", status: "PASS", note: "El comando local declara LLM_NOT_CONFIGURED." },
  { id: "F10", status: "PARTIAL", note: "Este módulo no escribe una APK." },
];

export function projectKey(parts: { projectId: string; topicId: string; profile: ProfileId }): string {
  return `${parts.projectId}::${parts.topicId}::${parts.profile}`;
}

export function formatClock(ms: number): string {
  const safe = Number.isFinite(ms) ? Math.max(0, Math.round(ms / 1000)) : 0;
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function frameToleranceMs(fps: number): number {
  if (!Number.isFinite(fps) || fps < 1 || fps > 120) return 1000 / 30;
  return 1000 / fps;
}

export function orientationOf(width: number, height: number): "portrait" | "landscape" | "square" {
  if (width === height) return "square";
  return height > width ? "portrait" : "landscape";
}

export function aspectMatches(profile: ProfileId, width: number, height: number): boolean {
  const want = PROFILES[profile].orientation;
  const got = orientationOf(width, height);
  return want === "portrait" ? got === "portrait" : got === "landscape";
}

export function hasFtyp(bytes: Uint8Array): boolean {
  if (bytes.length < 8) return false;
  return bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70;
}

export function classifyIncoming(opts: {
  sniffedMp4: boolean;
  width: number;
  height: number;
  profile: ProfileId;
}): { status: ClipStatus; note: string | null } {
  if (!opts.sniffedMp4) {
    return { status: "BLOCKED", note: "El archivo no tiene caja ftyp de MP4. Queda fuera del ensamblaje." };
  }
  if (!aspectMatches(opts.profile, opts.width, opts.height)) {
    return { status: "NEEDS_REVIEW", note: `Encuadre ${opts.width}x${opts.height} no coincide con ${PROFILES[opts.profile].aspect}.` };
  }
  return { status: "READY", note: null };
}

export type IngestResult =
  | { ok: true; action: "CREATED" | "ACK_DUPLICATE"; clip: Clip }
  | { ok: false; code: "CONFLICT_INDEX" | "CONFLICT_KEY"; reason: string; existingId: string };

function sameSlot(a: Clip, b: Clip): boolean {
  return a.projectId === b.projectId && a.topicId === b.topicId && a.profile === b.profile && a.sequenceIndex === b.sequenceIndex;
}

export function ingestClip(existing: Clip[], incoming: Clip): IngestResult {
  const byKey = existing.find((c) => c.agentId === incoming.agentId && c.idempotencyKey === incoming.idempotencyKey);
  if (byKey) {
    if (byKey.sha256 === incoming.sha256 && byKey.profile === incoming.profile && byKey.projectId === incoming.projectId && byKey.topicId === incoming.topicId && byKey.sequenceIndex === incoming.sequenceIndex) {
      return { ok: true, action: "ACK_DUPLICATE", clip: byKey };
    }
    return { ok: false, code: "CONFLICT_KEY", reason: "Esa clave de idempotencia ya existe con otro manifiesto. No se sustituye el original.", existingId: byKey.clipId };
  }
  const byIndex = existing.find((c) => sameSlot(c, incoming));
  if (byIndex) {
    if (byIndex.sha256 === incoming.sha256) return { ok: true, action: "ACK_DUPLICATE", clip: byIndex };
    return { ok: false, code: "CONFLICT_INDEX", reason: `El índice ${incoming.sequenceIndex} ya tiene otro archivo. No se sobrescribe.`, existingId: byIndex.clipId };
  }
  return { ok: true, action: "CREATED", clip: incoming };
}

export function nextSequenceIndex(clips: Clip[], scope: { projectId: string; topicId: string; profile: ProfileId }): number {
  const mine = clips.filter((c) => c.projectId === scope.projectId && c.topicId === scope.topicId && c.profile === scope.profile);
  if (mine.length === 0) return SEQUENCE_BASE;
  return Math.max(...mine.map((c) => c.sequenceIndex)) + 1;
}

export interface ReadyStats {
  count: number;
  readyCount: number;
  blockedCount: number;
  reviewCount: number;
  sumReadyMs: number;
  contiguousMs: number;
  gaps: number[];
}

export function readyStats(clips: Clip[], scope: { projectId: string; topicId: string; profile: ProfileId }): ReadyStats {
  const mine = clips.filter((c) => c.projectId === scope.projectId && c.topicId === scope.topicId && c.profile === scope.profile);
  const ready = mine.filter((c) => c.status === "READY" && c.hasBlob && c.measuredDurationMs > 0);
  const byIndex = new Map(ready.map((c) => [c.sequenceIndex, c]));
  let contiguousMs = 0;
  let n = SEQUENCE_BASE;
  while (byIndex.has(n)) {
    contiguousMs += byIndex.get(n)!.measuredDurationMs;
    n += 1;
  }
  const max = mine.reduce((m, c) => Math.max(m, c.sequenceIndex), -1);
  const gaps: number[] = [];
  for (let i = SEQUENCE_BASE; i <= max; i += 1) if (!byIndex.has(i)) gaps.push(i);
  return {
    count: mine.length,
    readyCount: ready.length,
    blockedCount: mine.filter((c) => c.status === "BLOCKED").length,
    reviewCount: mine.filter((c) => c.status === "NEEDS_REVIEW").length,
    sumReadyMs: ready.reduce((s, c) => s + c.measuredDurationMs, 0),
    contiguousMs,
    gaps,
  };
}

export interface PlanOk {
  ok: true;
  code: "PLAN_ONLY";
  profile: ProfileId;
  targetMs: number;
  toleranceMs: number;
  used: { clipId: string; sequenceIndex: number; useMs: number; trimMs: number }[];
  expectedDurationMs: number;
  exportStatus: "SOLO_EN_APK";
  verifiedExport: false;
  review: string[];
}

export interface PlanFail {
  ok: false;
  code: "MANIFEST_OPEN" | "GAP" | "DURATION_SHORT" | "ASPECT" | "NO_FILE" | "BAD_FINAL";
  reason: string;
  missing?: number[];
}

export function planAssembly(opts: { clips: Clip[]; project: Project; fps: number }): PlanOk | PlanFail {
  const { clips, project, fps } = opts;
  const spec = PROFILES[project.profile];
  const mine = clips.filter((c) => c.projectId === project.projectId && c.topicId === project.topicId && c.profile === project.profile);
  if (!project.closed || project.finalSequenceIndex == null) {
    return { ok: false, code: "MANIFEST_OPEN", reason: "La secuencia sigue abierta." };
  }
  if (project.finalSequenceIndex < SEQUENCE_BASE) return { ok: false, code: "BAD_FINAL", reason: "El índice final no es válido." };
  const missing: number[] = [];
  const ordered: Clip[] = [];
  for (let i = SEQUENCE_BASE; i <= project.finalSequenceIndex; i += 1) {
    const clip = mine.find((c) => c.sequenceIndex === i);
    if (!clip || clip.status !== "READY" || !clip.hasBlob || clip.measuredDurationMs <= 0) {
      missing.push(i);
      continue;
    }
    if (!aspectMatches(project.profile, clip.width, clip.height) && !clip.aspectAccepted) {
      return { ok: false, code: "ASPECT", reason: `El índice ${i} no coincide con ${spec.aspect}.` };
    }
    ordered.push(clip);
  }
  if (missing.length > 0) return { ok: false, code: "GAP", reason: "Faltan índices contiguos desde 0.", missing };
  const total = ordered.reduce((s, c) => s + c.measuredDurationMs, 0);
  if (total < spec.targetMs) return { ok: false, code: "DURATION_SHORT", reason: `Duración medida ${total} ms, objetivo ${spec.targetMs} ms.` };
  let remain: number = spec.targetMs;
  const used: PlanOk["used"] = [];
  for (const clip of ordered) {
    if (remain <= 0) break;
    if (clip.measuredDurationMs <= remain) {
      used.push({ clipId: clip.clipId, sequenceIndex: clip.sequenceIndex, useMs: clip.measuredDurationMs, trimMs: 0 });
      remain -= clip.measuredDurationMs;
    } else {
      used.push({ clipId: clip.clipId, sequenceIndex: clip.sequenceIndex, useMs: remain, trimMs: clip.measuredDurationMs - remain });
      remain = 0;
    }
  }
  const expectedDurationMs = used.reduce((s, u) => s + u.useMs, 0);
  return {
    ok: true,
    code: "PLAN_ONLY",
    profile: project.profile,
    targetMs: spec.targetMs,
    toleranceMs: frameToleranceMs(fps),
    used,
    expectedDurationMs,
    exportStatus: "SOLO_EN_APK",
    verifiedExport: false,
    review: ["Plan de corte solamente. No existe un MP4 de salida."],
  };
}

export function openProject(parts: { projectId: string; topicId: string; profile: ProfileId }): Project {
  return {
    key: projectKey(parts),
    projectId: parts.projectId,
    topicId: parts.topicId,
    profile: parts.profile,
    closed: false,
    finalSequenceIndex: null,
    revision: 0,
    status: "OPEN",
  };
}

function isBlockedHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal") || host.endsWith(".localhost")) return true;
  const v4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (v4) {
    const a = Number(v4[1]);
    const b = Number(v4[2]);
    if ([a, b, Number(v4[3]), Number(v4[4])].some((n) => n > 255)) return true;
    if (a === 10 || a === 127 || a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
    return false;
  }
  if (host === "::1" || host === "0:0:0:0:0:0:0:1") return true;
  if (host.startsWith("fe80:") || host.startsWith("fc") || host.startsWith("fd")) return true;
  return false;
}

export function remoteUrlVerdict(raw: string): { ok: true; url: URL } | { ok: false; reason: string } {
  let url: URL;
  try { url = new URL(raw.trim()); } catch { return { ok: false, reason: "La URL no es válida." }; }
  if (url.username || url.password) return { ok: false, reason: "La URL no puede incluir usuario o clave." };
  if (url.protocol !== "https:") return { ok: false, reason: "Solo se acepta HTTPS." };
  if (isBlockedHost(url.hostname)) return { ok: false, reason: "Ese host es loopback, red privada o metadatos." };
  return { ok: true, url };
}

export function publicUrlLabel(url: URL): string {
  return url.host;
}

export interface FitPiece {
  sequenceIndex: number;
  id: string;
  sourceMs: number;
  useMs: number;
  trimMs: number;
}

export function fitMeasured(
  sequence: { id: string; sourceMs: number }[],
  targetMs: number,
): { status: "FIT" | "DURATION_SHORT"; remainMs: number; pieces: FitPiece[] } {
  const pieces: FitPiece[] = [];
  let remain = targetMs;
  for (const item of sequence) {
    if (remain <= 0) break;
    if (!Number.isFinite(item.sourceMs) || item.sourceMs <= 0) continue;
    const useMs = Math.min(item.sourceMs, remain);
    pieces.push({ sequenceIndex: pieces.length, id: item.id, sourceMs: item.sourceMs, useMs, trimMs: item.sourceMs - useMs });
    remain -= useMs;
  }
  return { status: remain > 0 ? "DURATION_SHORT" : "FIT", remainMs: Math.max(0, remain), pieces };
}
