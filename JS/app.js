// js/app.js
const API_URL = 'https://gabistam.github.io/Demo_API/data/projects.json'; // :contentReference[oaicite:1]{index=1}

const els = {
    loader: document.getElementById('loader'),
    error: document.getElementById('error'),
    list: document.getElementById('projects'),
    search: document.getElementById('search'),
    tech: document.getElementById('techSelect'),
    year: document.getElementById('yearSelect'),
    reset: document.getElementById('btnReset'),
    modal: document.getElementById('projectModal'),
    modalTitle: document.getElementById('modalTitle'),
    modalBody: document.getElementById('modalBody'),
    modalLink: document.getElementById('modalLink'),
    themeToggle: document.getElementById('themeToggle')
};

let DATA = { projects: [], technologies: [] };

// ---------- UI helpers ----------
const showLoader = (v) => els.loader.hidden = !v;
const showError = (msg) => {
    els.error.textContent = msg;
    els.error.classList.toggle('d-none', !msg);
};

// ---------- Render ----------
function renderTechFilter(techs) {
    const frag = document.createDocumentFragment();
    techs.sort().forEach(t => {
        const opt = document.createElement('option');
        opt.value = t;
        opt.textContent = t;
        frag.appendChild(opt);
    });
    els.tech.appendChild(frag);
}

function renderYearFilter(projects) {
    const years = Array.from(new Set(projects.map(p => p.year))).sort((a, b) => b - a);
    const frag = document.createDocumentFragment();
    years.forEach(y => {
        const opt = document.createElement('option');
        opt.value = y;
        opt.textContent = y;
        frag.appendChild(opt);
    });
    els.year.appendChild(frag);
}

function badgeTech(t) {
    return `<span class="badge text-bg-primary-subtle border border-primary-subtle text-primary-emphasis me-1 mb-1">${t}</span>`;
}

function cardProject(p) {
    const techBadges = p.technologies.map(badgeTech).join('');
    return `
  <div class="col-sm-6 col-lg-4">
    <div class="card h-100 shadow-sm">
      <img src="${p.image || 'https://picsum.photos/640/360?blur=3'}"
           class="card-img-top" alt="Aperçu du projet ${p.title}">
      <div class="card-body">
        <h5 class="card-title mb-1">${p.title}</h5>
        <p class="text-muted small mb-2"><strong>Client :</strong> ${p.client}</p>
        <div class="d-flex flex-wrap gap-1 mb-3">${techBadges}</div>
        <p class="card-text text-truncate-2">${p.description || ''}</p>
      </div>
      <div class="card-footer bg-body d-grid">
        <button class="btn btn-primary btn-details"
                type="button"
                data-id="${p.id}"
                data-bs-toggle="modal"
                data-bs-target="#projectModal">Voir détails</button>
      </div>
    </div>
  </div>`;
}

function renderProjects(list) {
    if (!list || list.length === 0) {
        els.list.innerHTML = `<div class="col-12"><div class="alert alert-warning mb-0">Aucun projet trouvé.</div></div>`;
        return;
    }
    els.list.innerHTML = list.map(cardProject).join('');

    els.list.querySelectorAll('.btn-details').forEach(btn => {
        btn.addEventListener('click', () => {
            const proj = DATA.projects.find(p => p.id === Number(btn.dataset.id));
            if (proj) fillModal(proj);
        });
    });
}

// ---------- Modal ----------
function fillModal(p) {
    els.modalTitle.textContent = p.title;

    const feats = (p.features || []).map(f => `<li>${f}</li>`).join('');
    const techBadges = p.technologies.map(badgeTech).join('');

    els.modalBody.innerHTML = `
    <img src="${p.backdrop || p.image || 'https://picsum.photos/1200/600?blur=3'}"
         class="img-fluid rounded mb-3"
         alt="Visuel du projet ${p.title}">
    <div class="mb-2 text-muted small">
      <span class="me-3"><strong>Catégorie :</strong> ${p.category || '-'}</span>
      <span class="me-3"><strong>Année :</strong> ${p.year || '-'}</span>
      <span class="me-3"><strong>Durée :</strong> ${p.duration || '-'}</span>
    </div>
    <p class="mb-3">${p.description || ''}</p>
    <div class="mb-3">${techBadges}</div>
    ${feats ? `<h6 class="mb-2">Fonctionnalités</h6><ul class="mb-0">${feats}</ul>` : ''}
  `;

    els.modalLink.href = p.url || '#';
}

// ---------- Filters ----------
function applyFilters() {
    const q = (els.search.value || '').toLowerCase().trim();
    const tech = els.tech.value;
    const year = els.year.value;

    const out = DATA.projects.filter(p => {
        const matchesText =
            !q ||
            p.title.toLowerCase().includes(q) ||
            (p.client || '').toLowerCase().includes(q) ||
            (p.technologies || []).some(t => t.toLowerCase().includes(q));

        const matchesTech = !tech || (p.technologies || []).includes(tech);
        const matchesYear = !year || String(p.year) === year;

        return matchesText && matchesTech && matchesYear;
    });

    renderProjects(out);
}

// ---------- Init ----------
async function boot() {
    try {
        showLoader(true);
        showError('');

        const res = await fetch(API_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        DATA.projects = data.projects || [];
        DATA.technologies = data.technologies || [];

        renderTechFilter(DATA.technologies);
        renderYearFilter(DATA.projects);
        renderProjects(DATA.projects);

    } catch (err) {
        console.error(err);
        showError("Impossible de charger les projets. Vérifiez votre connexion puis réessayez.");
    } finally {
        showLoader(false);
    }
}

['input', 'change'].forEach(ev => {
    els.search.addEventListener(ev, applyFilters);
    els.tech.addEventListener(ev, applyFilters);
    els.year.addEventListener(ev, applyFilters);
});
els.reset.addEventListener('click', () => {
    setTimeout(applyFilters, 0);
});

if (els.themeToggle) {
    els.themeToggle.addEventListener('click', () => {
        const html = document.documentElement;
        html.setAttribute('data-bs-theme',
            html.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark');
    });
}

document.addEventListener('DOMContentLoaded', boot);
