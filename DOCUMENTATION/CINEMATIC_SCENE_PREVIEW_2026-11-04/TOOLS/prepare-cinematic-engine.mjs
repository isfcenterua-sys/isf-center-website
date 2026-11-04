import fs from 'node:fs';import {build} from './draft-map-tools/node_modules/esbuild/lib/main.js';
const names='Scene,PerspectiveCamera,WebGLRenderer,Group,Mesh,MeshBasicMaterial,MeshPhongMaterial,SphereGeometry,CanvasTexture,SRGBColorSpace,Color,Vector3,Quaternion,Matrix4,PlaneGeometry,BoxGeometry,CircleGeometry,Float32BufferAttribute,BufferGeometry,LineLoop,LineSegments,LineBasicMaterial,DoubleSide,MathUtils,ShapeUtils,Raycaster,Vector2,AmbientLight,DirectionalLight,TextureLoader,NoToneMapping';
fs.writeFileSync('draft-map-tools/cinematic-entry.js',`export {${names}} from 'three';export {geoEquirectangular,geoPath,geoCentroid} from 'd3-geo';`);
await build({entryPoints:['draft-map-tools/cinematic-entry.js'],outfile:'site/assets/maps/cinematic-engine.js',bundle:true,minify:true,format:'esm',target:['es2020'],legalComments:'inline'});
fs.writeFileSync('site/assets/maps/THREE-LICENSE.txt',fs.readFileSync('draft-map-tools/node_modules/three/LICENSE'));
console.log(fs.statSync('site/assets/maps/cinematic-engine.js').size);
