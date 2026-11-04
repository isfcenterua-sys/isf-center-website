const archive=document.querySelector('.editorial-archive');
if(archive){const reveal=()=>{let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}const e=document.getElementById(id);if(e&&archive.contains(e)){archive.open=true;requestAnimationFrame(()=>e.scrollIntoView({behavior:'auto',block:'start'}));}};addEventListener('hashchange',reveal);reveal();}
const root=document.querySelector('[data-journey-map]');
if(root){
 const uk=root.dataset.language==='uk';let promise,api;const feedback=root.querySelector('[data-journey-feedback]');
 async function ready(){if(api)return api;if(promise)return promise;root.setAttribute('aria-busy','true');feedback.textContent=uk?'Готуємо інтерактивну сцену…':'Preparing the interactive scene…';
  promise=(async()=>{const u=new URL(root.dataset.controller,location.href);if(u.origin!==location.origin)throw Error('Unexpected controller');const m=await import(u.href);api=await m.createCinematicJourney(root);feedback.textContent='';return api;})().catch(()=>{promise=null;root.dataset.state='error';feedback.textContent=uk?'3D-сцена недоступна в цьому браузері. Фотографії та Google Maps залишаються доступними. Спробуйте ще раз.':'The 3D scene is unavailable. Photographs and Google Maps remain available. You can try again.';throw Error('Scene unavailable');}).finally(()=>root.removeAttribute('aria-busy'));return promise;
 }
 const call=(b,method,...args)=>b?.addEventListener('click',async()=>{try{const scene=await ready();scene[method](...args);}catch{}});
 call(root.querySelector('[data-journey-play]'),'play');call(root.querySelector('[data-journey-pause]'),'pause');call(root.querySelector('[data-journey-reset]'),'reset');
 for(const b of root.querySelectorAll('[data-journey-step]'))call(b,'selectStage',+b.dataset.journeyStep);
 for(const b of root.querySelectorAll('[data-scene-object]'))call(b,'selectObject',b.dataset.sceneObject);
 root.querySelector('[data-journey-controls]').hidden=false;root.querySelector('[data-journey-steps]').hidden=false;
}
