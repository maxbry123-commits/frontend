const scroll = document.getElementById('context-scroll');
const stepCount = document.getElementById('context-count');
const content = document.getElementById('context-content');

const positions = new Map();
let activeStep = stepCount?.textContent || '1/5';
let userScrolling = false;
let restoreQueued = false;

function currentStep() {
  return stepCount?.textContent || activeStep;
}

function restore() {
  restoreQueued = false;
  if (!scroll || userScrolling) return;
  const key = currentStep();
  const saved = positions.get(key) || 0;
  const max = Math.max(0, scroll.scrollHeight - scroll.clientHeight);
  scroll.scrollTop = Math.min(saved, max);
}

function queueRestore() {
  if (restoreQueued) return;
  restoreQueued = true;
  requestAnimationFrame(() => requestAnimationFrame(restore));
}

if (scroll && content) {
  scroll.addEventListener('pointerdown', () => { userScrolling = true; }, { passive: true });
  scroll.addEventListener('pointerup', () => { userScrolling = false; positions.set(currentStep(), scroll.scrollTop); }, { passive: true });
  scroll.addEventListener('touchstart', () => { userScrolling = true; }, { passive: true });
  scroll.addEventListener('touchend', () => { userScrolling = false; positions.set(currentStep(), scroll.scrollTop); }, { passive: true });
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
