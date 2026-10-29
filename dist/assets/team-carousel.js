(() => {
  'use strict';
  const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-team-single]').forEach(root=>{
    const track=root.querySelector('[data-carousel-track]');
    const cards=[...track.querySelectorAll('[data-carousel-card]')];
    if(cards.length<2)return;
    const clone=card=>{const node=card.cloneNode(true);node.classList.remove('person-card');node.classList.add('team-sentinel');node.removeAttribute('data-carousel-card');node.setAttribute('aria-hidden','true');node.inert=true;return node;};
    track.prepend(clone(cards.at(-1)));track.append(clone(cards[0]));
    const previous=root.querySelector('[data-carousel-prev]'),next=root.querySelector('[data-carousel-next]'),status=root.querySelector('[data-carousel-status]');
    let index=0,frame=0,animating=false,dragging=false,startX=0,startScroll=0;
    const step=()=>cards[1].offsetLeft-cards[0].offsetLeft;
    const physical=()=>Math.round(track.scrollLeft/step());
    const update=()=>{index=((physical()-1)%cards.length+cards.length)%cards.length;status.textContent=`${index+1} / ${cards.length}`;cards.forEach((card,i)=>card.classList.toggle('is-current',i===index));previous.disabled=false;next.disabled=false;};
    const jump=p=>{track.scrollLeft=p*step();};
    const settle=()=>{if(animating||dragging)return;const p=physical();if(p===0)jump(cards.length);if(p===cards.length+1)jump(1);update();};
    const go=p=>{
      cancelAnimationFrame(frame);animating=true;track.classList.add('is-animating');
      const from=track.scrollLeft,to=Math.max(0,Math.min(cards.length+1,p))*step(),started=performance.now();
      const finish=()=>{track.scrollLeft=to;animating=false;track.classList.remove('is-animating');settle();};
      if(reduced()){finish();return;}
      const tick=now=>{const t=Math.min(1,(now-started)/550),ease=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;track.scrollLeft=from+(to-from)*ease;if(t<1)frame=requestAnimationFrame(tick);else finish();};
      frame=requestAnimationFrame(tick);
    };
    previous.addEventListener('click',()=>go(physical()-1));next.addEventListener('click',()=>go(physical()+1));
    track.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey)return;const destinations={ArrowLeft:physical()-1,ArrowRight:physical()+1,Home:1,End:cards.length};if(e.key in destinations){e.preventDefault();go(destinations[e.key]);}});
    track.addEventListener('scroll',()=>{if(!animating)update();},{passive:true});
    track.addEventListener('scrollend',settle);
    track.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')return;if(e.button!==0||e.target.closest('button,a'))return;cancelAnimationFrame(frame);animating=false;dragging=true;startX=e.clientX;startScroll=track.scrollLeft;track.setPointerCapture(e.pointerId);track.classList.add('is-dragging');e.preventDefault();});
    track.addEventListener('pointermove',e=>{if(dragging)track.scrollLeft=startScroll-(e.clientX-startX);});
    const finishDrag=()=>{if(!dragging)return;dragging=false;track.classList.remove('is-dragging');go(physical());};
    track.addEventListener('pointerup',finishDrag);track.addEventListener('pointercancel',finishDrag);
    track.addEventListener('wheel',()=>{cancelAnimationFrame(frame);animating=false;track.classList.remove('is-animating');},{passive:true});
    new ResizeObserver(()=>{if(!animating&&!dragging){jump(index+1);update();}}).observe(track);
    jump(1);update();
  });
})();
