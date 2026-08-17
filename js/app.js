import { certificates } from './certificates.js';
import { WindowManager } from './windowManager.js';

const certWindowManager = new WindowManager('certWindow', 'windowTitle', 'pdfFrame', 'btnClose');

function renderDesktopIcons() {
  const desktopEl = document.getElementById('desktop');
  if (!desktopEl) return;
  
  desktopEl.innerHTML = '';

  certificates.forEach(cert => {
    const iconEl = document.createElement('div');
    iconEl.className = 'icon';
    iconEl.setAttribute('data-id', cert.id);
    
    iconEl.innerHTML = `
      <div class="icon-img">${cert.icon}</div>
      <div class="icon-label">${cert.title}</div>
    `;

    iconEl.addEventListener('click', () => {
      certWindowManager.open(cert.title, cert.driveUrl);
    });

    desktopEl.appendChild(iconEl);
  });
}

function initClock() {
  const clockEl = document.getElementById('clock');
  if (!clockEl) return;
  
  function update() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    clockEl.innerText = `${hours}:${minutes}`;
  }

  setInterval(update, 1000);
  update();
}

document.addEventListener('DOMContentLoaded', () => {
  renderDesktopIcons();
  initClock();
});
