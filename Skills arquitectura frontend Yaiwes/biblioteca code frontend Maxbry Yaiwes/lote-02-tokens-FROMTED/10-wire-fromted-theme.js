/* 10-wire-fromted-theme.js
 * FUENTE: 04-AGENT-PROTOCOL-SKILL.md + 01-DESIGN-TOKENS-THEMES-IMMUTABLE.md §6
 * 1 función: cablear tema FROMTED. Default matte. Sin paleta cuarta.
 *
 * HTML:
 * <link rel="stylesheet" href="./01-tokens-matte.css">
 * <link rel="stylesheet" href="./02-tokens-little.css">
 * <link rel="stylesheet" href="./03-tokens-blanco.css">
 * <link rel="stylesheet" href="./04-geometry.css">
 * <script type="module" src="./10-wire-fromted-theme.js"></script>
 */

import { THEME_DEFAULT, THEME_IDS } from "./05-theme-ids.js";
import { applyTheme, readTheme } from "./07-apply-theme.js";
import es from "./08-i18n-es.js";
import { en, fr, pt } from "./09-i18n-en-fr-pt.js";

export const BASE = new URL(".", import.meta.url).href;

const DICTS = { es, en, fr, pt };

export function t(key, locale) {
  const loc = locale && DICTS[locale] ? locale : "es";
  const dict = DICTS[loc];
  return dict[key] || DICTS.es[key] || key;
}

export function wireTheme(options) {
  const opts = options || {};
  const theme = opts.theme && THEME_IDS.indexOf(opts.theme) !== -1 ? opts.theme : THEME_DEFAULT;
  const applied = applyTheme(theme);
  return {
    ok: applied.ok,
    theme: readTheme(),
    themes: THEME_IDS.slice(),
    localeDefault: "es",
    base: BASE
  };
}

if (typeof document !== "undefined") {
  wireTheme();
}
