export const AGENTS = [
  {
    id: "hermes",
    role: "director",
    name: "Hermes",
    executes: false,
    runtime: "NOT_A_LOCAL_RUNTIME",
    duty: "Abre la nota, ordena a los tres agentes y cierra la revisión. No corre código en el teléfono.",
  },
  {
    id: "guion",
    role: "executor",
    name: "Guion",
    executes: true,
    runtime: "SANDBOX_LOCAL",
    duty: "Convierte la nota en un guion de una frase por plano.",
  },
  {
    id: "plano",
    role: "executor",
    name: "Plano",
    executes: true,
    runtime: "SANDBOX_LOCAL",
    duty: "Escribe el tamaño de plano, la luz y el encuadre que el modelo debe copiar.",
  },
  {
    id: "montaje",
    role: "executor",
    name: "Montaje",
    executes: true,
    runtime: "SANDBOX_LOCAL",
    duty: "Ordena el corte, el audio y el paquete. No publica.",
  },
] as const;

export const SCORE = [
  { step: 1, id: "nota", agent: "hermes", title: "Nota", must: "Leer la nota del usuario y no inventar un encargo distinto." },
  { step: 2, id: "memoria", agent: "hermes", title: "Memoria", must: "Usar solo los adjuntos presentes. Si no hay archivo, decir que falta." },
  { step: 3, id: "guion", agent: "guion", title: "Guion", must: "Una frase por plano. Sin adjetivos vacíos." },
  { step: 4, id: "plano", agent: "plano", title: "Plano", must: "Tamaño, luz, ángulo y mirada. Un plano de 9:16." },
  { step: 5, id: "ritmo", agent: "plano", title: "Ritmo", must: "Marcar inicio y duración. No usar las palabras cinematic, epic, stunning, masterpiece." },
  { step: 6, id: "codigo", agent: "plano", title: "Código", must: "Dejar el HTML o el código que el siguiente agente replica, no un ajuste manual." },
  { step: 7, id: "corte", agent: "montaje", title: "Corte", must: "Encadenar los planos en orden. No repetir una toma si la nota no lo pide." },
  { step: 8, id: "audio", agent: "montaje", title: "Audio", must: "Dejar voz y música en pistas separadas. No copiar una partitura ajena." },
  { step: 9, id: "paquete", agent: "montaje", title: "Paquete", must: "Título, descripción, etiquetas y aviso de IA. Estado NOT_UPLOADED." },
  { step: 10, id: "cierre", agent: "hermes", title: "Cierre", must: "Revisar que los tres agentes entregaron su paso. Si falta uno, no dar por hecho el video." },
] as const;

export const PORTS = {
  http: "/api/studio",
  mcp: "/api/mcp",
  sdk: "yaiwes.studio.http.v1",
  llmRemote: "grok-4.3",
  llmLocal: "NOT_INSTALLED",
  apk: "BLOCKED_NO_SDK",
  androidStorage: "INDEXEDDB_BROWSER",
  capacitor: "NOT_INSTALLED",
  media3: "NOT_INSTALLED",
  hermesRuntime: "NOT_A_LOCAL_RUNTIME",
  youtube: "NO_OAUTH",
} as const;
