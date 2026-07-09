// Renders the work entries for a page from works.json (single source of truth).
// Container: <div id="work-entries" data-page="creative|dev" data-sections='["Section A","Section B"]'></div>
(async () => {
  const container = document.getElementById('work-entries');
  if (!container) return;
  const page = container.dataset.page;
  let sections = [];
  try { sections = JSON.parse(container.dataset.sections); } catch (e) { sections = []; }
  const { works } = await (await fetch('data/works.json')).json();
  const pages = works.filter(w => w.page && w.page.on === page).map(w => w.page);
  const bySec = {};
  pages.forEach(p => (bySec[p.section] = bySec[p.section] || []).push(p));
  const esc = s => s.replace(/&/g, '&amp;');
  let html = '';
  sections.forEach(sec => {
    const items = (bySec[sec] || []).slice().sort((a, b) => a.order - b.order);
    if (!items.length) return;
    html += `<div class="catsec"><div class="wrap"><div class="sec-label">${esc(sec)}</div>`;
    items.forEach((p, i) => {
      const meta = (p.meta || []).map((kv, j) =>
        `<dt${j === 0 ? ' class="top"' : ''}>${esc(kv[0])}</dt><dd>${esc(kv[1])}</dd>`).join('');
      html += `<div class="entry${i === 0 ? ' first' : ''}">`
            + `<dl class="meta">${meta}</dl>`
            + `<div class="body"><h2 id="${p.anchor}">${p.title}</h2>${p.body}</div></div>`;
    });
    html += `</div></div>`;
  });
  container.outerHTML = html;
})();
