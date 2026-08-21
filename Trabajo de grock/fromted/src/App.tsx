import { useEffect, useState } from "react";
import { applyTheme, type ThemeId, type TitleColor } from "./lib/theme";
import { setLocale, t, type Locale } from "./i18n";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { LocaleSwitcher } from "./components/LocaleSwitcher";
import { AppShell } from "./components/AppShell";
import { ChatPanel } from "./components/ChatPanel";
import { MobileTabs } from "./components/MobileTabs";

type Tab = "chat" | "settings";

export default function App() {
  const [theme, setTheme] = useState<ThemeId>("dark-warm");
  const [titleColor, setTitleColor] = useState<TitleColor>("warm");
  const [locale, setLoc] = useState<Locale>("es-US");
  const [tab, setTab] = useState<Tab>("chat");
  const [, bump] = useState(0);

  useEffect(() => {
    applyTheme(theme, titleColor);
    setLocale(locale);
  }, [theme, titleColor, locale]);

  const side = (
    <>
      <button
        type="button"
        className={tab === "chat" ? "nav-item nav-item-on" : "nav-item"}
        onClick={() => setTab("chat")}
      >
        Chat
      </button>
      <button
        type="button"
        className={tab === "settings" ? "nav-item nav-item-on" : "nav-item"}
        onClick={() => setTab("settings")}
      >
        {t("settings.appearance")}
      </button>
      <button type="button" className="nav-item">
        Docs
      </button>
    </>
  );

  return (
    <AppShell title={t("app.title")} sidebar={side}>
      {tab === "chat" ? (
        <ChatPanel />
      ) : (
        <div className="panel">
          <p className="app-status">{t("app.status")}</p>
          <ThemeSwitcher
            theme={theme}
            titleColor={titleColor}
            onTheme={setTheme}
            onTitle={setTitleColor}
          />
          <LocaleSwitcher
            locale={locale}
            onLocale={(l) => {
              setLoc(l);
              setLocale(l);
              bump((n) => n + 1);
            }}
          />
          <p className="hint-orange">
            <span className="label-orange">{t("action.load")}</span>
            {" · "}
            <span className="label-orange">{t("action.download")}</span>
          </p>
        </div>
      )}
      <MobileTabs
        tab={tab}
        onTab={setTab}
        settingsLabel={t("settings.appearance")}
      />
    </AppShell>
  );
}
