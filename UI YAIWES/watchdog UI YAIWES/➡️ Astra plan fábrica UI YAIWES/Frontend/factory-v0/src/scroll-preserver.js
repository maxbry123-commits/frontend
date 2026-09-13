const scroll = document.getElementById('context-scroll');
const stepCount = document.getElementById('context-count');
const content = document.getElementById('context-content');

const positions = new Map();
let activeStep = stepCount?.textContent || '1/5';
let userScrolling = false;
let restoreQueued = false;
let touchTracking = false;
let touchStartY = 0;
let touchStartTop = 0;

function currentStep() {
  return stepCount?.textContent || activeStep;
}

function clampScrollTop(value) {
  if (!scroll) return 0;
  const max = Math.max(0, scroll.scrollHeight - scroll.clientHeight);
  return Math.max(0, Math.min(max, value));
}

function restore() {
  restoreQueued = false;
  if (!scroll || userScrolling) return;
  const key = currentStep();
  const saved = positions.get(key) || 0;
  scroll.scrollTop = clampScrollTop(saved);
}

function queueRestore() {
  if (restoreQueued) return;
  restoreQueued = true;
  requestAnimationFrame(() => requestAnimationFrame(restore));
}

if (scroll && content) {
  scroll.addEventListener('pointerdown', () => { userScrolling = true; }, { passive: true });
  scroll.addEventListener('pointerup', () => {
    userScrolling = false;
    positions.set(currentStep(), scroll.scrollTop);
  }, { passive: true });

  scroll.addEventListener('touchstart', event => {
    userScrolling = true;
    const touch = event.touches?.[0];
    if (!touch) return;
    touchTracking = true;
    touchStartY = touch.clientY;
    touchStartTop = scroll.scrollTop;
  }, { passive: true });

  scroll.addEventListener('touchmove', event => {
    if (!touchTracking) return;
    const touch = event.touches?.[0];
    if (!touch) return;
    const max = Math.max(0, scroll.scrollHeight - scroll.clientHeight);
    if (max <= 0) return;
    const nextTop = clampScrollTop(touchStartTop + (touchStartY - touch.clientY));
    if (nextTop !== scroll.scrollTop) scroll.scrollTop = nextTop;
    positions.set(currentStep(), scroll.scrollTop);
    event.preventDefault();
  }, { passive: false });

  const finishTouch = () => {
    touchTracking = false;
    userScrolling = false;
    positions.set(currentStep(), scroll.scrollTop);
  };
  scroll.addEventListener('touchend', finishTouch, { passive: true });
  scroll.addEventListener('touchcancel', finishTouch, { passive: true });

  scroll.addEventListener('scroll', () => {
    if (scroll.scrollTop > 0 || userScrolling) positions.set(currentStep(), scroll.scrollTop);
  }, { passive: true });

  new MutationObserver(() => {
    const nextStep = currentStep();
    if (nextStep !== activeStep) {
      activeStep = nextStep;
      positions.set(activeStep, 0);
      scroll.scrollTop = 0;
      return;
    }
    queueRestore();
  }).observe(content, { childList: true, subtree: true });
}

document.addEventListener('click', event => {
  const stepButton = event.target.closest?.('[data-step]');
  if (!stepButton || !scroll) return;
  const next = `${stepButton.dataset.step}/5`;
  if (next !== activeStep) positions.set(next, 0);
});
