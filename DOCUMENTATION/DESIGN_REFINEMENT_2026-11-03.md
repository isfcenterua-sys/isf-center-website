# Additional design and structure refinements

This change continues the existing ISF project from commit fb007ce. The approved hero, its 720 ms animation, original photographs, leadership portraits, three-person Coverflow, history, calendar and prayers remain intact.

Gallery and thematic photo previews now share `scripts/photo-cards.mjs`. A consistent 16:9 image area, three-line title and caption, read-more button and category produce equal card heights within each grid. On phones the grids have one column. The full-frame image and complete text open in the photo reader. CSS focal positions keep faces visible in narrow portrait-source previews; original asset pixels are unchanged.

Both room photographs (`bedroom`, `bedroom-secondary`) have `showcase: false`. Their metadata, original approved publication status and image files are retained, but they are excluded from the gallery and showcases. The home showcase now uses `terrace-fellowship`. The public gallery contains 46 photographs, with all 48 retained in source data.

The public news routes and sitemap entries are removed. The original content file and archived announcements renderer remain in source, but the build no longer emits news pages or articles. Old news URLs redirect permanently to the corresponding community-life page, avoiding stale cached news pages and broken external bookmarks. There is no empty news placeholder.

`scripts/header.mjs` creates a centred desktop masthead, two deliberate navigation rows, clear active states, the existing local fonts and an accessible mobile menu. The existing language switch preserves the current page. Messenger cards and the phone-copy control use consistent dimensions, muted backgrounds, icons, shadows and focus states; destination links and contact details are unchanged.

`content/spiritual-oversight.json` contains the owner's newly supplied Ukrainian text and its English translation about Bishop Viktor Veriaskin. It appears at `/uk/spiritual-life/#spiritual-oversight` and its English counterpart. The separate block preserves the supplied titles without identifying an unconfirmed position in a group photograph or adding a fourth person to the approved leadership Coverflow.

The photo reader displays the complete image with `object-fit: contain`, a title, category, full caption, expandable description and a stable toolbar. Photo and read-more buttons share one deduplicated photo sequence. Keyboard, touch gestures, Escape, focus restoration and reduced-motion preferences are supported. Full descriptions are kept outside card layout so expanding them cannot change grid heights.

Validation: `node scripts/build.mjs`, `node scripts/check.mjs`, `node scripts/check-faith.mjs`, `node scripts/check-refinement.mjs`. The website still requires no package installation for building. Browser tests and screenshots are retained in the owner's local report and backup.
