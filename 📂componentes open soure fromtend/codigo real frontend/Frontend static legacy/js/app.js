// NCT Frontend · FRONT v0.1.0
// Shell JARVIS-like + estado del Router Universal mediante proxy privado de Vercel.

const AGENTS = [
  { id: 'ceo', name: 'CEO Agent', role: 'Liderando estrategia', online: true, active: true },
  { id: 'analista', name: 'Analista de Mercado', role: 'Investigando tendencias', online: true },
  { id: 'arquitecto', name: 'Arquitecto de Soluciones', role: 'Diseñando arquitectura', online: true },
  { id: 'ia-ml', name: 'Experto en IA/ML', role: 'Evaluando modelos', online: true },
  { id: 'finanzas', name: 'Finanzas Agent', role: 'Analizando viabilidad', online: true },
  { id: 'abogado', name: 'Abogado IA', role: 'Revisando cumplimiento', online: false },
  { id: 'ux', name: 'UX Researcher', role: 'Analizando experiencia', online: true },
  { id: 'data', name: 'Data Scientist', role: 'Procesando datos', online: true },
];

const agentsList = document.getElementById('agents-list');
if (agentsList) {
  agentsList.innerHTML = AGENTS.map(a => `
    <li class="${a.active ? 'active' : ''}">
      <span class="ava">🟢</span>
      <div><span class="name">${a.name}</span><span class="role">${a.role}</span></div>
      <span class="dot ${a.online ? 'online' : ''}" title="${a.online ? 'online' : 'offline'}"></span>
    </li>
  `).join('');
}

const clock = document.getElementById('clock');
if (clock) {
  const tick = () => {
    const d = new Date();
    clock.textContent = d.toLocaleTimeString('es-ES', { hour12: false });
  };
  tick();
  setInterval(tick, 1000);
}

// Router health: nunca expone credenciales ni llama directamente al endpoint privado.
async function checkRouterHealth() {
  try {
    const response = await fetch('/api/router?path=health', {
      method: 'GET',
      headers: { accept: 'application/json' },
      cache: 'no-store',
    });
    const data = await response.json();
    document.documentElement.dataset.routerStatus = response.ok ? 'healthy' : 'degraded';
    console.log('[ROUTER]', response.ok ? 'healthy' : 'degraded', data);
  } catch (error) {
    document.documentElement.dataset.routerStatus = 'unavailable';
    console.warn('[ROUTER] unavailable');
  }
}

checkRouterHealth();
setInterval(checkRouterHealth, 30000);
console.log('[FRONT v0.1.0] shell loaded · router health polling enabled');
