// Factual dates checked against the two cited annual calendars on 2026-11-03.
// Civil Gregorian dates; fixed observances follow the Julian calendar.
export const YEAR=2027;
export const calendarSources=['https://akafistnik.ru/days/2027','https://azbyka.ru/days/calendar/2027','https://www.rop.ru/d/3000/d/svyataya_lubov_kalendar_2027_block.pdf'];
export const holidays=[
 ['01-07','Різдво Христове','Nativity of Christ'],
 ['01-14','Обрізання Господнє','Circumcision of the Lord'],
 ['01-19','Богоявлення. Хрещення Господнє','Theophany. Baptism of the Lord'],
 ['02-15','Стрітення Господнє','Meeting of the Lord'],
 ['04-07','Благовіщення Пресвятої Богородиці','Annunciation'],
 ['04-25','Вхід Господній до Єрусалима','Palm Sunday'],
 ['05-02','Світле Христове Воскресіння. Пасха','Resurrection of Christ. Pascha'],
 ['06-10','Вознесіння Господнє','Ascension'],
 ['06-20','День Святої Трійці. П’ятидесятниця','Holy Trinity. Pentecost'],
 ['07-07','Різдво Іоана Предтечі','Nativity of John the Baptist'],
 ['07-12','Апостолів Петра і Павла','Apostles Peter and Paul'],
 ['08-19','Преображення Господнє','Transfiguration'],
 ['08-28','Успіння Пресвятої Богородиці','Dormition of the Mother of God'],
 ['09-11','Усікновення глави Іоана Предтечі','Beheading of John the Baptist'],
 ['09-21','Різдво Пресвятої Богородиці','Nativity of the Mother of God'],
 ['09-27','Воздвиження Хреста Господнього','Exaltation of the Cross'],
 ['10-14','Покров Пресвятої Богородиці','Protection of the Mother of God'],
 ['12-04','Введення у храм Пресвятої Богородиці','Entry of the Mother of God into the Temple']
];
const periods=[
 ['01-01','01-06','Різдвяний піст','Nativity Fast'],
 ['03-15','05-01','Великий піст і Страсний тиждень','Great Lent and Holy Week'],
 ['06-28','07-11','Апостольський піст','Apostles’ Fast'],
 ['08-14','08-27','Успенський піст','Dormition Fast'],
 ['11-28','12-31','Різдвяний піст','Nativity Fast']
];
const weeks=[
 ['01-07','01-17','Святки','Christmastide'],
 ['02-22','02-28','Седмиця після неділі митаря і фарисея','Week after the Sunday of the Publican and Pharisee'],
 ['03-08','03-14','Сирна седмиця (без м’яса)','Cheesefare Week (abstinence from meat)'],
 ['04-26','05-01','Страсний тиждень','Holy Week'],
 ['05-02','05-08','Світла седмиця','Bright Week'],
 ['06-21','06-27','Троїцька седмиця','Trinity Week']
];
export const iso=date=>date.toISOString().slice(0,10);
export const oldStyle=date=>new Date(date.getTime()-13*86400000);
export const daysInMonth=month=>new Date(Date.UTC(YEAR,month+1,0)).getUTCDate();
export function dayInfo(date,lang='uk'){
 const key=iso(date).slice(5),ix=lang==='uk'?1:2;
 const feast=holidays.find(h=>h[0]===key);
 const week=weeks.find(w=>key>=w[0]&&key<=w[1]);
 const period=periods.find(p=>key>=p[0]&&key<=p[1]);
 const oneDay=key==='01-18'?(lang==='uk'?'Навечір’я Богоявлення. Пісний день':'Eve of Theophany. Fast day'):['09-11','09-27'].includes(key)?(lang==='uk'?'Одноденний піст':'One-day fast'):'';
 const weekly=[3,5].includes(date.getUTCDay())&&!week;
 return {date:iso(date),old:iso(oldStyle(date)),sunday:date.getUTCDay()===0,feast:feast?.[ix]||'',week:week?.[ix+1]||'',fast:oneDay||period?.[ix+1]||(weekly?(lang==='uk'?'Пісний день — середа або п’ятниця':'Weekly fast — Wednesday or Friday'):''),source:`https://akafistnik.ru/days/${YEAR}/${date.getUTCMonth()+1}/${date.getUTCDate()}`};
}
