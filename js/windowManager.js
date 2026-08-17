export class WindowManager {
  constructor(windowId, titleId, iframeId, closeBtnId) {
    this.windowEl = document.getElementById(windowId);
    this.titleEl = document.getElementById(titleId);
    this.iframeEl = document.getElementById(iframeId);
    this.closeBtnEl = document.getElementById(closeBtnId);

    this.initEvents();
  }

  initEvents() {
    if (this.closeBtnEl) {
      this.closeBtnEl.addEventListener('click', () => this.close());
    }
  }

  open(title, driveUrl) {
    if (this.titleEl) this.titleEl.innerText = title;
    if (this.iframeEl) this.iframeEl.src = driveUrl;
    if (this.windowEl) this.windowEl.classList.add('active');
  }

  close() {
    if (this.windowEl) this.windowEl.classList.remove('active');
    if (this.iframeEl) this.iframeEl.src = 'about:blank';
  }
}
