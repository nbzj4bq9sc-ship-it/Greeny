# Plants

A small bilingual plant-care app with a playful conditions-match score. Choose a plant, describe watering and light, then get an animated result, care pointers and a shareable summary. No framework or build step.

## Develop

Use the existing checkout:

```sh
cd /workspace/Plants
python3 -m http.server 8000 --bind 127.0.0.1
```

Open the local server in your development browser. No API keys, package installation or backend are needed. Scripts load in order: care profiles (`plants.js`), French/English copy (`translations.js`), UI and interactions (`script.js`). Styles live in `style.css`.

## Verify

With the server running, Node.js, Playwright and Chromium installed:

```sh
node --check plants.js
node --check translations.js
node --check script.js
node tests/browser.cjs
```

The browser suite accepts `PLANTS_URL` and `CHROMIUM_PATH`. It covers both languages, stored preference, switching after and during calculation, all 47 profiles, widths from 320 to 1280px, reduced motion, native sharing and clipboard/manual fallbacks, legacy and malformed history, blocked storage and rapid repeated calculations. Native sharing is mocked: device share sheets still need a real-device check.

Read [SOURCES.md](SOURCES.md) for profile scope, scoring, history compatibility and the verified NC State Extension references. The qualitative profiles are simplified guidance, not measurements or predictions.
