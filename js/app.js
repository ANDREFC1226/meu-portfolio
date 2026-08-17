import { certificates } from './certificates.js';
import { WindowManager } from './windowManager.js';

// Instancia o gerenciador de janelas conectando com os IDs do HTML
const certWindowManager = new WindowManager('certWindow', 'windowTitle', 'pdfFrame', 'btnClose');

// Renderiza os ícones dos certificados na área de trabalho
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

    // Ação do clique para abrir a janela macOS
    iconEl.addEventListener('click', () => {
      certWindowManager.open(cert.title, cert.driveUrl);
    });

    desktopEl.appendChild(iconEl);
  });
}

// Atualiza o relógio no canto superior direito
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

// Inicializa a aplicação
document.addEventListener('DOMContentLoaded', () => {
  renderDesktopIcons();
  initClock();
});
