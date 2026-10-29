# ISF · Українська / English

Independent static website. International name: **In Search of the Fallen**. The approved English formal name is a translation of the Ukrainian registered name, not a separate legal entity.

## Build and preview

Node.js 20 or newer; no runtime dependencies.

```text
node scripts/build.mjs
node scripts/check.mjs
node scripts/serve.mjs
```

Preview: http://127.0.0.1:4173/uk/ and /en/. Stop with Ctrl+C.

## Publication

- GitHub: isfcenterua-sys/isf-center-website, branch main.
- Cloudflare build command: node scripts/build.mjs; output: dist; config: wrangler.toml.
- The generated dist is also committed for compatibility with the existing deployment.
- Every build recreates dist, copies assets and public, bundles local styles and generates 13 matching pages per language, sitemap, robots and custom 404.
- public/google696019cf5de45d47.html is copied to the root of dist on every build. Keep this source for Google Search Console verification.
- The NAU source, repository and hosting must not be modified.

## Content and evidence

content/site.json holds approved names/contacts; translations.json holds bilingual interface copy; editorial.json holds approved mission/values, documentary history and daily life. people.json contains exactly three confirmed team members. stories.json contains nine undated activity topics, with distinct descriptions, spiritual meaning and details. news.json is reserved for verified dated bilingual announcements. With no dated items, the page offers useful community information without inventing events.

photos.json contains 38 approved unique public photographs. The 41-file source register also includes duplicate labels, alternative brand artwork and a private photograph with a readable telephone; these do not become extra public gallery entries. Two additional author-owned nature scenes were supplied as a diptych. Its exact panels are separated at the blank gutter and receive only mild conventional noise/contrast/sharpness correction, with no generative reconstruction. The original remains untouched.

The hero uses original 810_9821.NEF; the icon history page uses original 810_9745.NEF, showing the icon and bishop in their prayer setting. No generative retouching is applied to documentary photographs. Full frames, faces, backgrounds and proportions remain intact. Full-resolution camera JPEGs embedded in NEFs are oriented, mildly brightened only when dark (gamma 0.97), resized and encoded as WebP with metadata removed. Main/card/thumbnail maximum dimensions are 1920/960/640, with an additional 800px hero source. Responsive width descriptors reflect the real image width, including portrait images. Earlier 1600px URLs remain compatible. Originals remain untouched.

The three team cards use separate closer crops in assets/team. People and their original wall are not retouched: the approved fallback of a shared light-grey card/frame avoids damaging hair or clothing edges with masks. The carousel shows one centered card, cycles in both directions and supports touch, keyboard and reduced motion without autoplay.

The small transparent brand mark is separately extracted from owner-supplied artwork; it never replaces the documentary icon. Alternative supplied logos do not silently supersede the owner's selected mark.

The supplied certificate PNG is published unchanged with owner permission and a provenance hash in public-documents.json. Private registers, source paths, questions and unapproved icon traditions remain outside this repository. Historical documents do not establish current leadership, jurisdiction, service hours or visiting arrangements.

## Interaction and access

Team/activity carousels support arrows, keyboard, horizontal scrolling, touch and reduced motion. Native dialogs support closing and focus restoration. Contact links and a copy-number fallback appear on both contact pages and all footers. Telegram phone links depend on discovery settings; Viber requires a compatible installed app.

Fonts are local with OFL licences. No analytics, trackers, external font requests or heavy client frameworks are added by the site. The lazy Google Maps embed loads Google resources when it approaches the viewport.

## Maps and brand assets

content/location.json stores the owner-supplied Google Maps URL, exact place data ID and official Share → Embed URLs in Ukrainian and English. Keep the existing Google pin (Monastyr / Монастир), coordinates and attribution; the site's own community title is separate. One lazy iframe appears before the footer on every page, including Contacts. CSP permits frames from https://www.google.com only.

Messenger SVGs come from the services' official assets. The SVG/ICO favicon uses native vector artwork; the Apple touch icon also includes the existing supplied Marian brand image. Icon links include a content hash to update browser caches. The site has no PWA manifest, service worker or PWA icon requirement.

content/seo.json defines unique bilingual titles and descriptions. scripts/check.mjs checks metadata, all internal references, the seven owner-supplied spiritual blocks, the exact map pin, private-material exclusions and success/failure paths for copying the phone number. Screenshots and detailed editorial/HTTP evidence are kept outside the public repository in the ISF work folder.

The Google `.html` verification URL has an explicit static 200 proxy rule to an identical plain-text build asset. This prevents Cloudflare Pages from redirecting it to an extensionless URL. The required root HTML file is still retained in every build; no Function or application architecture change is needed.
