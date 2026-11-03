import assert from 'node:assert/strict';
import fs from 'node:fs';
import {daysInMonth,oldStyle,dayInfo,iso,holidays} from '../assets/calendar-data.js';
import {kathismata,faithSlugs} from './faith-pages.mjs';
const date=s=>new Date(s+'T00:00:00Z');
assert.equal(iso(oldStyle(date('2027-01-01'))),'2026-12-19');
assert.equal(iso(oldStyle(date('2027-03-01'))),'2027-02-16');
assert.equal(iso(oldStyle(date('2027-05-02'))),'2027-04-19');
assert.equal(iso(oldStyle(date('2027-12-31'))),'2027-12-18');
assert.deepEqual(Array.from({length:12},(_,m)=>daysInMonth(m)),[31,28,31,30,31,30,31,31,30,31,30,31]);
assert.match(dayInfo(date('2027-05-02')).feast,/Пасха/);
assert.equal((date('2027-06-10')-date('2027-05-02'))/86400000,39);
assert.equal((date('2027-06-20')-date('2027-05-02'))/86400000,49);
assert.match(dayInfo(date('2027-01-18')).fast,/Навечір/);
assert.equal(dayInfo(date('2027-01-17')).fast,'');
for(const [first,last] of [['03-15','05-01'],['06-28','07-11'],['08-14','08-27'],['11-28','12-31']]){assert.ok(dayInfo(date('2027-'+first)).fast);assert.ok(dayInfo(date('2027-'+last)).fast);}
for(const d of ['2027-02-24','2027-03-10','2027-05-05','2027-06-23'])assert.equal(dayInfo(date(d)).fast,'');
assert.ok(dayInfo(date('2027-02-17')).fast);
assert.match(dayInfo(date('2027-04-26')).week,/Страсний/);
const all=[];for(let m=0;m<12;m++)for(let day=1;day<=daysInMonth(m);day++){const d=new Date(Date.UTC(2027,m,day));assert.equal((d-oldStyle(d))/86400000,13);all.push(iso(d));}
assert.equal(new Set(all).size,365);
assert.equal(holidays.length,18);
assert.equal(kathismata.length,20);assert.equal(kathismata[0][0],1);assert.equal(kathismata.at(-1)[1],151);for(let i=1;i<20;i++)assert.equal(kathismata[i][0],kathismata[i-1][1]+1);
for(const lang of ['uk','en']){
 for(const slug of faithSlugs)assert.ok(fs.existsSync(`dist/${lang}/${slug}/index.html`));
 const cal=fs.readFileSync(`dist/${lang}/calendar/index.html`,'utf8');assert.equal((cal.match(/data-month="/g)||[]).length,12);assert.equal((cal.match(/data-day="/g)||[]).length,365);assert.equal((cal.match(/data-calendar-date="/g)||[]).length,365);
 const ps=fs.readFileSync(`dist/${lang}/prayer/psalter/index.html`,'utf8');for(let i=2;i<=21;i++)assert.ok(ps.includes('psaltir-po-kafizmam.html#n'+i+'"'));
 const witness=fs.readFileSync(`dist/${lang}/testimonies/my-spiritual-journey/index.html`,'utf8');assert.match(witness,lang==='uk'?/поліції/:/police/);assert.match(witness,lang==='uk'?/неповнолітньою/:/minor/);
}
const photos=JSON.parse(fs.readFileSync('content/photos.json','utf8'));assert.equal(photos.length,48);assert.equal(photos.filter(p=>p.ownerSupplied2026).length,10);assert.equal(photos.filter(p=>p.editorialReviewed2026).length,38);
for(const p of photos){for(const l of ['uk','en']){assert.ok(p.title[l]);assert.ok(p.caption[l]);assert.ok(p.alt[l]);assert.notEqual(p.title[l],p.alt[l]);}}
console.log(JSON.stringify({result:'PASS',calendarDates:365,months:12,verifiedMajorFeasts:18,kathismata:20,reviewedPhotoTexts:48,newBilingualRoutes:16},null,2));
