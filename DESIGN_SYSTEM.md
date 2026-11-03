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
