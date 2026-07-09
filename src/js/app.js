// NCT Frontend · FRONT v0.1.0
// Estado: app shell JARVIS-like con agentes mock + actividad

const AGENTS = [
  { id: 'ceo',         name: 'CEO Agent',           role: 'Liderando estrategia',          online: true,  active: true },
  { id: 'analista',    name: 'Analista de Mercado', role: 'Investigando tendencias',       online: true },
  { id: 'arquitecto',  name: 'Arquitecto de Soluciones', role: 'Diseñando arquitectura',    online: true },
  { id: 'ia-ml',       name: 'Experto en IA/ML',    role: 'Evaluando modelos',              online: true },
  { id: 'finanzas',    name: 'Finanzas Agent',      role: 'Analizando viabilidad',          online: true },
  { id: 'abogado',     name: 'Abogado IA',          role: 'Revisando cumplimiento',         online: false },
  { id: 'ux',          name: 'UX Researcher',       role: 'Analizando experiencia',         online: true },
  { id: 'data',        name: 'Data Scientist',      role: 'Procesando datos',               online: true },
];

const agentsList = document.getElementById('agents-list');
if (agentsList) {
  agentsList.innerHTML = AGENTS.map(a => `
    <li class="${a.active ? 'active' : ''}">
      <span class="ava">🟢</span>
      <div>
        <span class="name">${a.name}</span>
        <span class="role">${a.role}</span>
      </div>
      <span class="dot ${a.online ? 'online' : ''}" title="${a.online ? 'online' : 'offline'}"></span>
    </li>
  `).join('');
}

// Clock
const clock = document.getElementById('clock');
if (clock) {
  const tick = () => {
    const d = new Date();
    clock.textContent = d.toLocaleTimeString('es-ES', { hour12: false });
  };
  tick();
  setInterval(tick, 1000);
}

console.log('[FRONT v0.1.0] shell loaded · 8 agents mock · 3 cols');
