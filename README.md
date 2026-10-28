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

photos.json contains 36 approved unique public photographs. The hero uses original 810_9821.NEF; the icon history page uses original 810_9745.NEF. No generative retouching is applied to documentary photographs. Full frames, faces, backgrounds and proportions remain intact. Full-resolution camera JPEGs embedded in NEFs are oriented, mildly brightened only when dark (gamma 0.97), resized and encoded as WebP with metadata removed. Main/card/thumbnail maximum dimensions are 1920/960/640, with an additional 800px hero source. Earlier 1600px URLs remain compatible. Originals remain untouched.

The small transparent brand mark is separately extracted from owner-supplied artwork; it never replaces the documentary icon. Alternative supplied logos do not silently supersede the owner's selected mark.

The supplied certificate PNG is published unchanged with owner permission and a provenance hash in public-documents.json. Private registers, source paths, questions and unapproved icon traditions remain outside this repository. Historical documents do not establish current leadership, jurisdiction, service hours or visiting arrangements.

## Interaction and access

Team/activity carousels support arrows, keyboard, horizontal scrolling, touch and reduced motion. Native dialogs support closing and focus restoration. Contact links and a copy-number fallback appear on both contact pages and all footers. Telegram phone links depend on discovery settings; Viber requires a compatible installed app.

Fonts are local with OFL licences. No analytics, trackers, external font requests or heavy client frameworks.

The Google `.html` verification URL has an explicit static 200 proxy rule to an identical plain-text build asset. This prevents Cloudflare Pages from redirecting it to an extensionless URL. The required root HTML file is still retained in every build; no Function or application architecture change is needed.
