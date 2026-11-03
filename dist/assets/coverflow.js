(() => {
 'use strict';
 document.querySelectorAll('[data-team-coverflow]').forEach(root=>{
  const track=root.querySelector('[data-carousel-track]'),cards=[...track.querySelectorAll('[data-carousel-card]')];if(cards.length<2)return;
  const previous=root.querySelector('[data-carousel-prev]'),next=root.querySelector('[data-carousel-next]'),status=root.querySelector('[data-carousel-status]');let current=0,start=null,suppressClick=false;
  root.classList.add('coverflow-ready');track.setAttribute('aria-roledescription',document.documentElement.lang==='uk'?'карусель із трьома картками':'three-card coverflow');
  function show(index){const active=document.activeElement,focusedCard=active?.closest('[data-carousel-card]');current=(index+cards.length)%cards.length;cards.forEach((card,i)=>{const offset=(i-current+cards.length)%cards.length;card.classList.toggle('is-current',offset===0);card.classList.toggle('is-left',offset===cards.length-1);card.classList.toggle('is-right',offset===1);card.setAttribute('aria-current',String(offset===0));card.querySelectorAll('a,button').forEach(el=>{el.tabIndex=offset===0?0:-1;});});status.textContent=`${current+1} / ${cards.length} · ${cards[current].querySelector('h3').textContent}`;previous.disabled=false;next.disabled=false;if(focusedCard&&focusedCard!==cards[current])track.focus({preventScroll:true});}
  previous.addEventListener('click',()=>show(current-1));next.addEventListener('click',()=>show(current+1));
  track.addEventListener('click',event=>{if(suppressClick){event.preventDefault();event.stopImmediatePropagation();suppressClick=false;return;}const card=event.target.closest('[data-carousel-card]');if(card&&!card.classList.contains('is-current')){event.preventDefault();event.stopImmediatePropagation();show(cards.indexOf(card));}},{capture:true});
  track.addEventListener('keydown',event=>{if(event.altKey||event.ctrlKey||event.metaKey)return;const target={ArrowLeft:current-1,ArrowRight:current+1,Home:0,End:cards.length-1}[event.key];if(target!==undefined){event.preventDefault();show(target);}});
  track.addEventListener('pointerdown',event=>{if(event.button!==0)return;start={x:event.clientX,y:event.clientY,id:event.pointerId};});
  track.addEventListener('pointerup',event=>{if(!start||event.pointerId!==start.id)return;const dx=event.clientX-start.x,dy=event.clientY-start.y;start=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3){suppressClick=true;show(current+(dx<0?1:-1));setTimeout(()=>{suppressClick=false;},350);}});
  track.addEventListener('pointercancel',()=>{start=null;});show(0);
 });
})();
