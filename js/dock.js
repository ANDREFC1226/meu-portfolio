export function initDockMagnify(dockEl) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return; // respeita quem prefere menos animação

  const RANGE = 140;      // até onde o "raio de influência" do mouse chega
  const MAX_SCALE = 1.5;  // o quanto o ícone mais próximo cresce

  dockEl.addEventListener('mousemove', (e) => {
    dockEl.querySelectorAll('.dock-item').forEach(item => {
      const rect = item.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const distance = Math.abs(e.clientX - center);
      const scale = distance < RANGE
        ? 1 + (MAX_SCALE - 1) * (1 - distance / RANGE)
        : 1;
      item.style.transform = `scale(${scale})`;
    });
  });

  dockEl.addEventListener('mouseleave', () => {
    dockEl.querySelectorAll('.dock-item').forEach(item => {
      item.style.transform = 'scale(1)';
    });
  });
}
