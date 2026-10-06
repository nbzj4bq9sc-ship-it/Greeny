# Plants

Would your plant survive your actual routine? A small, playful bilingual app: pick one of 69 houseplants, describe watering, light and drainage, face the animated verdict, get practical care tips and share it. The warm dark design stays responsive. No framework or application build step.

## Develop

```sh
cd /workspace/Plants
python3 -m http.server 8000 --bind 127.0.0.1
```

No API keys, package installation or backend are needed. `plants.js` holds the sourced catalogue, `translations.js` holds UI copy, `score.js` calculates the game score, and `script.js` handles rendering and interactions. Styles are in `style.css`.

## Verify

With Node.js, Playwright, Chromium and the server running:

```sh
node --check plants.js
node --check translations.js
node --check score.js
node --check script.js
node --test tests/score.test.cjs
node tests/browser.cjs
```

The score tests cover concrete source-backed examples, watering differences, light tolerance, forest versus desert cacti, special Guzmania care, drainage, coarse bounds and improving conditions across every valid combination. Browser tests cover bilingual alphabetical sorting, preserved choices and verdicts, all 69 plants, mobile widths, touch controls, reduced motion, sharing fallbacks, legacy history and unavailable storage. The browser suite accepts `PLANTS_URL` and `CHROMIUM_PATH`. Native sharing is mocked; the operating system's share sheet still needs a real-device check.

To generate a self-contained interactive review file outside the checkout:

```sh
python3 tools/preview.py /workspace/previews/plants.html
```

Open the downloaded HTML in a browser. Its desktop, 390px and 320px controls resize the app without resetting it. Native sharing and clipboard access depend on browser permissions and may require HTTPS; manual copying remains available.

See [SOURCES.md](SOURCES.md) for the 69 references, botanical scope, catalogue exclusions, scoring rules and why the nonfunctional temperature input was removed. The score is a game, not a scientific survival probability.
