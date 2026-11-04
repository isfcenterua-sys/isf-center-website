from pathlib import Path
import json,shutil,html
base=Path(__file__).parent.resolve();site=base/'site';qa=base/'qa-route-preview';dest=site/'DOCUMENTATION/ROUTE_WELCOME_PREVIEW_2026-11-04'
read=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
result=read(qa/'functional.json');assert result['result']=='PASS'
for name in ['QA','SCREENS','TOOLS','SOURCE_DATA']:(dest/name).mkdir(parents=True,exist_ok=True)
for p in qa.glob('*.json'):shutil.copy2(p,dest/'QA'/p.name)
for p in qa.iterdir():
 if p.suffix in ['.png','.webm']:shutil.copy2(p,dest/'SCREENS'/p.name)
for name in ['route-qa.mjs','route-video.mjs','prepare-route-data.py','finish_route_review.py']:shutil.copy2(base/name,dest/'TOOLS'/name)
for p in (base/'route-source-data').iterdir():shutil.copy2(p,dest/'SOURCE_DATA'/p.name)
report=f'''# ISF — дороги Закарпатья и встреча в конце пути

4 ноября 2026. **Локальный черновик, не опубликован.** Ветка `draft/cinematic-photo-scene-2026-11-04`. Production остаётся на ранее опубликованном `0136bc0ab10f1c7a78024e8128249290bdb75025`.

[Локальный предпросмотр](http://127.0.0.1:4173/uk/#visit-community) · [English](http://127.0.0.1:4173/en/#visit-community) · [Скриншоты и видео](REVIEW.html).

## Результат

В существующей WebGL-сцене сохранена одна камера и один canvas. Земля → Украина → контур Закарпатья; затем мягко проявляются дороги, камера приближается к коридору маршрута, линия последовательно проходит **Мукачево → Середнє → Кибляри**. В конце камера останавливается у Кибляр и появляется оригинальная фотография встречи с подписью «Тут вас зустрічають у молитві, тиші та братній гостинності».

По последнему уточнению владельца **отдельные фотографии справа во время карты и выбора 3D-объектов убраны**. Единственная боковая фотография — встреча у ворот, только на завершённом этапе «Кибляри». При выборе другого этапа она скрывается сразу. На телефоне та же карточка находится под картой. Три настоящие фотографии остаются в пространстве документальной 3D-экспозиции; дополнительного дублирования в правой панели нет.

Автоматическое путешествие заканчивается тёплой встречей в Киблярах. Следующий пятый режим «3D-сцена» доступен отдельной кнопкой. В нём сохранены общий вид, храм, подворье, совместная жизнь, плавное прерывание переходов из текущей позы, мышь, колесо, один палец, pinch, клавиатура и ручной возврат к общему виду. Это документальная фотоэкспозиция, а не реконструкция зданий; размеры и геометрия участка не выдумывались.

## Откуда взяты дороги и маршрут

- Дороги: официальный [Overpass API](https://overpass-api.de/), регион OSM `ISO3166-2=UA-21`, motorway/trunk/primary и отобранные secondary западного коридора. Снимок OSM **2026-11-04 07:14:04 UTC**. В локальном ресурсе 1771 фрагмент дорог / 4144 точки. Сеть упрощена для небольшого веса, без случайно нарисованных линий.
- Мукачево и Середнє: [Nominatim Search](https://nominatim.org/release-docs/latest/api/Search/), OSM relation 2283083 и 5738567. Исходные ответы и точные URL сохранены в SOURCE_DATA.
- Полная геометрия проезда: [OSRM Route service](https://project-osrm.org/docs/v5.24.0/api/#route-service), обязательная промежуточная точка Середнє. **538 точек / 31 554 м**. Запрос, ответ, дорожная геометрия, порядок точек и SHA-256 находятся в SOURCE_DATA, `content/route-provenance.json` и `assets/maps/zakarpattia-route.json`.
- Точная позначка обители не менялась: **48.606734, 22.5548433**, из существующего `content/location.json`. OSRM заканчивает дорожный сегмент примерно в **25,15 м** от этой точки. Короткий пунктир обозначает только соединение с позначкой, **не подтверждённую дорожку до ворот**. Это объяснено в интерфейсе. Маршрут — снимок для ориентации; для актуальной навигации оставлена прежняя ссылка Google Maps.
- [OpenStreetMap contributors / ODbL](https://www.openstreetmap.org/copyright): видимая атрибуция добавлена под картой, лицензия и происхождение сохранены в данных. При использовании страницы браузер не запрашивает Overpass, Nominatim или OSRM: ресурсы уже локальные, ключей и платных сервисов нет.

## Фото встречи

Использован ровно `C:/Users/igor/Desktop/welcome-gate-1600.webp`, 1600×1068, 245 566 байт. Файл уже был в проекте и повторно проверен относительно приложенного оригинала. Без ретуши, изменения цветов, дорисовки или обрезки; `object-fit: contain`, сохранены все три человека и ворота.

SHA-256: `9b55db46a57f293227c18253f16acba082ce0231726f83700ddbb1af7c413852`.

## Проверки

**{len(result['checks'])} PASS** в отдельной проверке нового маршрута, UA/EN, ширины **320, 360, 390, 430, 768 и 1440 px**. Проверены отсутствие горизонтального переполнения, видимость всех трёх названий на этапе маршрута, отсутствие раннего/дублирующего фото, появление полного оригинала только после прибытия, сохранение 3D-режима, последовательность roads → route → arrival, пауза, отмена прежних callback при новом выборе, статичный reduced-motion и переключение этой настройки во время анимации. Ошибок JavaScript: **0**. В трассе нового сценария {len(result['trace'])} состояний, камера и сцена сохраняли UUID.

Дополнительно обновлённый сценарий кинематографической сцены: **341 PASS**, шесть ширин и обе языковые версии; мышь, wheel, touch/pinch, клавиатура, центрирование и видимость фотообъектов, быстрые переключения, пауза, отсутствие самовозврата, resize, low-power, аварийный режим без WebGL. Axe A/AA — 0 выявленных нарушений на 320/768/1440 px. Это Chrome/Playwright на этом компьютере и сенсорная эмуляция; физические iPhone/Android не заявляются проверенными.

Сборка, check, faith, refinement, icons, map-prototype, cinematic-scene и route — PASS. 40 двуязычных страниц + служебные HTML, 48 согласованных фото, 45 карточек галереи сохранены. Утверждённые шапка, главная фотография, фото руководства и Coverflow не редактировались. Подтверждены HTTP 200 `/uk/`, `/en/`, `/uk/calendar/`, `/uk/prayer/`. Сервер слушает только **127.0.0.1:4173**, публичный доступ не открывался.

## Основные файлы

- `assets/cinematic-scene.js`: камера, реальные дорожные линии, проекция маршрута, последовательное проявление, конечное состояние фото, управление.
- `assets/journey-route.css`: маршрут, подписи, тёплая карточка встречи, мобильное оформление и reduced-motion.
- `assets/maps/zakarpattia-route.json`, `content/route-provenance.json`: локальные данные и проверяемое происхождение.
- `scripts/editorial-draft.mjs`, `scripts/build.mjs`: общий шаблон обеих языковых версий и подключение ресурсов.
- `scripts/check-route.mjs`: целостность данных/фото, порядок точек, длина маршрута, отсутствие выдуманного дорожного соединения, наличие ресурсов в dist.
- Базовые файлы настоящей WebGL-сцены описаны в соседнем `CINEMATIC_SCENE_PREVIEW_2026-11-04`.
- `dist/` — новая локальная сборка. GitHub push и Cloudflare deploy этой версии **не выполнялись**.

Для запуска из корня сайта: `node scripts/build.mjs`, затем `node scripts/serve.mjs`. npm install для сборки не нужен. Откройте локальную главную и нажмите «Почати подорож».

**Готово к просмотру. Публикация — только после отдельного подтверждения владельца.**
'''
(dest/'REPORT.md').write_text(report,encoding='utf-8')
items=''.join(f'<a href="SCREENS/{p.name}"><img loading="lazy" src="SCREENS/{p.name}" alt="{html.escape(p.stem)}"><span>{html.escape(p.stem)}</span></a>' for p in sorted((dest/'SCREENS').glob('*.png')))
(dest/'REVIEW.html').write_text('''<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ISF — маршрут и встреча, локальный черновик</title><style>body{margin:0;background:#f7f3e9;color:#183d2d;font:16px/1.7 system-ui}header,section{max-width:1200px;margin:auto;padding:24px}h1,h2{font-family:Georgia;font-weight:normal;line-height:1.2}a{color:inherit}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:24px}main a{border:1px solid #b6a78266;border-radius:8px;background:#fffdf8;text-decoration:none;overflow:hidden}img{width:100%;height:390px;object-fit:contain}span{display:block;padding:12px}video{width:100%;max-height:850px;background:#102b22;border-radius:8px}.status{background:#eee7d8;padding:12px 16px}</style><header><p class="status">Локальный черновик — не опубликован.</p><h1>Дорогами Закарпатья — к встрече у ворот</h1><p><a href="http://127.0.0.1:4173/uk/#visit-community">Локальный предпросмотр</a> · <a href="REPORT.md">Полный отчёт</a></p><p>Фото встречи появляется только в конце дороги. Дополнительные фотографии в боковой карточке карты убраны.</p></header><section><h2>Запись путешествия и 3D-управления</h2><video controls preload="metadata" src="SCREENS/route-and-welcome.webm" poster="SCREENS/kybliary-welcome-1440.png"></video></section><section><h2>Маршрут и финальная точка</h2><main>'''+items+'</main></section></html>',encoding='utf-8')
print(dest/'REPORT.md')
