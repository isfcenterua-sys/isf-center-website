# ISF Sacred Heritage / Sacred Cinematic

The bilingual static generator and existing page content remain the source of truth.

- `scripts/header.mjs` renders one Header. The home page uses its cinematic theme; internal pages use the approved cream navigation capsule. `assets/header.js` handles dropdowns, mobile accordions, language controls, search, and the scroll state.
- `scripts/home.mjs` renders the documentary church hero, two actions, four gateways and the preserved `community-table.webp` feature. All previous home sections follow it.
- `scripts/sacred-pages.mjs` provides thematic internal covers and six spiritual-life cards with full approved story text. History, reading, art, contact and calendar covers use a lighter variant.
- `assets/approved-header.css`, `assets/sacred.css`, and `assets/cinematic.css` are included in the existing single hashed CSS bundle. They reuse the existing font, card, modal and carousel components. No UI framework is added.
- Brand green: `#183D2D`; secondary green: `#2C5340`; decorative gold: `#C29B50`; cream: `#F7F3E9`; warm white: `#FFFDF8`. Small gold-coloured text uses a darker accessible shade.
- All documentary image files and original portraits remain unchanged. Full photographs and descriptions remain accessible in the readers. The two archived room photographs remain excluded from showcases.
- Calendar data remain in `assets/calendar-data.js`: civil Gregorian dates and separately labelled Julian dates. Do not change feast dates as part of visual work.
- Search uses a generated bilingual JSON index loaded only when opened. Modified JavaScript and the stylesheet use content versions to avoid stale browser caches.

## Local preview and checks

```powershell
node scripts/build.mjs
node scripts/check.mjs
node scripts/check-faith.mjs
node scripts/check-refinement.mjs
node scripts/serve.mjs
```

The preview binds only to `127.0.0.1:4173`, compresses text resources, and survives a temporarily missing build. Cloudflare Pages continues publishing the existing `main` branch. Never force-push or replace the repository with an older archive.


## Final polish

`assets/tokens.css` is the common source for palette, spacing, radii, shadows, typography and motion. `components.css` owns the common card surface; the existing renderers retain their horizontal or vertical layouts. `footer.css` and `scripts/footer.mjs` own the three-column footer, eight navigation links, contact actions, language links and full legal name. Retired header/footer selectors were removed from earlier stylesheets rather than adding another competing header.

The home navigation uses 16px text and a compact layout through 1380px. The internal header uses a compact layout through 1280px and less vertical space. The home photograph keeps its full native 16:9 frame with a feathered edge on wide screens, and a responsive frame on phones. Gallery documentary photographs remain uncropped, while natural landscape previews may fill their shared frame.

`assets/brand/isf-mother-of-god-384.webp` remains the unmodified favicon master. `scripts/generate-site-icons.py` creates the committed PNG/ICO sizes with resampling and cream padding. `scripts/site-icons.mjs` reuses content-hash versioning and connects the icon set to every generated HTML head, including the root and 404. Root and English manifests provide 192/512px icons and a safe maskable variant. The old monogram is retained only in `archive/favicon-monogram.svg`, outside the published assets.

The generator does not require Python or image libraries to rebuild the site. Check favicon sizes, manifests and every HTML head with `node scripts/check-icons.mjs`.


## Life-section refinements (4 November 2026)

`assets/card-actions.css` owns the shared light CTA surface and category tones; `scripts/card-actions.mjs` supplies its small SVG arrow. Home gateway cards remain single native links, with a decorative action label inside rather than nested interactive controls. The Community Life intro link is a 48px outlined, softly filled action. Photograph-card controls continue opening the existing full-frame reader. Hover changes fill and shadow; arrow travel is limited to 3px and disabled for reduced motion.

The owner requested removal of the “Spiritual fellowship and shared service” card from both the gallery and the spiritual collection. `clergy-encounter` therefore has `showcase: false`; all 48 source photos and originals remain, while 45 cards appear in the gallery. The spiritual-guidance illustration remains available where it has its own different purpose. Collections filter hidden cards before choosing the two-column modifier; phones use one column.


## Approved editorial homepage and map journey

The local `draft/editorial-map-2026-11-04` branch explores an editorial directory, larger documentary features, an asymmetrical photo chronicle and a native archive of existing history/materials. All source photographs and brand assets remain unchanged. `scripts/editorial-draft.mjs` and `assets/editorial-draft.css` own this proposal, scoped to `.editorial-draft`. The approved Header and team Coverflow stay in place.

`assets/journey-map.js` manages a finite, user-triggered orthographic globe journey. Its local `d3-geo` engine and geometry load on demand. Coordinates come only from `content/location.json`; provenance, licenses and hashes are in `content/map-prototype-sources.json` and `assets/maps/NOTICE.txt`. No street/terrain dataset or third-party runtime map service is added. Reduced motion uses static steps; pause, offscreen stopping and load-error/no-JS alternatives are included. Run `node scripts/check-map-prototype.mjs` in addition to the established checks.

The owner approved publication on 4 November 2026 with “публикуй”. The draft review remains as a historical record of the approval stage. Review materials are in `DOCUMENTATION/EDITORIAL_DRAFT_2026-11-04/REVIEW.html` and `REPORT.md`.


## Cinematic photo scene — local preview only

The `draft/cinematic-photo-scene-2026-11-04` branch adds one persistent WebGL scene/camera using a local selected Three.js bundle. Geographic data and the approved location are unchanged. The final view is explicitly a documentary exhibition of three original photographs, not a reconstruction of buildings or a site plan; the owner selected this concept. All frame positions and the display plinth use dimensionless exhibition units.

`journey-cinematic.js` initializes on demand; `cinematic-scene.js` owns smootherstep spherical camera movement, quaternion interpolation, interruption from the actual current pose, auto-framing, finite manual damping, pointer/pinch/wheel and keyboard control. No auto-reset follows manual input. Reduced motion uses static views; weak profiles reduce pixel ratio/duration. The old published Canvas module remains in history/assets but is not the active homepage controller on this branch.

Run `node scripts/check-cinematic-scene.mjs` alongside existing checks. Review the recording and report in `DOCUMENTATION/CINEMATIC_SCENE_PREVIEW_2026-11-04`. Do not push this branch or deploy until the owner separately approves this new scene. Production remains at 0136bc0.

## Roads and a welcome at the end — local preview only

The cinematic draft includes a static OSM/Overpass road snapshot and a complete OSRM Mukachevo → Serednie → Kybliary route (538 coordinates, 31,554 m). Attribution is visible below the map. Provenance and original responses are in `content/route-provenance.json` and `DOCUMENTATION/ROUTE_WELCOME_PREVIEW_2026-11-04`. The final 25m dashed connector is explicitly not a verified road.

Automatic play ends at Kybliary, with the unmodified `welcome-gate-1600.webp` photograph. Per the owner's latest instruction, no separate photographs appear in the side panel at other stages or during 3D object selection. The fifth, optional stage retains the documentary 3D photo exhibition. Roads fade in, the camera approaches the corridor, the route draws, then the camera settles before the welcome card appears. Reduced-motion cancels active phases and renders statically. Run `node scripts/check-route.mjs` too. **No push or deployment without new approval.**
