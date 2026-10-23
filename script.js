const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());

const filters = document.querySelector('.filters');
const publications = [...document.querySelectorAll('.publication')];
const filterStatus = document.querySelector('#filter-status');
if (filters && filterStatus) {
  filters.hidden = false;
  filters.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-filter]');
    if (!button) return;
    const topic = button.dataset.filter;
    let shown = 0;
    publications.forEach((publication) => {
      publication.hidden = topic !== 'all' && publication.dataset.topic !== topic;
      if (!publication.hidden) shown += 1;
    });
    filters.querySelectorAll('button').forEach((item) => {
      item.setAttribute('aria-pressed', String(item === button));
    });
    filterStatus.textContent = `${shown} publication${shown === 1 ? '' : 's'} shown.`;
  });
}

const navLinks = [...document.querySelectorAll('nav a[href^="#"]')];
const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href')));
let framePending = false;
function updateNavigation() {
  framePending = false;
  const readingLine = window.innerHeight * 0.3;
  let current = -1;
  sections.forEach((section, index) => {
    if (section && section.getBoundingClientRect().top <= readingLine) current = index;
  });
  navLinks.forEach((link, index) => {
    if (index === current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
function scheduleNavigationUpdate() {
  if (!framePending) {
    framePending = true;
    window.requestAnimationFrame(updateNavigation);
  }
}
window.addEventListener('scroll', scheduleNavigationUpdate, { passive: true });
window.addEventListener('resize', scheduleNavigationUpdate);
updateNavigation();

const viewer = document.querySelector('#image-viewer');
const viewerImage = viewer?.querySelector('.viewer-image');
const viewerClose = viewer?.querySelector('.viewer-close');
if (viewer && viewerImage && viewerClose && typeof viewer.showModal === 'function') {
  document.querySelectorAll('a[data-enlarge]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      viewerImage.src = link.href;
      viewerImage.alt = link.querySelector('img')?.alt || '';
      viewer.showModal();
      document.body.classList.add('viewer-open');
    });
  });
  viewerClose.addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', (event) => {
    if (event.target === viewer) viewer.close();
  });
  viewer.addEventListener('close', () => {
    document.body.classList.remove('viewer-open');
    viewerImage.removeAttribute('src');
    viewerImage.alt = '';
  });
}
