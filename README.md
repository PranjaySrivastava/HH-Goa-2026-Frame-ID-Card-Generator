# HH Goa 2026 — Builder Frame Generator

A fast, mobile-first tool for the HH Goa 2026 Builder Shortlist that generates
branded PFP frames and Builder ID cards, entirely client-side, and lets users
share the result straight to X with `#FrameInGoa`.

- **No login, no accounts.** Nothing is uploaded to a server.
- **Any photo works.** JPG, PNG, or HEIC (auto-converted), any aspect ratio
  or orientation, with drag-to-reposition + zoom instead of a manual crop step.
- **Instant export.** Rendering happens on an in-browser `<canvas>`, so
  upload → download is well under a couple of seconds.

## Tech stack

- **React 18 + Vite** — instant dev server, small production bundle
- **Tailwind CSS** — utility-first styling, custom design tokens for the theme
- **lucide-react** — icon set
- **heic2any** — lazy-loaded (dynamic `import()`) only when a `.heic`/`.heif`
  file is actually uploaded, so it never bloats the initial page load
- **HTML5 Canvas API** — all graphic generation (no image assets to fetch)

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
```

```bash
npm run build      # production build -> dist/
npm run preview    # serve the production build locally
```

## Project structure

```
src/
  components/
    Header.jsx         sticky nav
    HeroCopy.jsx        landing headline + stats
    Hero.jsx             hero layout (copy + app card)
    AppCard.jsx           the tool: wires state -> subcomponents
    ModeToggle.jsx         PFP Frame / Builder ID segmented control
    Dropzone.jsx            drag & drop / tap-to-browse upload
    CanvasPreview.jsx        canvas + drag-to-reposition + zoom slider
    IdCardForm.jsx            name / role / builder-title fields
    ActionBar.jsx              Download PNG + Share on X
    HowItWorks.jsx              3-step marketing section
    Footer.jsx
  hooks/
    useFrameCanvas.js    canvas ref, resolution sync, pointer drag math
  lib/
    canvasRender.js       all canvas drawing (PFP + ID card renderers)
    cropMath.js             cover-fit crop rectangle math (zoom + focal point)
    loadImage.js             File -> HTMLImageElement, HEIC conversion
    builderTitles.js          builder title word list + role suggestions
  App.jsx
  main.jsx
  index.css
```

## How image fitting works (no crop step)

`lib/cropMath.js` computes a "cover" source rectangle for any image against
the target canvas ratio (1:1 for PFP, 16:9 for the ID card), the same way
CSS `object-fit: cover` would. A zoom slider (100–300%) shrinks that
rectangle further, and dragging on the preview shifts a normalized focal
point (`cx`, `cy`) that's clamped to the available "slack" so the crop
never leaves the image bounds. This means arbitrary aspect ratios,
orientations, and off-center subjects all just work, with reposition as an
enhancement rather than a required step.

### Automatic face-centering

`lib/faceDetect.js` runs a tiny (~190KB) face-detection model —
[`@vladmandic/face-api`](https://github.com/vladmandic/face-api)'s
TinyFaceDetector — entirely client-side, right after a photo loads:

1. The photo appears immediately with a plain center crop (nothing blocks
   on detection).
2. Detection runs in the background; if a face is found, the crop's focal
   point is nudged to center on it automatically.
3. If no face is found (logo, pet, landscape, group shot, low confidence),
   it silently falls back to the center crop — the drag/zoom controls are
   always there as a manual override either way.

The model files live in `public/models/` (copied from the library's own
bundled weights) and are only fetched the first time someone uploads a
photo, via `faceapi.nets.tinyFaceDetector.loadFromUri("/models")`. The
face-api.js library itself is dynamically `import()`-ed for the same
reason heic2any is — so a JPG/PNG-only session's initial page load stays
small, and the ~340KB (gzipped) face detection chunk only loads when it's
actually needed.

## Output formats

| Mode | Canvas size | Notes |
|---|---|---|
| PFP Frame | 1080 × 1080 | square, ready to set as a profile photo |
| Builder ID | 1200 × 675 | matches X's link-card ratio for sharing |

## Sharing to X

The Web Intent API (`https://x.com/intent/tweet`) can't attach an image
directly, so **Share on X** uploads the rendered PNG to a serverless
endpoint (`api/share/create.js` → Vercel Blob) and gets back a page at
`/s/:id` (`api/share/[id].js`) whose `og:image` / `twitter:image` tags
point at that exact graphic. The intent opens with `text` **and** `url`
set to that page, so the tweet's link-preview card shows the real
generated image, not a blank thumbnail.

If the upload fails for any reason (offline, API not deployed, etc.),
the button falls back to the original behavior — download the PNG and
open a text-only intent — so the flow never dead-ends.

Shared graphics are deleted automatically after 48h by a daily cron
(`api/share/cleanup.js`), keeping storage transient and consistent with
"nothing is kept on a server" beyond what's needed for sharing.

### Deploying (required for the share flow)

The share flow needs a live backend, so deploy on **Vercel**:

1. `vercel link` (or import the repo in the Vercel dashboard).
2. In the project's **Storage** tab, create a **Blob** store and connect
   it — this sets `BLOB_READ_WRITE_TOKEN` automatically.
3. Add a `CRON_SECRET` env var (any random string) — `vercel.json`
   already schedules `api/share/cleanup.js` daily at 03:00 UTC.
4. `vercel --prod`.

Everything else (the SPA itself) needs no env vars and works the same
in local dev (`npm run dev`) — only the upload step needs the deployed
API, and gracefully falls back to manual-attach when it's unavailable.

## Customizing

- Builder titles / role suggestions: `src/lib/builderTitles.js`
- Colors, fonts, shadows: `tailwind.config.js`
- Card art (backgrounds, badge text, layout): `src/lib/canvasRender.js`
