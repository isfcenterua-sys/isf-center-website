(() => {
  'use strict';
  const menu = document.querySelector('.menu');
  const nav = document.querySelector('.nav');
  function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });
  document.addEventListener('click', e => { if (!e.target.closest('.header')) closeMenu(); });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  matchMedia('(min-width:1101px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
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
  const descriptions=new Map([...document.querySelectorAll('[data-photo-description]')].map(t=>[t.dataset.photoDescription,t]));
  const detail=dialog.querySelector('.lightbox-description');
  let current = 0, sequence = [], opener;
  const show = index => {
    current = (index + sequence.length) % sequence.length;
    const item = sequence[current];
    image.src = item.dataset.full;
    image.alt = item.dataset.alt;
    image.width=Number(item.dataset.width);image.height=Number(item.dataset.height);
    dialog.querySelector('#photo-viewer-title').textContent=item.dataset.title||'';
    dialog.querySelector('[data-photo-caption]').textContent=item.dataset.caption||'';
    dialog.querySelector('[data-photo-category]').textContent=item.dataset.categoryLabel||'';
    const template=descriptions.get(item.dataset.photoKey);
    dialog.querySelector('[data-photo-description-content]').replaceChildren(...(template?[template.content.cloneNode(true)]:[]));
    detail.hidden=!template;detail.open=false;
    dialog.querySelector('.lightbox-scroll').scrollTo(0,0);
    dialog.querySelector('[data-photo-status]').textContent = `${current + 1} / ${sequence.length}`;
    dialog.querySelectorAll('[data-prev],[data-next]').forEach(b => { b.disabled = sequence.length < 2; });
  };
  buttons.forEach(button => button.addEventListener('click', () => {
    opener = button;
    const seen=new Set();
    sequence=buttons.filter(b=>{const key=b.dataset.photoKey||b.dataset.full;if(b.closest('[hidden]')||seen.has(key))return false;seen.add(key);return true;});
    show(sequence.findIndex(b=>(b.dataset.photoKey||b.dataset.full)===(button.dataset.photoKey||button.dataset.full)));
    detail.open=button.dataset.expanded==='true';
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    if(detail.open)requestAnimationFrame(()=>detail.scrollIntoView({block:'nearest'}));
  }));
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-prev]').addEventListener('click', () => show(current - 1));
  dialog.querySelector('[data-next]').addEventListener('click', () => show(current + 1));
  dialog.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); } if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); } });
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r=dialog.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) dialog.close(); } });
  let swipeStart;
  dialog.addEventListener('pointerdown', e => { if(e.pointerType==='touch')swipeStart={x:e.clientX,y:e.clientY}; });
  dialog.addEventListener('pointerup', e => {
    if(!swipeStart)return;
    const dx=e.clientX-swipeStart.x,dy=e.clientY-swipeStart.y;
    if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5&&sequence.length>1)show(current+(dx<0?1:-1));
    swipeStart=null;
  });
  dialog.addEventListener('pointercancel',()=>{swipeStart=null;});
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; image.removeAttribute('src'); opener?.focus(); });
})();
