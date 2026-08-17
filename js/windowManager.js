export class WindowManager {
  constructor(layerId) {
    this.layer = document.getElementById(layerId);
    this.windows = new Map();
    this.zIndex = 100;
  }

  open(cert) {
    if (!cert.driveUrl) return;
    if (this.windows.has(cert.id)) {
      this.focus(cert.id);
      return;
    }

    const el = document.createElement('div');
    el.className = 'mac-window';

    const offset = this.windows.size * 30;
    const width = 800, height = 550;
    const left = Math.max(20, window.innerWidth / 2 - width / 2 + offset);
    const top = Math.max(48, window.innerHeight / 2 - height / 2 + offset);
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;

    el.innerHTML = `
      <div class="window-header">
        <div class="traffic-lights">
          <button class="dot dot-close" title="Fechar"></button>
          <button class="dot dot-minimize" title="Minimizar"></button>
          <button class="dot dot-expand" title="Expandir"></button>
        </div>
        <div class="window-title">${cert.title}</div>
      </div>
      <iframe class="window-body" src="${cert.driveUrl}" title="${cert.title}" loading="lazy"></iframe>
    `;

    this.layer.appendChild(el);
    this.windows.set(cert.id, el);

    el.querySelector('.dot-close').addEventListener('click', (e) => {
      e.stopPropagation();
      this.close(cert.id);
    });
    el.querySelector('.dot-minimize').addEventListener('click', (e) => {
      e.stopPropagation();
      el.classList.toggle('minimized');
    });
    el.querySelector('.dot-expand').addEventListener('click', (e) => {
      e.stopPropagation();
      el.classList.toggle('maximized');
    });
    el.addEventListener('mousedown', () => this.focus(cert.id));

    this.makeDraggable(el);
    this.focus(cert.id);
    requestAnimationFrame(() => el.classList.add('active'));
  }

  focus(id) {
    const el = this.windows.get(id);
    if (!el) return;
    this.zIndex += 1;
    el.style.zIndex = this.zIndex;
    this.windows.forEach(w => w.classList.remove('focused'));
    el.classList.add('focused');
  }

  close(id) {
    const el = this.windows.get(id);
    if (!el) return;
    el.classList.remove('active');
    setTimeout(() => {
      el.remove();
      this.windows.delete(id);
    }, 200);
  }

  makeDraggable(el) {
    const header = el.querySelector('.window-header');
    let dragging = false;
    let startX = 0, startY = 0, startLeft = 0, startTop = 0;

    header.addEventListener('mousedown', (e) => {
      if (e.target.closest('.dot')) return;
      if (el.classList.contains('maximized')) return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = el.offsetLeft;
      startTop = el.offsetTop;
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      el.style.left = `${startLeft + dx}px`;
      el.style.top = `${Math.max(30, startTop + dy)}px`;
    });

    window.addEventListener('mouseup', () => { dragging = false; });
  }
}
