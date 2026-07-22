# Dock App Icons — Sources

All icons are final **512×512 PNG, RGBA (transparent rounded-square corners)**.
Eight are official app icons pulled from the Apple App Store CDN (`*.mzstatic.com`) via the
public iTunes Search API at 1024px, then downscaled to 512px. Full-bleed iOS icons had a
superellipse (macOS "squircle") mask applied for transparent corners; the two macOS icons
(Spark, Slack) already shipped as transparent squircles and were auto-cropped to edge. Zen is
rendered from the browser's official vector app icon.

| File | App (verified) | Publisher | Source | Fetched res | Final |
|------|----------------|-----------|--------|-------------|-------|
| spark.png | Spark Mail — AI Email & Inbox | Readdle Technologies Ltd | Apple App Store (Mac) via iTunes Search API | 1024×1024 | 512×512 |
| zen.png | Zen Browser (official app icon) | Zen Browser project | https://zen-browser.app/favicon.svg (official vector) | SVG (1024 viewBox) | 512×512 |
| figma.png | Figma (multi-color logo icon) | Figma, Inc. | Apple App Store (iOS) via iTunes Search API | 1024×1024 | 512×512 |
| bible.png | Bible (YouVersion) | Life.Church | Apple App Store (iOS) via iTunes Search API | 1024×1024 | 512×512 |
| linear.png | Linear Mobile | Linear Orbit, Inc. | Apple App Store (iOS) via iTunes Search API | 1024×1024 | 512×512 |
| notion.png | Notion: Notes, Tasks, AI | Notion Labs, Inc. | Apple App Store (iOS) via iTunes Search API | 1024×1024 | 512×512 |
| slack.png | Slack for Desktop | Slack Technologies LLC | Apple App Store (Mac) via iTunes Search API | 1024×1024 | 512×512 |
| superhuman.png | Superhuman Mail | Superhuman Labs Inc. | Apple App Store (iOS) via iTunes Search API | 1024×1024 | 512×512 |
| signal.png | Signal — Private Messenger | Signal Messenger, LLC | Apple App Store (iOS) via iTunes Search API | 1024×1024 | 512×512 |

## Flags / choices
- **bible** — Used the **YouVersion "Bible" app by Life.Church** (the App Store app literally named
  "Bible"), as requested. Renders as the red HOLY BIBLE book icon — unambiguously a Bible app.
- **superhuman** — Used **Superhuman** (Superhuman Mail, premium email) as first choice per the brief,
  NOT Apache Superset. The icon is the dark tile with the purple gradient stacked-layers glyph.
- All icons are the current, official app-store artwork (authoritative & up to date), not favicons.
