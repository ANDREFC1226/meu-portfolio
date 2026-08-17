import { certificates } from './certificates.js';
import { classify, CATEGORY_META } from './classifier.js';
import { WindowManager } from './windowManager.js';
import { initDockMagnify } from './dock.js';
import { initTitleAnimation } from './titleAnimation.js';

const windowManager = new WindowManager('windowLayer');
let activeFilter = 'Todos';

function enrichCertificates() {
  return certificates.map(c => ({ ...c, category: classify(c) }));
}

function groupByCategory(list) {
  const groups = {};
  list.forEach(c => {
    if (!groups[c.category]) groups[c.category] = [];
    groups[c.category].push(c);
  });
  return groups;
}

function renderDesktop() {
  const desktopEl = document.getElementById('desktop');
  desktopEl.innerHTML = '';
  const groups = groupByCategory(enrichCertificates());
  const categories = Object.keys(groups).sort();
  let iconIndex = 0;

  categories.forEach(cat => {
    if (activeFilter !== 'Todos' && activeFilter !== cat) return;

    const groupEl = document.createElement('section');
    groupEl.className = 'category-group';
    groupEl.innerHTML = `<h2 class="category-header">${CATEGORY_META[cat]?.icon || '📁'} ${cat} <span class="category-count">${groups[cat].length}</span></h2>`;

    const rowEl = document.createElement('div');
    rowEl.className = 'category-row';

    groups[cat].forEach(cert => {
      const isFuturo = cert.status === 'futuro';
      const iconEl = document.createElement('div');
      iconEl.className = `icon${isFuturo ? ' icon-locked' : ''}`;
      iconEl.style.animationDelay = `${iconIndex * 55}ms`;
      iconIndex++;

      iconEl.innerHTML = `
        <div class="icon-img">${cert.icon}</div>
        <div class="icon-label">${cert.title}</div>
        ${isFuturo ? '<div class="icon-badge">Em breve</div>' : ''}
      `;

      iconEl.addEventListener('click', () => {
        if (isFuturo) return;
        windowManager.open(cert);
      });

      rowEl.appendChild(iconEl);
    });

    groupEl.appendChild(rowEl);
    desktopEl.appendChild(groupEl);
  });

  if (!desktopEl.innerHTML) {
    desktopEl.innerHTML = `<p class="empty-state">Nenhum certificado nessa categoria ainda.</p>`;
  }
}

function renderDock() {
  const dockEl = document.getElementById('dock');
  dockEl.innerHTML = '';
  const cats = ['Todos', ...new Set(enrichCertificates().map(c => c.category))];

  cats.forEach(cat => {
    const icon = cat === 'Todos' ? '🖥️' : (CATEGORY_META[cat]?.icon || '📁');
    const item = document.createElement('div');
    item.className = `dock-item${cat === activeFilter ? ' active' : ''}`;
    item.innerHTML = `<span class="dock-icon">${icon}</span><span class="dock-tooltip">${cat}</span>`;
    item.addEventListener('click', () => {
      activeFilter = cat;
      renderDock();
      renderDesktop();
    });
    dockEl.appendChild(item);
  });

  initDockMagnify(dockEl);
}

function renderStats() {
  const statsEl = document.getElementById('statsBar');
  if (!statsEl) return;
  const list = enrichCertificates();
  const disponiveis = list.filter(c => c.status !== 'futuro').length;
  const futuros = list.filter(c => c.status === 'futuro').length;
  statsEl.innerText = `🎓 ${disponiveis} conquistados  •  ⏳ ${futuros} a caminho`;
}

function initClock() {
  const clockEl = document.getElementById('clock');
  if (!clockEl) return;
  function update() {
    const now = new Date();
    clockEl.innerText = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  }
  setInterval(update, 1000);
  update();
}

document.addEventListener('DOMContentLoaded', () => {
  renderDock();
  renderDesktop();
  renderStats();
  initClock();
  initTitleAnimation('titleAnimated', ['Meu Portfólio', 'Minhas Conquistas', 'Sempre Evoluindo']);
});
