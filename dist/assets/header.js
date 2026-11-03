(() => {
 const header=document.querySelector('.approved-header');if(!header)return;
 const menu=header.querySelector('.menu'),nav=header.querySelector('#navigation');
 const groups=[...header.querySelectorAll('[data-nav-group]')],language=header.querySelector('[data-language-selector]');
 if(header.classList.contains('cinematic-header')){const update=()=>header.classList.toggle('is-scrolled',window.scrollY>24);window.addEventListener('scroll',update,{passive:true});update();}
 const desktop=matchMedia(header.classList.contains('cinematic-header')?'(min-width:1301px)':'(min-width:1101px)'),hover=matchMedia('(hover:hover)');
 function closeGroups(except){for(const group of [...groups,language])if(group!==except)group.open=false;}
 function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');closeGroups();}
 menu.addEventListener('click',()=>{const open=!nav.classList.contains('open');nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));if(!open)closeGroups();});
 for(const group of [...groups,language]){
  group.addEventListener('toggle',()=>{if(group.open)closeGroups(group);});
  const summary=group.querySelector('summary');
  summary.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();group.open=true;group.querySelector('a')?.focus();}});
  group.addEventListener('keydown',event=>{if(event.key==='Escape'&&group.open){event.preventDefault();event.stopPropagation();group.open=false;summary.focus();}});
  if(groups.includes(group)){
   let timer;
   group.addEventListener('pointerenter',()=>{if(desktop.matches&&hover.matches){clearTimeout(timer);group.open=true;}});
   group.addEventListener('pointerleave',()=>{if(desktop.matches&&hover.matches)timer=setTimeout(()=>{if(!group.contains(document.activeElement))group.open=false;},220);});
   group.addEventListener('focusout',()=>{if(desktop.matches)setTimeout(()=>{if(!group.contains(document.activeElement)&&!group.matches(':hover'))group.open=false;},0);});
  }
 }
 document.addEventListener('click',event=>{if(!header.contains(event.target))closeMenu();else if(!event.target.closest('.language-selector'))language.open=false;});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus();}});
 nav.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
 function measureHeader(){const panel=desktop.matches?nav:header.querySelector('.header-mobile-actions');const offset=Math.max(0,Math.round(panel.getBoundingClientRect().top-header.getBoundingClientRect().top-8));header.style.setProperty('--header-collapse',offset+'px');}
 new ResizeObserver(measureHeader).observe(header);measureHeader();
 desktop.addEventListener('change',()=>{closeMenu();measureHeader();});
 const dialog=header.querySelector('#site-search'),input=dialog.querySelector('input'),results=dialog.querySelector('[data-search-results]'),status=dialog.querySelector('[data-search-status]');
 const uk=document.documentElement.lang==='uk';let entries=null,loading=null,opener=null,previousOverflow='';
 const normalize=value=>value.toLocaleLowerCase().normalize('NFKC').replace(/[’ʼ]/g,"'");
 function render(){
  if(!entries)return;const words=normalize(input.value.trim()).split(/\s+/).filter(Boolean);
  const matches=entries.filter(item=>words.every(word=>normalize(item.title+' '+item.description).includes(word)));
  results.replaceChildren();
  for(const item of matches){const li=document.createElement('li'),a=document.createElement('a'),title=document.createElement('strong'),description=document.createElement('p');a.href=item.url;title.textContent=item.title;description.textContent=item.description;a.append(title,description);li.append(a);results.append(li);}
  status.textContent=matches.length?(uk?'Знайдено розділів: ':'Sections found: ')+matches.length:(uk?'Нічого не знайдено. Спробуйте інше слово.':'No results. Try another word.');
 }
 async function load(){
  if(entries){render();return;}status.textContent=uk?'Завантаження…':'Loading…';
  try{
   loading ||= fetch(dialog.dataset.searchIndex).then(response=>{if(!response.ok)throw Error('Search index unavailable');return response.json();});
   const data=await loading,lang=uk?'uk':'en';entries=data[lang].filter(item=>typeof item.title==='string'&&typeof item.description==='string'&&item.url.startsWith('/'+lang+'/'));render();
  }catch{loading=null;status.textContent=uk?'Пошук тимчасово недоступний. Скористайтеся меню розділів.':'Search is temporarily unavailable. Please use the navigation menu.';}
 }
 header.querySelectorAll('[data-open-search]').forEach(button=>button.addEventListener('click',()=>{closeMenu();opener=button;previousOverflow=document.body.style.overflow;dialog.showModal();document.body.style.overflow='hidden';input.focus();load();}));
 dialog.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();dialog.close();}});
 dialog.querySelector('[data-close-search]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;opener?.focus();});
 input.addEventListener('input',render);input.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();results.querySelector('a')?.focus();}});
})();
