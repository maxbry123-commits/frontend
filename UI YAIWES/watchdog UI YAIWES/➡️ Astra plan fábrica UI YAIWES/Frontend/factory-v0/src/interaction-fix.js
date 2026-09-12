const stage = document.querySelector('.canvas-stage');

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function redirectStageDrop(event) {
  const canvas = document.getElementById('canvas');
  if (!canvas || !stage) return;
  if (event.target === canvas || canvas.contains(event.target)) return;
  if (!event.dataTransfer) return;

  const hasPayload = event.dataTransfer.types.includes('text/yaiwes-kind') ||
    event.dataTransfer.types.includes('text/yaiwes-node');
  if (!hasPayload) return;

  event.preventDefault();
  event.stopPropagation();

  const rect = canvas.getBoundingClientRect();
  const clientX = clamp(event.clientX, rect.left + 8, rect.right - 8);
  const clientY = clamp(event.clientY, rect.top + 8, rect.bottom - 8);

  const redirected = new DragEvent('drop', {
    bubbles: true,
    cancelable: true,
    dataTransfer: event.dataTransfer,
    clientX,
    clientY,
  });
  redirected.yaiwesRedirected = true;
  canvas.dispatchEvent(redirected);
}

if (stage) {
  stage.addEventListener('dragover', event => {
    const canvas = document.getElementById('canvas');
    if (!canvas || event.target === canvas || canvas.contains(event.target)) return;
    if (!event.dataTransfer) return;
    const hasPayload = event.dataTransfer.types.includes('text/yaiwes-kind') ||
      event.dataTransfer.types.includes('text/yaiwes-node');
    if (!hasPayload) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = event.dataTransfer.types.includes('text/yaiwes-node') ? 'move' : 'copy';
    stage.classList.add('drag-over');
  });
  stage.addEventListener('dragleave', event => {
    if (!stage.contains(event.relatedTarget)) stage.classList.remove('drag-over');
  });
  stage.addEventListener('drop', event => {
    stage.classList.remove('drag-over');
    if (event.yaiwesRedirected) return;
    redirectStageDrop(event);
  });
}
