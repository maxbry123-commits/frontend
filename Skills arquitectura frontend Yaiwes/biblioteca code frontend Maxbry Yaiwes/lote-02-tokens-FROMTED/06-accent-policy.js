/* 06-accent-policy.js
 * FUENTE: 01-DESIGN-TOKENS-THEMES-IMMUTABLE.md §5 Accent policy (global)
 * 1 función: reglas de acento. No pinta. Valida.
 * Cablear: import { accentAllowed } from "./06-accent-policy.js";
 */

export const ACCENT_POLICY = Object.freeze({
  matte: {
    blue: "selection border + check icon only",
    orange: "text label Descargar / Cargar only",
    forbidden: ["filled orange button", "blue as primary filled brand", "lime", "purple brand"]
  },
  little: {
    accent: "primary filled CTAs only",
    forbidden: ["Grok blue", "Grok orange"]
  },
  blanco: {
    blue: "selection border + text link Descargar",
    filledPrimary: "--text-bright on white text",
    forbidden: ["pure #000000 body text", "large filled brand blocks"]
  },
  never: [
    "lime / neon green as brand",
    "pure black (#000) as body text on light theme",
    "filled colored buttons for secondary actions",
    "green status text as default"
  ]
});

export function accentAllowed(themeId, role) {
  if (themeId === "matte") {
    if (role === "selection") return "var(--blue)";
    if (role === "download-text") return "var(--orange)";
    return null;
  }
  if (themeId === "little") {
    if (role === "primary-cta") return "var(--accent)";
    return null;
  }
  if (themeId === "blanco") {
    if (role === "selection" || role === "download-text") return "var(--blue)";
    if (role === "primary-cta") return "var(--text-bright)";
    return null;
  }
  return null;
}
