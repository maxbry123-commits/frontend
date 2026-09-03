type Tab = "chat" | "settings";

type Props = {
  tab: Tab;
  onTab: (t: Tab) => void;
  settingsLabel: string;
};

export function MobileTabs({ tab, onTab, settingsLabel }: Props) {
  return (
    <nav className="mobile-tabs">
      <button
        type="button"
        className={tab === "chat" ? "mtab mtab-on" : "mtab"}
        onClick={() => onTab("chat")}
      >
        Chat
      </button>
      <button
        type="button"
        className={tab === "settings" ? "mtab mtab-on" : "mtab"}
        onClick={() => onTab("settings")}
      >
        {settingsLabel}
      </button>
    </nav>
  );
}
