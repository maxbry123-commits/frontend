/** Cartilla del estudio. Cada etapa tiene su propio system prompt, separado de la idea. */

export const STUDIO_HTTP = "/api/studio";
export const STUDIO_MCP = "/api/mcp";

export interface StudioSystem {
  id: string;
  name: string;
  repo: string;
  branch: string;
  path: string;
  license: string;
  stage: string;
  teaches: string;
}

export interface StudioSkill {
  id: string;
  name: string;
  group: "camera" | "light" | "image" | "audio" | "paper" | "deliver";
  systemPrompt: string;
}

export interface StudioStage {
  id: string;
  name: string;
  agentId: string;
  systemId: string | null;
  systemPrompt: string;
}

export const SYSTEMS: StudioSystem[] = [
  { id: "otio", name: "OpenTimelineIO", repo: "AcademySoftwareFoundation/OpenTimelineIO", branch: "main", path: "README.md", license: "Apache-2.0", stage: "edit", teaches: "Línea de tiempo editorial en JSON. El agente lee cortes, no inventa metraje." },
  { id: "opencolorio", name: "OpenColorIO", repo: "AcademySoftwareFoundation/OpenColorIO", branch: "main", path: "README.md", license: "BSD-3-Clause", stage: "grade", teaches: "Gestión de color. ACES no está instalado: el grado real es eq de ffmpeg." },
  { id: "openexr", name: "OpenEXR", repo: "AcademySoftwareFoundation/openexr", branch: "main", path: "README.md", license: "BSD-3-Clause", stage: "master", teaches: "Fotograma de alto rango. Esta mesa masteriza H.264, no EXR." },
  { id: "materialx", name: "MaterialX", repo: "AcademySoftwareFoundation/MaterialX", branch: "main", path: "README.md", license: "Apache-2.0", stage: "light", teaches: "Look de material. No hay shader 3D en esta mesa." },
  { id: "openusd", name: "OpenUSD", repo: "PixarAnimationStudios/OpenUSD", branch: "dev", path: "README.md", license: "TOST-1.0", stage: "camera", teaches: "Escena 3D. Blender y USD no están instalados." },
  { id: "mlt", name: "MLT", repo: "mltframework/mlt", branch: "master", path: "README.md", license: "LGPL-2.1", stage: "edit", teaches: "Grafo de productores y playlists. El empatado local hace ese papel." },
  { id: "shotcut", name: "Shotcut", repo: "mltframework/shotcut", branch: "master", path: "README.md", license: "GPL-3.0", stage: "edit", teaches: "NLE sobre MLT. La cola es la lista de planos." },
  { id: "kdenlive", name: "Kdenlive", repo: "KDE/kdenlive", branch: "master", path: "README.md", license: "GPL-3.0", stage: "edit", teaches: "Pistas y transiciones. Aquí la transición es el corte seco medido." },
  { id: "openshot", name: "OpenShot", repo: "OpenShot/openshot-qt", branch: "develop", path: "README.md", license: "GPL-3.0", stage: "edit", teaches: "Proyecto .osp. Exportamos OTIO y EDL, no un .osp." },
  { id: "olive", name: "Olive", repo: "olive-editor/olive", branch: "master", path: "README.md", license: "GPL-3.0", stage: "review", teaches: "NLE por nodos. Los marcadores son los nodos de nota." },
  { id: "natron", name: "Natron", repo: "NatronGitHub/Natron", branch: "master", path: "README.md", license: "GPL-2.0", stage: "grade", teaches: "Composición por nodos. No está instalado." },
  { id: "openfx", name: "OpenFX", repo: "AcademySoftwareFoundation/openfx", branch: "main", path: "README.md", license: "BSD-3-Clause", stage: "image", teaches: "Plugins de efecto. Los efectos vivos son filtros ffmpeg." },
  { id: "blender", name: "Blender", repo: "blender/blender", branch: "main", path: "README.md", license: "GPL-2.0-or-later", stage: "camera", teaches: "3D y VSE. Estado: NOT_INSTALLED." },
  { id: "moviepy", name: "MoviePy", repo: "Zulko/moviepy", branch: "master", path: "README.rst", license: "MIT", stage: "edit", teaches: "Corte programado en Python. El rehacer llama a ffmpeg, no a MoviePy." },
  { id: "remotion", name: "Remotion", repo: "remotion-dev/remotion", branch: "main", path: "README.md", license: "SEE LICENSE", stage: "deliver", teaches: "Video como código React. La plantilla local es el DSL de esta mesa." },
  { id: "gstreamer", name: "GStreamer", repo: "GStreamer/gstreamer", branch: "main", path: "README.md", license: "LGPL-2.1", stage: "master", teaches: "Grafo de medios. El filtergraph de ffmpeg es el grafo que sí corre." },
  { id: "ffmpeg", name: "FFmpeg", repo: "FFmpeg/FFmpeg", branch: "master", path: "README.md", license: "LGPL/GPL", stage: "master", teaches: "Codificación, escala, crop de cámara, eq de luz y mezcla." },
  { id: "aegisub", name: "Aegisub", repo: "TypesettingTools/Aegisub", branch: "master", path: "README.md", license: "BSD-3-Clause", stage: "dub", teaches: "Tiempo de diálogo. El doblaje aquí es voz sintetizada, no un ASS." },
  { id: "ardour", name: "Ardour", repo: "Ardour/ardour", branch: "master", path: "README", license: "GPL-2.0", stage: "mix", teaches: "Mezcla. La voz va delante y la banda original debajo." },
  { id: "theatre", name: "Theatre.js", repo: "theatre-js/theatre", branch: "main", path: "README.md", license: "Apache-2.0", stage: "camera", teaches: "Curvas de cámara. El push y el drift son el crop animado." },
];

export const SKILLS: StudioSkill[] = [
  { id: "camera_push", name: "Cámara push", group: "camera", systemPrompt: "Solo decides el movimiento de cámara. En esta mesa push es un acercamiento lineal de un minuto. No cambies la idea ni el doblaje." },
  { id: "camera_drift", name: "Cámara drift", group: "camera", systemPrompt: "Solo decides el movimiento. Drift es un paneo lento. No reescribas el guion." },
  { id: "camera_hold", name: "Cámara fija", group: "camera", systemPrompt: "Solo decides el movimiento. Hold no desplaza el encuadre. No añadas planos que no estén medidos." },
  { id: "light_cool", name: "Luz fría", group: "light", systemPrompt: "Solo la luz. Fría baja el rojo y sube el azul con eq. No digas que corriste ACES." },
  { id: "light_warm", name: "Luz cálida", group: "light", systemPrompt: "Solo la luz. Cálida sube el rojo. No toques la banda sonora." },
  { id: "light_soft", name: "Luz suave", group: "light", systemPrompt: "Solo la luz. Suave baja el contraste. No inventes una fuente práctica que no esté en el plano." },
  { id: "light_rim", name: "Luz de borde", group: "light", systemPrompt: "Solo la luz. Borde es contraste alto y azul. No afirmes un render 3D." },
  { id: "vignette", name: "Viñeta", group: "image", systemPrompt: "Solo el borde del cuadro. Una viñeta suave. No recortes el tiempo." },
  { id: "grain", name: "Grano", group: "image", systemPrompt: "Solo textura. Grano leve de ffmpeg. Si el filtro falla, dilo y no finjas película." },
  { id: "grade_note", name: "Nota de grado", group: "image", systemPrompt: "Declara el intento de color. OpenColorIO y ACES no están instalados. El grado aplicado es el eq de la luz elegida." },
  { id: "dub_jarvis", name: "Locutor Jarvis", group: "audio", systemPrompt: "Solo el doblaje. Voz orion, inglés, tono de ingeniero calmo. No copies una frase de una película." },
  { id: "dub_announcer", name: "Locutor de sala", group: "audio", systemPrompt: "Solo el doblaje. Voz rex, inglés, locutor de piso. No anuncies un estreno que no existe." },
  { id: "dub_es", name: "Doblaje español", group: "audio", systemPrompt: "Solo el doblaje. Voz luna, español. Traduce el sentido, no tapes el idioma." },
  { id: "dub_engineer", name: "Ingeniero español", group: "audio", systemPrompt: "Solo el doblaje. Voz kepler, español, sala de ingeniería. No hables de una APK." },
  { id: "score_bed", name: "Banda original", group: "audio", systemPrompt: "Solo la cama musical. Es síntesis original. No cites ni reconstruyas una partitura protegida." },
  { id: "loudness", name: "Sonoridad", group: "audio", systemPrompt: "Solo el nivel. La voz queda por delante de la banda. No normalices a un estándar que no hayas medido." },
  { id: "otio_export", name: "Exportar OTIO", group: "paper", systemPrompt: "Escribe la línea de tiempo en el esquema OpenTimelineIO. Los tiempos salen de los planos medidos." },
  { id: "edl_export", name: "Exportar EDL", group: "paper", systemPrompt: "Escribe un EDL CMX 3600 de los mismos cortes. No añadas eventos sin plano." },
  { id: "marker_pass", name: "Pasada de marcas", group: "paper", systemPrompt: "Lee solo los marcadores y las notas. Propón cámara y luz. No borres el corte." },
  { id: "youtube_pack", name: "Paquete YouTube", group: "deliver", systemPrompt: "Prepara título, descripción y privacidad. Si no hay OAuth, el estado es NOT_UPLOADED. No digas que se publicó." },
];

export const STAGES: StudioStage[] = [
  {
    id: "idea",
    name: "Idea",
    agentId: "grok-session-01",
    systemId: null,
    systemPrompt: "Eres solo el agente de la idea. Devuelve una frase. No elijas planos, codecs, cámara ni doblaje. No afirmes que existe una APK ni que el router externo está conectado.",
  },
  {
    id: "treatment",
    name: "Tratamiento",
    agentId: "grok-session-02",
    systemId: "remotion",
    systemPrompt: "Eres solo el agente de tratamiento. Fija duración, idioma y tono. No montes y no cambies la idea.",
  },
  {
    id: "shotlist",
    name: "Lista de planos",
    agentId: "grok-session-03",
    systemId: "otio",
    systemPrompt: "Eres solo el agente de planos. Usa únicamente planos ya medidos. Si faltan segundos, dilo. No inventes metraje.",
  },
  {
    id: "camera",
    name: "Cámara",
    agentId: "grok-session-04",
    systemId: "theatre",
    systemPrompt: "Eres solo el agente de cámara. Elige push, drift o hold. Blender y USD no están instalados. No reescribas la idea.",
  },
  {
    id: "light",
    name: "Luz",
    agentId: "grok-session-05",
    systemId: "materialx",
    systemPrompt: "Eres solo el agente de luz. Elige cool, warm, soft o rim. No afirmes un render 3D.",
  },
  {
    id: "grade",
    name: "Grado",
    agentId: "grok-session-06",
    systemId: "opencolorio",
    systemPrompt: "Eres solo el agente de grado. OpenColorIO y ACES no están instalados. Describe el eq real. No digas que aplicaste ACES.",
  },
  {
    id: "edit",
    name: "Montaje",
    agentId: "grok-session-07",
    systemId: "mlt",
    systemPrompt: "Eres solo el agente de montaje. Empata la cola hasta el objetivo. Recorta solo el último plano. Marca las reprises.",
  },
  {
    id: "score",
    name: "Banda",
    agentId: "grok-session-08",
    systemId: "ardour",
    systemPrompt: "Eres solo el agente de banda. La música es original. No reconstruyas una partitura protegida.",
  },
  {
    id: "dub",
    name: "Doblaje",
    agentId: "grok-session-09",
    systemId: "aegisub",
    systemPrompt: "Eres solo el agente de doblaje. Elige un locutor y declara el idioma. No tapes un idioma con otro sin decirlo.",
  },
  {
    id: "mix",
    name: "Mezcla",
    agentId: "grok-session-10",
    systemId: "ardour",
    systemPrompt: "Eres solo el agente de mezcla. La voz queda por delante de la banda. No publiques el archivo.",
  },
  {
    id: "master",
    name: "Master",
    agentId: "grok-session-11",
    systemId: "ffmpeg",
    systemPrompt: "Eres solo el agente de master. Mide el archivo. Si la duración no da el objetivo, dilo. No inventes un códec que no corriste.",
  },
  {
    id: "review",
    name: "Revisión",
    agentId: "grok-session-12",
    systemId: "olive",
    systemPrompt: "Eres solo el agente de revisión. Lee marcadores y notas. Puedes proponer cámara y luz. No borres el corte.",
  },
];

export const DELIVER_PROMPT =
  "Eres solo el agente de entrega. Prepara el paquete de YouTube en privado. Si no hay OAuth, responde NOT_UPLOADED. No digas que el video está en el canal.";

export function systemById(id: string) {
  return SYSTEMS.find((item) => item.id === id) ?? null;
}

export function stageForAgent(agentId: string) {
  return STAGES.find((stage) => stage.agentId === agentId) ?? STAGES[0];
}

export function rawUrl(system: StudioSystem) {
  return `https://raw.githubusercontent.com/${system.repo}/${system.branch}/${system.path}`;
}
