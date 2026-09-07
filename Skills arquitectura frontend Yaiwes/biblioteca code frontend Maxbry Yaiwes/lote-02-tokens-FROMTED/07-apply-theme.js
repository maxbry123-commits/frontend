/* 07-apply-theme.js
 * FUENTE: 01-DESIGN-TOKENS-THEMES-IMMUTABLE.md §6 Theme switch contract
 * 1 función: aplicar un tema. No interpolar hex mezclados.
 * Cablear: import { applyTheme } from "./07-apply-theme.js";
 */

import { THEME_DEFAULT, isThemeId } from "./05-theme-ids.js";

export function applyTheme(id, root) {
  const el = root || (typeof document !== "undefined" ? document.documentElement : null);
  if (!el) return { ok: false, reason: "no_root" };
  if (!isThemeId(id)) return { ok: false, reason: "theme_rejected", id };
  el.dataset.theme = id;
  return { ok: true, id };
}

export function readTheme(root) {
  const el = root || (typeof document !== "undefined" ? document.documentElement : null);
  if (!el) return THEME_DEFAULT;
  const id = el.dataset.theme;
  return isThemeId(id) ? id : THEME_DEFAULT;
}

if (typeof document !== "undefined") {
  if (!document.documentElement.dataset.theme) {
    applyTheme(THEME_DEFAULT);
  }
}
