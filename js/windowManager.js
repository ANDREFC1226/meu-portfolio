export class WindowManager {
  constructor(windowId, titleId, iframeId, closeBtnId, overlayId) {
    this.windowEl = document.getElementById(windowId);
    this.titleEl = document.getElementById(titleId);
    this.iframeEl = document.getElementById(iframeId);
    this.closeBtnEl = document.getElementById(closeBtnId);
    this.overlayEl = document.getElementById(overlayId);
    this.initEvents();
  }

  initEvents() {
    if (this.closeBtnEl) {
      this.closeBtnEl.addEventListener('click', () => this.close());
    }
    if (this.overlayEl) {
      this.overlayEl.addEventListener('click', () => this.close());
    }
  }

  open(title, driveUrl) {
    if (!driveUrl) return; // certificado futuro não tem link ainda
    if (this.titleEl) this.titleEl.innerText = title;
    if (this.iframeEl) this.iframeEl.src = driveUrl;
    if (this.windowEl) this.windowEl.classList.add('active');
    if (this.overlayEl) this.overlayEl.classList.add('active');
  }

  close() {
    if (this.windowEl) this.windowEl.classList.remove('active');
    if (this.overlayEl) this.overlayEl.classList.remove('active');
    setTimeout(() => {
      if (this.iframeEl) this.iframeEl.src = 'about:blank';
    }, 250); // espera a animação de fechar terminar
  }
}
