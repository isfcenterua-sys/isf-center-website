from pathlib import Path
import json,hashlib,math,datetime,shutil,gzip
base=Path(__file__).parent.resolve();raw=base/'route-source-data';assets=base/'site/assets/maps';photos=base/'site/assets/photos'
read=lambda p:json.loads(p.read_text(encoding='utf-8'));osm=read(raw/'roads-osm-overpass.json');routing=read(raw/'route-osrm.json');route=routing['response']['routes'][0];coords=route['geometry']['coordinates'];loc=read(base/'site/content/location.json')
def distance(p,a,b):
 dx=b[0]-a[0];dy=b[1]-a[1]
 if not dx and not dy:return math.hypot(p[0]-a[0],p[1]-a[1])
 t=max(0,min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy)));return math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy)
def simplify(p,tolerance=.00065):
 if len(p)<=2:return p
 index,value=max(((i,distance(p[i],p[0],p[-1])) for i in range(1,len(p)-1)),key=lambda x:x[1])
 return simplify(p[:index+1],tolerance)[:-1]+simplify(p[index:],tolerance) if value>tolerance else [p[0],p[-1]]
roads={'major':[],'primary':[],'secondary':[]};ids=[]
for way in osm['response']['elements']:
 points=[[n['lon'],n['lat']] for n in way.get('geometry',[])];kind=way.get('tags',{}).get('highway')
 if len(points)<2:continue
 if kind=='secondary' and not any(22.34<=p[0]<=22.88 and 48.29<=p[1]<=48.77 for p in points):continue
 category='major' if kind in ['motorway','trunk'] else kind
 if category not in roads:continue
 roads[category].append([[round(v,5) for v in p] for p in simplify(points)]);ids.append(way['id'])
def meters(a,b):
 la1,la2=math.radians(a[1]),math.radians(b[1]);dlat=la2-la1;dlon=math.radians(b[0]-a[0]);return 6371000*2*math.asin(min(1,math.sqrt(math.sin(dlat/2)**2+math.cos(la1)*math.cos(la2)*math.sin(dlon/2)**2)))
lengths=[0]
for a,b in zip(coords,coords[1:]):lengths.append(lengths[-1]+meters(a,b))
waypoints=routing['response']['waypoints'];via=min(range(len(coords)),key=lambda i:meters(coords[i],waypoints[1]['location']))
stops=[{'id':'mukachevo','uk':'Мукачево','en':'Mukachevo','coordinate':waypoints[0]['location'],'progress':0},{'id':'serednie','uk':'Середнє','en':'Serednie','coordinate':waypoints[1]['location'],'progress':lengths[via]/lengths[-1]},{'id':'kybliary','uk':'Кибляри','en':'Kybliary','coordinate':[loc['longitude'],loc['latitude']],'progress':1}]
data={'roads':roads,'route':{'coordinates':coords,'cumulativeMeters':[round(x,3) for x in lengths],'distanceMeters':route['distance'],'stops':stops,'snappedDestination':waypoints[2]['location'],'destinationSnapDistanceMeters':waypoints[2]['distance'],'connectorIsRoad':False},'provenance':{'preparedUTC':datetime.datetime.now(datetime.timezone.utc).isoformat(),'roadProvider':osm['url'],'query':osm['query'],'osmTimestamp':osm['response']['osm3s']['timestamp_osm_base'],'routingProvider':routing['url'],'geocoderURLs':[read(raw/(n+'.json'))['url'] for n in ['mukachevo','serednie']],'roadLicense':'OpenStreetMap contributors, ODbL 1.0','copyright':'https://www.openstreetmap.org/copyright','selectedOSMWays':ids,'roadSimplificationDegrees':.00065,'description':'Road snapshot for visual orientation, not live navigation. Final short connector joins the snapped road to the existing monastery marker; it is not claimed to be a mapped road.'}}
asset=assets/'zakarpattia-route.json';asset.write_text(json.dumps(data,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
photo=Path(r'C:\Users\igor\Desktop\welcome-gate-1600.webp');assert photo.is_file();target=photos/photo.name
if not target.exists() or hashlib.sha256(target.read_bytes()).digest()!=hashlib.sha256(photo.read_bytes()).digest():shutil.copy2(photo,target)
assert target.read_bytes()==photo.read_bytes()
metadata={'routeAsset':asset.relative_to(base/'site').as_posix(),'sha256':hashlib.sha256(asset.read_bytes()).hexdigest(),'bytes':asset.stat().st_size,'gzipBytes':len(gzip.compress(asset.read_bytes())),'roadWays':sum(len(x) for x in roads.values()),'roadPoints':sum(len(line) for x in roads.values() for line in x),'routePoints':len(coords),'routeDistanceMeters':route['distance'],'stops':stops,'destinationSnapDistanceMeters':waypoints[2]['distance'],'welcomePhoto':{'file':target.relative_to(base/'site').as_posix(),'originalFile':str(photo),'bytes':target.stat().st_size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'unmodified':True},'sourceFiles':[{'file':p.name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in raw.iterdir()]}
(base/'site/content/route-provenance.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print(json.dumps(metadata,ensure_ascii=False,indent=2))
