(() => {
  'use strict';
  document.querySelectorAll('[data-carousel]:not([data-team-single])').forEach(root=>{
    const track=root.querySelector('[data-carousel-track]'),cards=[...track.querySelectorAll('[data-carousel-card]')];
    const previous=root.querySelector('[data-carousel-prev]'),next=root.querySelector('[data-carousel-next]'),status=root.querySelector('[data-carousel-status]');
    const step=()=>cards.length>1?cards[1].offsetLeft-cards[0].offsetLeft:track.clientWidth;
    const update=()=>{previous.disabled=track.scrollLeft<=2;next.disabled=track.scrollLeft>=track.scrollWidth-track.clientWidth-2;const index=Math.min(cards.length-1,Math.round(track.scrollLeft/step()));status.textContent=`${index+1} / ${cards.length}`;cards.forEach((c,i)=>c.classList.toggle('is-current',i===index));};
    const go=i=>track.scrollTo({left:Math.max(0,i)*step(),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    previous.addEventListener('click',()=>go(Math.round(track.scrollLeft/step())-1));next.addEventListener('click',()=>go(Math.round(track.scrollLeft/step())+1));
    track.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey)return;const i=Math.round(track.scrollLeft/step());if(e.key==='ArrowRight'){e.preventDefault();go(i+1);}if(e.key==='ArrowLeft'){e.preventDefault();go(i-1);}if(e.key==='Home'){e.preventDefault();go(0);}if(e.key==='End'){e.preventDefault();go(cards.length-1);}});
    let dragging=false,startX=0,startScroll=0;
    track.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||e.button!==0||e.target.closest('button,a'))return;dragging=true;startX=e.clientX;startScroll=track.scrollLeft;track.setPointerCapture(e.pointerId);track.classList.add('is-dragging');e.preventDefault();});
    track.addEventListener('pointermove',e=>{if(dragging)track.scrollLeft=startScroll-(e.clientX-startX);});
    const finishDrag=()=>{if(!dragging)return;dragging=false;track.classList.remove('is-dragging');go(Math.round(track.scrollLeft/step()));};
    track.addEventListener('pointerup',finishDrag);track.addEventListener('pointercancel',finishDrag);
    let frame;track.addEventListener('scroll',()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(update);},{passive:true});new ResizeObserver(update).observe(track);update();
  });
  const dialog=document.querySelector('#detail-viewer');
  if(dialog){let opener;const templates=new Map([...document.querySelectorAll('[data-detail-template]')].map(t=>[t.dataset.detailTemplate,t]));document.querySelectorAll('[data-detail]').forEach(button=>button.addEventListener('click',()=>{const template=templates.get(button.dataset.detail);if(!template)return;opener=button;dialog.querySelector('#detail-viewer-title').textContent=template.dataset.title;dialog.querySelector('[data-detail-content]').replaceChildren(template.content.cloneNode(true));dialog.showModal();document.body.style.overflow='hidden';dialog.querySelector('[data-detail-content]').scrollTo(0,0);}));dialog.querySelector('[data-close-detail]').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{document.body.style.overflow='';opener?.focus();});}
  if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(element=>observer.observe(element));document.documentElement.classList.add('has-motion');}
})();
