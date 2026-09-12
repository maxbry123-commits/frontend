const stage = document.querySelector('.canvas-stage');

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function hasYaiwesPayload(dataTransfer) {
  if (!dataTransfer) return false;
  const types = Array.from(dataTransfer.types || []);
  return types.includes('text/yaiwes-kind') || types.includes('text/yaiwes-node');
}

function redirectStageDrop(event) {
  const canvas = document.getElementById('canvas');
  if (!canvas || !stage || typeof canvas.ondrop !== 'function') return;
  if (event.target === canvas || canvas.contains(event.target)) return;
  if (!hasYaiwesPayload(event.dataTransfer)) return;

  event.preventDefault();
  event.stopPropagation();

  const rect = canvas.getBoundingClientRect();
  const clientX = clamp(event.clientX, rect.left + 8, rect.right - 8);
  const clientY = clamp(event.clientY, rect.top + 8, rect.bottom - 8);

  canvas.ondrop({
    preventDefault() {},
    stopPropagation() {},
    clientX,
    clientY,
    dataTransfer: event.dataTransfer,
    target: canvas,
    currentTarget: canvas,
  });
}

if (stage) {
  stage.addEventListener('dragover', event => {
    const canvas = document.getElementById('canvas');
    if (!canvas || event.target === canvas || canvas.contains(event.target)) return;
    if (!hasYaiwesPayload(event.dataTransfer)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = Array.from(event.dataTransfer.types || []).includes('text/yaiwes-node') ? 'move' : 'copy';
    stage.classList.add('drag-over');
  });

  stage.addEventListener('dragleave', event => {
    if (!stage.contains(event.relatedTarget)) stage.classList.remove('drag-over');
  });

  stage.addEventListener('drop', event => {
    stage.classList.remove('drag-over');
    redirectStageDrop(event);
  });
}
