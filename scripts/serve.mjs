import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {gzipSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json; charset=utf-8','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain','.png':'image/png','.ico':'image/x-icon'};
const compressed=new Map();
function responseHeaders(pathname){
 const result={};let applies=false,headers;
 try{headers=fs.readFileSync(path.join(root,'_headers'),'utf8');}catch(error){if(error.code==='ENOENT')return result;throw error;}
 for(const line of headers.split(/\r?\n/)){
  if(!line.trim())continue;
  if(!line.startsWith(' ')){applies=line==='/*'||line==='/assets/*'&&pathname.startsWith('/assets/');continue;}
  if(applies){const colon=line.indexOf(':');if(colon>0)result[line.slice(0,colon).trim()]=line.slice(colon+1).trim();}
 }
 return result;
}
const server=http.createServer((req,res)=>{
 try{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});res.end();return;}
  let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end();return;}
  const name=pathname.endsWith('/')?pathname+'index.html':pathname;
  let file=path.resolve(root,'.'+name),status=200;
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  let stat;try{stat=fs.statSync(file);}catch(error){if(error.code!=='ENOENT')throw error;}
  if(stat?.isDirectory()&&fs.existsSync(path.join(file,'index.html'))){res.writeHead(301,{Location:pathname+'/'});res.end();return;}
  if(!stat?.isFile()){file=path.join(root,'404.html');stat=fs.statSync(file);status=404;}
  const ext=path.extname(file),headers={...responseHeaders(pathname),'Content-Type':types[ext]||'application/octet-stream'};
  const text=/\.(html|css|js|json|webmanifest|svg|xml|txt)$/.test(ext),accept=req.headers['accept-encoding']||'';
  if(text)headers.Vary='Accept-Encoding';
  if(text&&/\bgzip\b/.test(accept)&&!/gzip\s*;\s*q=0(?:\.0*)?(?:,|$)/.test(accept)){
   const key=file+':'+stat.size+':'+stat.mtimeMs;
   if(!compressed.has(key)){if(compressed.size>100)compressed.clear();compressed.set(key,gzipSync(fs.readFileSync(file)));}
   const data=compressed.get(key);headers['Content-Encoding']='gzip';headers['Content-Length']=data.length;res.writeHead(status,headers);res.end(req.method==='HEAD'?undefined:data);return;
  }
  headers['Content-Length']=stat.size;res.writeHead(status,headers);
  if(req.method==='HEAD'){res.end();return;}
  const stream=fs.createReadStream(file);stream.on('error',()=>res.destroy());stream.pipe(res);
 }catch(error){
  if(!res.headersSent){res.writeHead(503,{'Content-Type':'text/plain; charset=utf-8'});res.end('Preview is rebuilding. Please reload.');}else res.destroy();
  if(error.code!=='ENOENT')console.error('Preview request failed:',error.code||error.message);
 }
});
const port=Number(process.env.PORT||4173);
server.listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}/uk/ (loopback only)`));
