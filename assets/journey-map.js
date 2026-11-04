// A user-controlled, one-shot orthographic globe. Engine/data load only on demand.
const root=document.querySelector('[data-journey-map]');
const archive=document.querySelector('.editorial-archive');
if(archive){const reveal=()=>{let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}const target=document.getElementById(id);if(target&&archive.contains(target)){archive.open=true;requestAnimationFrame(()=>target.scrollIntoView({block:'start',behavior:'auto'}));}};addEventListener('hashchange',reveal);reveal();}
if(root){
 const uk=root.dataset.language==='uk',reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const labels=uk?['Земля','Україна','Закарпаття','Кибляри']:['Earth','Ukraine','Zakarpattia','Kybliary'];
 const captions=uk?['Наш спільний дім. Подорож починається звідси.','Країна, частиною якої є наше спільне життя.','Захід України. Карпатський край, де живе наша громада.','Киблярська обитель. Місце молитви, спілкування та взаємної турботи.']:['Our shared home. The journey begins here.','The country in which our shared life has its home.','Western Ukraine. The Carpathian region our community calls home.','Kybliary community. A place of prayer, conversation and mutual care.'];
 const point=[Number(root.dataset.longitude),Number(root.dataset.latitude)],viewport=root.querySelector('.journey-viewport'),canvas=root.querySelector('canvas'),poster=root.querySelector('.journey-poster'),marker=root.querySelector('[data-journey-marker]');
 const play=root.querySelector('[data-journey-play]'),pauseButton=root.querySelector('[data-journey-pause]'),stepButtons=[...root.querySelectorAll('[data-journey-step]')],feedback=root.querySelector('[data-journey-feedback]');
 let geo,data,context,cameras,camera,loadPromise,width=0,height=0,frame=0,stage=0,animation=null,playing=false,drawCount=0;
 const word=(a,b)=>uk?a:b,playLabel=()=>playing?word('Подорож триває','Journey in progress'):animation?word('Продовжити','Continue'):stage===3?word('Повторити подорож','Replay journey'):word('Почати подорож','Begin the journey');
 function controls(){root.dataset.state=playing?'playing':animation?'paused':stage===3?'complete':'ready';play.firstChild.textContent=playLabel();play.disabled=playing;pauseButton.hidden=!playing;}
 function setStage(index,announce=false){stage=index;root.dataset.stage=String(index);root.querySelector('[data-journey-number]').textContent=`0${index+1} / 04`;root.querySelector('[data-journey-title]').textContent=labels[index];root.querySelector('[data-journey-caption]').textContent=captions[index];for(const b of stepButtons){if(+b.dataset.journeyStep===index)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');}if(announce)feedback.textContent=labels[index]+'. '+captions[index];}
 function fit(feature){const center=geo.geoCentroid(feature),projection=geo.geoOrthographic().rotate([-center[0],-center[1]]).fitExtent([[width*.1,height*.12],[width*.9,height*.88]],feature);return {lon:center[0],lat:center[1],scale:projection.scale()};}
 function measure(){const r=viewport.getBoundingClientRect(),w=Math.round(r.width),h=Math.round(r.height);if(!w||!h||w===width&&h===height)return;width=w;height=h;const ratio=Math.min(devicePixelRatio||1,1.75);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);context.setTransform(ratio,0,0,ratio,0,0);const region=fit(data.region);cameras=[{lon:12,lat:25,scale:Math.min(width*.4,height*.43)},fit(data.ukraine),region,{lon:point[0],lat:point[1],scale:region.scale*1.65}];stop(false);camera={...cameras[stage]};draw();}
 function draw(){if(!context||!camera||!width)return;drawCount++;root.dataset.drawCount=String(drawCount);context.clearRect(0,0,width,height);const projection=geo.geoOrthographic().rotate([-camera.lon,-camera.lat]).translate([width/2,height/2]).scale(camera.scale).clipExtent([[0,0],[width,height]]).precision(.65),path=geo.geoPath(projection,context);
  const paint=(object,fill,stroke,line=1)=>{context.beginPath();path(object);if(fill){context.fillStyle=fill;context.fill();}if(stroke){context.strokeStyle=stroke;context.lineWidth=line;context.stroke();}};
  const ocean=context.createRadialGradient(width*.35,height*.25,0,width*.5,height*.5,Math.max(width,height)*.7);ocean.addColorStop(0,'#284e40');ocean.addColorStop(1,'#0d291f');paint({type:'Sphere'},ocean,'#b6a87588',.8);
  if(camera.scale>12000){context.fillStyle='#597360';context.fillRect(0,0,width,height);}else paint(data.land,'#597360','#bcc39a66',.5);
  if(camera.scale<1400)paint(geo.geoGraticule10(),null,'#c9c09b20',.6);
  paint(data.ukraine,'#b4ab71','#e1c584',1);
  if(camera.scale>800)paint(data.region,'#e0cf9c','#faf1d1',1.3);
  if(camera.scale<Math.min(width,height)){
   context.beginPath();context.arc(width/2,height/2,camera.scale+8,0,Math.PI*2);context.strokeStyle='#b6a87522';context.lineWidth=.8;context.stroke();
  }
  if(camera.scale<Math.min(width,height)){const shade=context.createRadialGradient(width/2-camera.scale*.3,height/2-camera.scale*.3,camera.scale*.25,width/2,height/2,camera.scale);shade.addColorStop(0,'#061b1300');shade.addColorStop(.7,'#061b1300');shade.addColorStop(1,'#061b1380');paint({type:'Sphere'},shade,null);}
  const front=geo.geoDistance([camera.lon,camera.lat],point)<Math.PI/2,xy=projection(point),visible=front&&xy&&xy[0]>12&&xy[0]<width-12&&xy[1]>12&&xy[1]<height-12;
  if(visible){const [x,y]=xy;context.beginPath();context.arc(x,y,15,0,Math.PI*2);context.fillStyle='#f3df9d22';context.fill();context.beginPath();context.arc(x,y,8,0,Math.PI*2);context.strokeStyle='#f3df9d99';context.lineWidth=1;context.stroke();context.beginPath();context.arc(x,y,4,0,Math.PI*2);context.fillStyle='#fff0bd';context.fill();
   marker.hidden=stage<2;marker.style.left=Math.max(12,Math.min(width-195,x+16))+'px';marker.style.top=Math.max(12,Math.min(height-58,y-42))+'px';root.dataset.markerX=x.toFixed(2);root.dataset.markerY=y.toFixed(2);
  }else marker.hidden=true;
 }
 function stop(keep=true){cancelAnimationFrame(frame);frame=0;playing=false;if(!keep)animation=null;controls();}
 function tick(time){if(!playing||!animation)return;const a=animation;if(a.started===null)a.started=time-a.elapsed;const t=Math.min(1,(time-a.started)/a.duration);a.elapsed=time-a.started;const ease=t<.5?4*t*t*t:1-(-2*t+2)**3;
  camera={lon:a.from.lon+(a.to.lon-a.from.lon)*ease,lat:a.from.lat+(a.to.lat-a.from.lat)*ease,scale:Math.exp(Math.log(a.from.scale)+(Math.log(a.to.scale)-Math.log(a.from.scale))*ease)};draw();
  if(t<1){frame=requestAnimationFrame(tick);return;}
  setStage(a.index,true);camera={...a.to};draw();const next=a.next;animation=null;playing=false;if(next.length){const target=next.shift();begin(target.index,target.duration,next);}else controls();
 }
 function begin(index,duration,next=[]){cancelAnimationFrame(frame);if(reduced.matches){setStage(index,true);camera={...cameras[index]};animation=null;playing=false;draw();controls();return;}animation={from:{...camera},to:{...cameras[index]},index,duration,elapsed:0,started:null,next};playing=true;controls();frame=requestAnimationFrame(tick);}
 async function ensure(){if(geo)return;if(loadPromise)return loadPromise;root.setAttribute('aria-busy','true');feedback.textContent=word('Завантаження карти…','Loading the map…');
  loadPromise=(async()=>{const engineURL=new URL(root.dataset.engine,location.href),geometryURL=new URL(root.dataset.geometry,location.href);if(engineURL.origin!==location.origin||geometryURL.origin!==location.origin)throw Error('Unexpected map source');const [engine,response]=await Promise.all([import(engineURL.href),fetch(geometryURL.href,{credentials:'omit'})]);if(!response.ok)throw Error('Map data unavailable');const geometry=await response.json();if(!geometry.land||!geometry.ukraine||!geometry.region)throw Error('Invalid map geometry');const ctx=canvas.getContext('2d');if(!ctx)throw Error('Canvas not supported');geo=engine;data=geometry;context=ctx;canvas.hidden=false;poster.hidden=true;measure();feedback.textContent='';root.dataset.loaded='true';new ResizeObserver(measure).observe(viewport);})().catch(error=>{loadPromise=null;geo=null;canvas.hidden=true;poster.hidden=false;feedback.textContent=word('Карта поки недоступна. Спробуйте ще раз або відкрийте Google Maps.','The map is unavailable. Try again or open Google Maps.');root.dataset.state='error';throw error;}).finally(()=>root.removeAttribute('aria-busy'));
  return loadPromise;
 }
 play.addEventListener('click',async()=>{try{await ensure();if(animation){animation.started=null;playing=true;controls();frame=requestAnimationFrame(tick);return;}if(reduced.matches){setStage(3,true);camera={...cameras[3]};draw();controls();return;}setStage(0);camera={...cameras[0]};draw();begin(1,2300,[{index:1,duration:650},{index:2,duration:2400},{index:2,duration:650},{index:3,duration:2200}]);}catch{play.disabled=false;}});
 pauseButton.addEventListener('click',()=>stop());
 for(const b of stepButtons)b.addEventListener('click',async()=>{try{await ensure();stop(false);begin(+b.dataset.journeyStep,1000);}catch{play.disabled=false;}});
 reduced.addEventListener('change',()=>{if(geo){stop(false);camera={...cameras[stage]};draw();}});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&playing)stop();});
 new IntersectionObserver(entries=>{if(!entries[0].isIntersecting&&playing)stop();},{threshold:0}).observe(root);
 root.querySelector('[data-journey-controls]').hidden=false;root.querySelector('[data-journey-steps]').hidden=false;
 controls();
}
