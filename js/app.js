import { certificates } from './certificates.js';
import { WindowManager } from './windowManager.js';

const certWindowManager = new WindowManager('certWindow', 'windowTitle', 'pdfFrame', 'btnClose', 'windowOverlay');

let activeCategory = 'Todos';
let searchTerm = '';

const categoryIcons = {
  'Todos': '🖥️'
};
const fallbackIcons = ['📂', '🗂️', '📁', '🎯', '🏷️'];

function getCategories() {
  const cats = ['Todos'];
  certificates.forEach(c => {
    if (!cats.includes(c.category)) cats.push(c.category);
  });
  return cats;
}

function getFilteredCertificates() {
  return certificates.filter(c => {
    const matchesCategory = activeCategory === 'Todos' || c.category === activeCategory;
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}

function renderDesktopIcons() {
  const desktopEl = document.getElementById('desktop');
  if (!desktopEl) return;

  desktopEl.innerHTML = '';
  const filtered = getFilteredCertificates();

  filtered.forEach((cert, index) => {
    const isFuturo = cert.status === 'futuro';
    const iconEl = document.createElement('div');
    iconEl.className = `icon${isFuturo ? ' icon-locked' : ''}`;
    iconEl.style.animationDelay = `${index * 60}ms`;
    iconEl.setAttribute('data-id', cert.id);

    iconEl.innerHTML = `
      <div class="icon-img">${cert.icon}</div>
      <div class="icon-label">${cert.title}</div>
      ${isFuturo ? '<div class="icon-badge">Em breve</div>' : ''}
    `;

    iconEl.addEventListener('click', () => {
      if (isFuturo) return;
      certWindowManager.open(cert.title, cert.driveUrl);
    });

    desktopEl.appendChild(iconEl);
  });

  if (filtered.length === 0) {
    desktopEl.innerHTML = `<p style="color:#fff; text-shadow:0 1px 3px rgba(0,0,0,0.8); padding-top:20px;">Nenhum certificado encontrado.</p>`;
  }
}

function renderDock() {
  const dockEl = document.getElementById('dock');
  if (!dockEl) return;

  dockEl.innerHTML = '';
  const categories = getCategories();

  categories.forEach((cat, index) => {
    const icon = categoryIcons[cat] || fallbackIcons[index % fallbackIcons.length];
    const item = document.createElement('div');
    item.className = `dock-item${cat === activeCategory ? ' active' : ''}`;
    item.innerHTML = `${icon}<span class="dock-tooltip">${cat}</span>`;

    item.addEventListener('click', () => {
      activeCategory = cat;
      renderDock();
      renderDesktopIcons();
    });

    dockEl.appendChild(item);
  });
}

function renderStats() {
  const statsEl = document.getElementById('statsBar');
  if (!statsEl) return;

  const disponiveis = certificates.filter(c => c.status !== 'futuro').length;
  const futuros = certificates.filter(c => c.status === 'futuro').length;

  statsEl.innerText = `🎓 ${disponiveis} conquistados  •  ⏳ ${futuros} a caminho`;
}

function initSearch() {
  const searchEl = document.getElementById('searchInput');
  if (!searchEl) return;

  searchEl.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    renderDesktopIcons();
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
  renderDock();
  renderDesktopIcons();
  renderStats();
  initSearch();
  initClock();
});
