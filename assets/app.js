(() => {
  'use strict';
  const menu = document.querySelector('.menu');
  const nav = document.querySelector('.nav');
  function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });
  document.addEventListener('click', e => { if (!e.target.closest('.header')) closeMenu(); });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  matchMedia('(min-width:941px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
  const cards = [...document.querySelectorAll('[data-photo-card]')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    cards.forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; });
    const count = document.querySelector('[data-count]');
    if (count) count.textContent = cards.filter(c => !c.hidden).length;
  }));
  const dialog = document.querySelector('.lightbox');
  const image = dialog.querySelector('img');
  const buttons = [...document.querySelectorAll('[data-photo]')];
  let current = 0, sequence = [], opener;
  const show = index => {
    current = (index + sequence.length) % sequence.length;
    const item = sequence[current];
    image.src = item.dataset.full;
    image.alt = item.dataset.alt;
    dialog.querySelector('figcaption').textContent = item.dataset.caption || '';
    dialog.querySelector('[data-photo-status]').textContent = `${current + 1} / ${sequence.length}`;
    dialog.querySelectorAll('[data-prev],[data-next]').forEach(b => { b.disabled = sequence.length < 2; });
  };
  buttons.forEach(button => button.addEventListener('click', () => {
    opener = button;
    sequence = buttons.filter(b => !b.closest('[hidden]'));
    show(sequence.indexOf(button));
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  }));
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-prev]').addEventListener('click', () => show(current - 1));
  dialog.querySelector('[data-next]').addEventListener('click', () => show(current + 1));
  dialog.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); } if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); } });
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r=dialog.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; image.removeAttribute('src'); opener?.focus(); });
})();
