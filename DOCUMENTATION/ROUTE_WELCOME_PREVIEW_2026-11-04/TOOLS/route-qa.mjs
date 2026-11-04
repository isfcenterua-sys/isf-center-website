import {createRequire} from 'node:module';import fs from 'node:fs';import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/igor/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out='qa-route-preview';fs.mkdirSync(out,{recursive:true});const report={checks:[],errors:[],runtimeMapRequests:[]},check=(name,value)=>{assert.ok(value,name);report.checks.push(name)};
const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try{
 const c=await b.newContext({viewport:{width:1440,height:1200},reducedMotion:'reduce'}),p=await c.newPage();await c.route('https://www.google.com/**',r=>r.abort());p.on('pageerror',e=>report.errors.push(e.message));p.on('request',r=>{if(/overpass|nominatim|router.project-osrm/.test(r.url()))report.runtimeMapRequests.push(r.url());});
 const root=p.locator('[data-journey-map]'),photo=p.locator('.journey-arrival-content img'),done=()=>p.waitForFunction(()=>document.querySelector('[data-journey-map]').dataset.state==='complete',null,{timeout:30000});
 const select=async n=>{await p.locator(`[data-journey-step="${n}"]`).click();await done();};
 const shot=async name=>{const h=await root.evaluate(e=>e.getBoundingClientRect().height),width=p.viewportSize().width;await p.setViewportSize({width,height:Math.ceil(h+300)});await root.evaluate(e=>{document.activeElement?.blur();scrollTo(0,e.getBoundingClientRect().top+scrollY-150);});await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await root.screenshot({path:`${out}/${name}.png`,animations:'disabled'});};
 for(const lang of ['uk','en'])for(const width of [320,360,390,430,768,1440]){
  await p.setViewportSize({width,height:1200});await p.goto(`http://127.0.0.1:4173/${lang}/`);await p.evaluate(()=>document.fonts.ready);const key=lang+'/'+width;
  check(key+' no welcome photograph before arrival',!await photo.isVisible());
  await select(2);check(key+' road network ready',await root.getAttribute('data-road-alpha')==='1.0000');check(key+' complete road route',await root.getAttribute('data-route-progress')==='1.0000');
  check(key+' three route stops visible',await root.locator('.journey-route-stop:visible').count()===2&&await root.locator('[data-journey-marker]').isVisible());
  check(key+' route line rendered',await root.locator('.route-line').getAttribute('d').then(s=>s.length>1000));
  check(key+' no duplicate photo on map card',!await photo.isVisible());check(key+' no horizontal overflow on route',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  const labels=await root.locator('.journey-route-stop:visible,[data-journey-marker]:visible').evaluateAll(a=>a.map(e=>{const b=e.getBoundingClientRect(),v=e.closest('.journey-viewport').getBoundingClientRect();return {text:e.textContent,left:b.left-v.left,top:b.top-v.top,right:b.right-v.left,bottom:b.bottom-v.top,w:v.width,h:v.height};}));
  check(key+' stop labels inside viewport',labels.every(a=>a.left>=0&&a.top>=0&&a.right<=a.w+1&&a.bottom<=a.h+1));
  if(lang==='uk'&&[320,390,768,1440].includes(width))await shot(`zakarpattia-route-${width}`);
  await select(3);check(key+' welcome photo only at final point',await photo.isVisible()&&await root.getAttribute('data-arrival')==='true');
  check(key+' exact original welcome file',await photo.getAttribute('src')==='/assets/photos/welcome-gate-1600.webp');
  check(key+' full uncropped original proportion',await photo.evaluate(e=>{const r=e.getBoundingClientRect();return e.complete&&e.naturalWidth===1600&&e.naturalHeight===1068&&Math.abs(r.width/r.height-1600/1068)<.02&&getComputedStyle(e).objectFit==='contain'&&r.width>=200;}));
  check(key+' no horizontal overflow on arrival',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  if(lang==='uk'&&[320,390,768,1440].includes(width))await shot(`kybliary-welcome-${width}`);
  await select(4);check(key+' no extra right photo in 3D mode',!await photo.isVisible());check(key+' documentary 3D retained',await root.getAttribute('data-blend')==='1.0000'&&await root.locator('[data-scene-tools]').isVisible());
  await select(0);check(key+' photo hides when returning to globe',!await photo.isVisible());
 }
 await p.setViewportSize({width:1440,height:1200});await p.goto('http://127.0.0.1:4173/uk/');await select(0);await p.emulateMedia({reducedMotion:'no-preference'});
 await p.evaluate(()=>{window.__routeTrace=[];const root=document.querySelector('[data-journey-map]');new MutationObserver(()=>window.__routeTrace.push({time:performance.now(),stage:root.dataset.stage,roads:+root.dataset.roadAlpha,route:+root.dataset.routeProgress,arrival:root.dataset.arrival,scene:root.dataset.sceneId,camera:root.dataset.cameraId})).observe(root,{attributes:true,attributeFilter:['data-draw-count']});});
 await p.locator('[data-journey-play]').click();await p.waitForFunction(()=>+document.querySelector('[data-journey-map]').dataset.routeProgress>.12,null,{timeout:20000});await p.locator('[data-journey-pause]').click();const progress=await root.getAttribute('data-route-progress');await p.waitForTimeout(200);check('pause freezes route drawing',await root.getAttribute('data-route-progress')===progress);await p.locator('[data-journey-play]').click();await done();
 check('cinematic journey ends at welcome photograph',await root.getAttribute('data-stage')==='3'&&await photo.isVisible());const trace=await p.evaluate(()=>window.__routeTrace);report.trace=trace;
 check('one persistent camera and scene during road phases',new Set(trace.map(x=>x.camera)).size===1&&new Set(trace.map(x=>x.scene)).size===1);
 check('roads appear before route',trace.some(x=>x.roads>0&&x.route===0));check('route draws over time',trace.some(x=>x.route>0&&x.route<1));check('welcome waits for camera arrival',trace.filter(x=>x.stage==='2').every(x=>x.arrival==='false'));
 const sequence=trace.filter(x=>x.stage==='2');check('route progress never reverses during drawing',sequence.every((x,i)=>!i||x.route>=sequence[i-1].route));
 await p.locator('[data-journey-step="2"]').click();check('photo hides immediately on new trip',!await photo.isVisible());await p.waitForFunction(()=>{const d=document.querySelector('[data-journey-map]').dataset;return +d.routeProgress>.05&&+d.routeProgress<.95;},null,{timeout:15000});
 await p.locator('[data-journey-step="1"]').click();await done();await p.waitForTimeout(350);check('selecting another stage cancels route callbacks',await root.getAttribute('data-stage')==='1'&&await root.getAttribute('data-state')==='complete'&&!await photo.isVisible());
 await p.locator('[data-journey-step="2"]').click();await p.waitForFunction(()=>{const d=document.querySelector('[data-journey-map]').dataset;return +d.routeProgress>.05&&+d.routeProgress<.95;},null,{timeout:15000});await p.emulateMedia({reducedMotion:'reduce'});await done();check('changing reduced motion stops active route animation',await root.getAttribute('data-route-progress')==='1.0000');await select(2);check('reduced motion shows static complete route',await root.getAttribute('data-route-progress')==='1.0000'&&await root.getAttribute('data-transition-duration')==='0');
 check('no external runtime map API requests',report.runtimeMapRequests.length===0);check('no JavaScript errors',report.errors.length===0);report.result='PASS';
}catch(e){report.result='FAIL';report.failure=e.message;throw e;}finally{fs.writeFileSync(`${out}/functional.json`,JSON.stringify(report,null,2));console.log(JSON.stringify({result:report.result,checks:report.checks.length,errors:report.errors,failure:report.failure,traceSamples:report.trace?.length},null,2));await b.close();}
