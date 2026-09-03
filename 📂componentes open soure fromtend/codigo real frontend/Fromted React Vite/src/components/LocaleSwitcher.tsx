import { LOCALES, setLocale, t, type Locale } from "../i18n";

type Props = {
  locale: Locale;
  onLocale: (l: Locale) => void;
};

export function LocaleSwitcher({ locale, onLocale }: Props) {
  return (
    <div className="locale-switcher">
      <label className="ts-label">{t("settings.language")}</label>
      <div className="ts-row">
        {LOCALES.map((l) => (
          <button
            key={l}
            type="button"
            className={locale === l ? "ts-btn ts-btn-on" : "ts-btn"}
            onClick={() => {
              setLocale(l);
              onLocale(l);
            }}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}
