import type { ReactNode } from "react";

type Props = {
  title: string;
  sidebar?: ReactNode;
  children: ReactNode;
};

export function AppShell({ title, sidebar, children }: Props) {
  return (
    <div className="shell">
      <aside className="shell-side">
        <div className="shell-brand">{title}</div>
        <nav className="shell-nav">{sidebar}</nav>
      </aside>
      <div className="shell-body">
        <header className="shell-top">
          <span className="shell-top-title">{title}</span>
        </header>
        <main className="shell-main">{children}</main>
      </div>
    </div>
  );
}
