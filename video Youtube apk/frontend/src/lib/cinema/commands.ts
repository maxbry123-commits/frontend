import {
  AGENTS,
  formatClock,
  planAssembly,
  PROFILES,
  readyStats,
  type Clip,
  type ProfileId,
  type Project,
} from "./model.ts";

export interface CommandContext {
  projectId: string;
  topicId: string;
  profile: ProfileId;
  fps: number;
  clips: Clip[];
  project: Project;
  storageLabel: string;
}

export interface CommandResult {
  text: string;
  titleDraft?: string;
}

function scopeOf(ctx: CommandContext) {
  return { projectId: ctx.projectId, topicId: ctx.topicId, profile: ctx.profile };
}

export function runCommand(raw: string, ctx: CommandContext): CommandResult {
  const text = raw.trim();
  const lower = text.toLowerCase();
  if (!text) return { text: "Escribe ayuda para ver los comandos locales." };

  if (["ayuda", "help", "?"].includes(lower)) {
    return {
      text: [
        "LLM_NOT_CONFIGURED. Respondo solo con la cola local, sin proveedor externo.",
        "Comandos: listar cola · almacenamiento · estado · agentes · plan · borrador de titulo …",
        "No edito la aplicación ni publico en YouTube.",
      ].join("\n"),
    };
  }

  if (lower.startsWith("borrador") || lower.startsWith("titulo") || lower.startsWith("título")) {
    const custom = text.replace(/^(borrador( de titulo| de título)?|titulo|título)\s*/i, "").trim();
    const spec = PROFILES[ctx.profile];
    const title =
      custom || `${ctx.projectId} · ${ctx.topicId} · ${spec.label}`;
    return {
      text: `Borrador local, no publicado: “${title}”. YOUTUBE_NOT_CONFIGURED.`,
      titleDraft: title,
    };
  }

  if (lower === "almacenamiento" || lower === "mostrar almacenamiento") {
    return {
      text: `Almacenamiento de esta vista: ${ctx.storageLabel}. Es IndexedDB del navegador, no la carpeta privada de una APK. Puede desaparecer si el navegador desaloja el sitio.`,
    };
  }

  if (lower === "agentes") {
    const lines = AGENTS.map((agent) => {
      const n = ctx.clips.filter(
        (c) =>
          c.agentId === agent &&
          c.projectId === ctx.projectId &&
          c.topicId === ctx.topicId &&
          c.profile === ctx.profile,
      ).length;
      return `${agent}: ${n}`;
    });
    return { text: lines.join("\n") };
  }

  if (lower === "listar cola" || lower === "cola") {
    const mine = ctx.clips
      .filter(
        (c) =>
          c.projectId === ctx.projectId && c.topicId === ctx.topicId && c.profile === ctx.profile,
      )
      .sort((a, b) => a.sequenceIndex - b.sequenceIndex);
    if (mine.length === 0) return { text: "La cola de este tema está vacía." };
    return {
      text: mine
        .map(
          (c) =>
            `${c.sequenceIndex} · ${c.agentId} · ${formatClock(c.measuredDurationMs)} · ${c.status} · ${c.fileName}`,
        )
        .join("\n"),
    };
  }

  if (lower === "estado" || lower === "estado del proyecto") {
    const stats = readyStats(ctx.clips, scopeOf(ctx));
    const spec = PROFILES[ctx.profile];
    return {
      text: [
        `${ctx.projectId} / ${ctx.topicId} / ${spec.label}`,
        ctx.project.closed
          ? `Cerrado en el índice ${ctx.project.finalSequenceIndex}. Revisión ${ctx.project.revision}.`
          : "Abierto. No hay cierre de manifiesto.",
        `Listos ${stats.readyCount}/${stats.count}. Suma contigua ${stats.contiguousMs} ms de ${spec.targetMs} ms.`,
        stats.gaps.length ? `Huecos: ${stats.gaps.join(", ")}` : "Sin huecos en el prefijo inspeccionado.",
        "Exportados verificados: 0.",
      ].join("\n"),
    };
  }

  if (lower === "plan") {
    const plan = planAssembly({ clips: ctx.clips, project: ctx.project, fps: ctx.fps });
    if (!plan.ok) return { text: `${plan.code}: ${plan.reason}` };
    return {
      text: `PLAN_ONLY. Salida prevista ${plan.expectedDurationMs} ms. ${plan.exportStatus}. verifiedExport=${String(plan.verifiedExport)}.`,
    };
  }

  return {
    text: "No reconozco ese comando. No voy a inventar una respuesta de modelo: LLM_NOT_CONFIGURED. Escribe ayuda.",
  };
}
