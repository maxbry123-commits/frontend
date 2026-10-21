export const ENGINE_LINE =
  "Backend del motor: Motion Canvas, Revideo y la partitura. HyperFrames y Remotion no están. YouTube no se publica.";

export type EngineSpec = {
  id: string;
  name: string;
  repo: string;
  license: string;
  authoring: string;
  local: string;
};

export const ENGINE_CATALOG: readonly EngineSpec[] = [
  {
    id: "hyperframes",
    name: "HyperFrames",
    repo: "heygen-com/hyperframes",
    license: "Apache-2.0",
    authoring: "HTML con data-start, data-duration y data-track-index. El motor no lo instaló.",
    local: "",
  },
  {
    id: "remotion",
    name: "Remotion",
    repo: "remotion-dev/remotion",
    license: "Remotion License",
    authoring: "Componentes React. El motor no lo instaló.",
    local: "",
  },
  {
    id: "motion-canvas",
    name: "Motion Canvas",
    repo: "motion-canvas/motion-canvas",
    license: "MIT",
    authoring: "Generadores TypeScript sobre canvas.",
    local: "video Youtube apk/backend/motion-canvas/code",
  },
  {
    id: "revideo",
    name: "Revideo",
    repo: "midrender/revideo",
    license: "MIT",
    authoring: "Escenas en código, par de Motion Canvas, licencia MIT.",
    local: "video Youtube apk/backend/revideo/code",
  },
];

export function hyperframesDocument(id: string, title: string, cuts: readonly string[]) {
  const safeTitle = title.replace(/[<>&]/g, "");
  const clips = cuts
    .map((cut, index) => {
      const start = index * 9;
      return `    <section data-start="${start}" data-duration="9" data-track-index="${index}">${cut}</section>`;
    })
    .join("\n");
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>${safeTitle}</title>
  <style>
    html, body { margin: 0; background: #1B1B1B; color: #FAFAFA; }
    #stage { width: 720px; height: 1280px; position: relative; overflow: hidden; font-family: system-ui, sans-serif; }
    section { position: absolute; inset: 0; display: grid; place-items: end start; padding: 48px; background: #202020; }
    h1 { margin: 0; font-size: 42px; font-weight: 500; letter-spacing: -0.03em; }
  </style>
</head>
<body>
  <main id="stage" data-composition-id="${id}" data-width="720" data-height="1280" data-duration="${cuts.length * 9}">
    <h1 data-start="0" data-duration="${cuts.length * 9}" data-track-index="10">${safeTitle}</h1>
${clips}
  </main>
</body>
</html>
`;
}
