export type ThemeId = "dark-warm" | "gray-warm" | "light";
export type TitleColor = "warm" | "blue" | "green" | "electric" | "white";
export type ChatTone = "warm" | "dim" | "electric" | "white" | "blue";
export type ChatFont = "system" | "serif" | "mono" | "rounded";

const THEME_COLOR: Record<ThemeId, string> = {
  "dark-warm": "#1A1A19",
  "gray-warm": "#2A2926",
  light: "#F3F1EA",
};

const TITLE: Record<TitleColor, string> = {
  warm: "#BCBCB0",
  blue: "#2f6bff",
  green: "#22c55e",
  electric: "#4d8dff",
  white: "#F5F5F0",
};

const TONE: Record<ChatTone, string> = {
  warm: "#BCBCB0",
  dim: "#A8A59C",
  electric: "#4d8dff",
  white: "#F5F5F0",
  blue: "#2f6bff",
};

const FONT: Record<ChatFont, string> = {
  system: "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
  rounded: "'SF Pro Rounded', system-ui, sans-serif",
};

export function applyTheme(theme: ThemeId, title: TitleColor = "warm") {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.setProperty("--title", TITLE[title]);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", THEME_COLOR[theme]);
}

export function applyChatStyle(opts: {
  inTone?: ChatTone;
  outTone?: ChatTone;
  font?: ChatFont;
}) {
  const root = document.documentElement;
  if (opts.inTone) root.style.setProperty("--chat-in", TONE[opts.inTone]);
  if (opts.outTone) root.style.setProperty("--chat-out", TONE[opts.outTone]);
  if (opts.font) root.style.setProperty("--chat-font", FONT[opts.font]);
}

export { TITLE, TONE, FONT };
