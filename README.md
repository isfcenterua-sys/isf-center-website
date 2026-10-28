# ISF website · Українська / English

Independent static website based on the supplied NAU reference. ISF is deliberately not expanded. Ukrainian is the default language; every page has a matching English URL.

## Build and preview

Node.js 20 or newer is sufficient. No npm installation or external service is required.

```text
node scripts/build.mjs
node scripts/check.mjs
node scripts/serve.mjs
```

Open `http://127.0.0.1:4173/uk/` or `/en/`. Stop the server with Ctrl+C.

## Cloudflare Pages

- Repository: `isfcenterua-sys/isf-center-website`
- Production branch: `main`
- Framework preset: None
- Build command: `node scripts/build.mjs`
- Build output directory: `dist`
- Root directory: repository root
- Deployment configuration: `wrangler.toml`

The verified, generated `dist` directory is also committed, so the first deployment works with an existing blank build command. The Wrangler file declares `dist` as the published directory. The recommended build command above regenerates it automatically; alternatively run the build locally before every push and commit the updated `dist`. No change to the NAU Cloudflare configuration is involved.

The generated `dist` folder is the only publication directory. Private reports, legal document photographs, RAW originals and source registers must remain outside the repository and `dist`. The project does not use the Sites hosting service and does not modify the NAU project.

## Edit content

- `content/site.json`: confirmed organisation facts and public contact fields. Keep unknown fields empty.
- `content/translations.json`: complete Ukrainian and English interface and page copy.
- `content/photos.json`: public photograph metadata, descriptive alt text and optional approved captions. Public copies are in `assets/photos/`.
- `content/people.json`: the three identities and titles supplied by the owner. Other portraits use neutral filenames and no invented names.
- `content/news.json`: append verified bilingual news records following `content/news-template.json`. Set `published` to `true` only when both languages, date and content are ready. Each record generates both a listing and an individual article URL.
- `assets/style.css`: responsive layout, colour palette and typography.
- `assets/app.js`: mobile navigation, gallery filters and accessible photo viewer.

All page text is rendered as static HTML, including titles, descriptions, canonical and alternate-language links. The language link preserves the current page or article. Root `/` redirects to `/uk/`. No visitor analytics, cookies, external fonts, embedded maps or contact form are configured.

## Photographs and captions

The owner completed the source selection on 28 October 2026. All 130 remaining photographs were visually reviewed. Eighteen photographs were selected, including one individual image for each of seven distinct people. Three people were identified by the owner through source filenames; four retain neutral `portrait-person-*` names. Shared photographs represent the community, as confirmed by the owner.

For the public copies, the full-resolution in-camera JPEG embedded in each NEF is used to retain the photographer's exposure and colours. Copies are oriented, lightly adjusted (contrast ×1.02, colour ×1.01), resized and encoded as WebP at quality 84 with EXIF removed. Individual portrait card images use a 3:4 crop; enlarged 1600px images retain the full composition. Originals, source paths, SHA-256 hashes, individual person groups and pending captions remain in the private source register outside this repository.

Each approved photograph requires stable `id`, `category`, dimensions, `alt.uk`, `alt.en`, `publicationStatus: "approved"` and `publish: true`. A photograph with pending publication status is excluded from generated pages. Final captions are optional and must remain blank pending the owner's approval. Alt text describes visible content and is separate from a caption.

## Reference reuse

Retains the NAU static architecture, green/cream/sage palette, local fonts, editorial image/text layouts, mobile navigation principles, reduced-motion support and native dialog approach. Uses independent code and content; no NAU photographs, emblem, organisation contacts, claims or news are reused. Local fonts retain their accompanying OFL licence files.
