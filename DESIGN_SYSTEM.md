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
