type P = { size?: number; className?: string };

const s = (n = 18) => ({ width: n, height: n, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const });

export function IconPlus({ size }: P) {
  return (<svg {...s(size)}><path d="M12 5v14M5 12h14" /></svg>);
}
export function IconDoc({ size }: P) {
  return (<svg {...s(size)}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>);
}
export function IconWeb({ size }: P) {
  return (<svg {...s(size)}><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M3 9h18M9 9v9" /></svg>);
}
export function IconImage({ size }: P) {
  return (<svg {...s(size)}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-5-5L5 21" /></svg>);
}
export function IconThink({ size }: P) {
  return (<svg {...s(size)}><path d="M12 3a7 7 0 0 0-4 12.7V18h8v-2.3A7 7 0 0 0 12 3z" /><path d="M9 21h6" /></svg>);
}
export function IconUp({ size }: P) {
  return (<svg {...s(size)}><path d="M12 19V5M5 12l7-7 7 7" /></svg>);
}
export function IconStop({ size }: P) {
  return (<svg {...s(size)}><rect x="6" y="6" width="12" height="12" rx="1" fill="currentColor" stroke="none" /></svg>);
}
export function IconAa({ size }: P) {
  return (<svg {...s(size)}><path d="M4 20 10 4h2l6 16M6.5 14h7" /></svg>);
}
export function IconCopy({ size }: P) {
  return (<svg {...s(size)}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>);
}
export function IconShare({ size }: P) {
  return (<svg {...s(size)}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></svg>);
}
export function IconRefresh({ size }: P) {
  return (<svg {...s(size)}><path d="M21 12a9 9 0 1 1-2.6-6.2" /><path d="M21 3v6h-6" /></svg>);
}
export function IconSpeaker({ size }: P) {
  return (<svg {...s(size)}><path d="M11 5 6 9H2v6h4l5 4V5zM19.1 8.9a5 5 0 0 1 0 6.2M15.5 11a2 2 0 0 1 0 2" /></svg>);
}
