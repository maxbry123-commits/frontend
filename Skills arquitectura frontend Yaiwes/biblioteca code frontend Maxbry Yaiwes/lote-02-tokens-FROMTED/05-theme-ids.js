/* 05-theme-ids.js
 * FUENTE: 01-DESIGN-TOKENS-THEMES-IMMUTABLE.md §6 + FROMTED-FRONTEND-IMMUTABLE-LAW.json
 * 1 función: ids de tema permitidos. Cuarto tema = REJECT.
 * Cablear: import { THEME_IDS, isThemeId } from "./05-theme-ids.js";
 */

export const THEME_IDS = Object.freeze(["matte", "little", "blanco"]);

export function isThemeId(id) {
  return THEME_IDS.indexOf(id) !== -1;
}

export const THEME_DEFAULT = "matte";
