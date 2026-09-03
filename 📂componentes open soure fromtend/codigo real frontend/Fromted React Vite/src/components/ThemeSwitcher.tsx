import { applyTheme, type ThemeId, type TitleColor } from "../lib/theme";
import { t } from "../i18n";

const THEMES: ThemeId[] = ["dark-warm", "gray-warm", "light"];
const TITLES: TitleColor[] = ["warm", "blue", "green", "electric", "white"];

type Props = {
  theme: ThemeId;
  titleColor: TitleColor;
  onTheme: (t: ThemeId) => void;
  onTitle: (c: TitleColor) => void;
};

export function ThemeSwitcher({ theme, titleColor, onTheme, onTitle }: Props) {
  return (
    <div className="theme-switcher">
      <label className="ts-label">{t("settings.theme")}</label>
      <div className="ts-row">
        {THEMES.map((id) => (
          <button
            key={id}
            type="button"
            className={theme === id ? "ts-btn ts-btn-on" : "ts-btn"}
            onClick={() => {
              onTheme(id);
              applyTheme(id, titleColor);
            }}
          >
            {t(`theme.${id}`)}
          </button>
        ))}
      </div>
      <div className="ts-row">
        {TITLES.map((c) => (
          <button
            key={c}
            type="button"
            className={titleColor === c ? "ts-btn ts-btn-on" : "ts-btn"}
            onClick={() => {
              onTitle(c);
              applyTheme(theme, c);
            }}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
