(() => {
  'use strict';
  document.querySelectorAll('[data-team-carousel]').forEach(root => {
    const track=root.querySelector('.team-track');
    const cards=[...track.querySelectorAll('.team-card')];
    const previous=root.querySelector('[data-team-prev]');
    const next=root.querySelector('[data-team-next]');
    const status=root.querySelector('[data-team-status]');
    const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
    const step=()=>cards.length>1?cards[1].offsetLeft-cards[0].offsetLeft:track.clientWidth;
    function update(){
      const last=track.scrollWidth-track.clientWidth;
      previous.disabled=track.scrollLeft<=2;
      next.disabled=track.scrollLeft>=last-2;
      const index=Math.min(cards.length-1,Math.round(track.scrollLeft/step()));
      status.textContent=`${index+1} / ${cards.length}`;
    }
    function go(index){track.scrollTo({left:Math.max(0,index)*step(),behavior:reduced()?'auto':'smooth'});}
    previous.addEventListener('click',()=>go(Math.round(track.scrollLeft/step())-1));
    next.addEventListener('click',()=>go(Math.round(track.scrollLeft/step())+1));
    track.addEventListener('keydown',event=>{
      if(event.altKey||event.ctrlKey||event.metaKey)return;
      const current=Math.round(track.scrollLeft/step());
      if(event.key==='ArrowRight'){event.preventDefault();go(current+1);}
      if(event.key==='ArrowLeft'){event.preventDefault();go(current-1);}
      if(event.key==='Home'){event.preventDefault();go(0);}
      if(event.key==='End'){event.preventDefault();go(cards.length-1);}
    });
    let frame=0;
    track.addEventListener('scroll',()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(update);},{passive:true});
    new ResizeObserver(update).observe(track);
    update();
  });
  const dialog=document.querySelector('#certificate-viewer');
  if(!dialog)return;
  let opener;
  const zoom=dialog.querySelector('[data-document-zoom]');
  const reset=()=>{dialog.classList.remove('is-zoomed');dialog.dataset.zoom='100';zoom.setAttribute('aria-pressed','false');zoom.textContent=(document.documentElement.lang==='uk'?'Масштаб':'Zoom')+' 100%';};
  document.querySelectorAll('[data-open-certificate]').forEach(button=>button.addEventListener('click',()=>{
    opener=button;reset();dialog.showModal();document.body.style.overflow='hidden';
    dialog.querySelector('.certificate-viewport').scrollTo(0,0);
  }));
  dialog.querySelector('[data-close-certificate]').addEventListener('click',()=>dialog.close());
  zoom.addEventListener('click',()=>{
    const levels=[100,150,200,300];
    const level=levels[(levels.indexOf(Number(dialog.dataset.zoom||100))+1)%levels.length];
    dialog.dataset.zoom=String(level);zoom.setAttribute('aria-pressed',String(level!==100));zoom.textContent=(document.documentElement.lang==='uk'?'Масштаб':'Zoom')+' '+level+'%';
  });
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{document.body.style.overflow='';reset();opener?.focus();});
})();
