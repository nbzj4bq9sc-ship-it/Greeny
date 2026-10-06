const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const assetUrls = html => [...html.matchAll(/(?:href|src)="([^"?]+\.(?:css|js)(?:\?[^\"]*)?)"/g)].map(match => match[1]);
const digest = content => createHash('sha256').update(content).digest('hex').slice(0, 16);

test('all six CSS/JS resources have current content versions', () => {
  const urls = assetUrls(fs.readFileSync(path.join(root, 'index.html'), 'utf8'));
  assert.equal(urls.length, 6);
  for (const url of urls) {
    const [file, query] = url.split('?');
    assert.equal(query, `v=${digest(fs.readFileSync(path.join(root, file)))}`, file);
  }
  execFileSync('python3', [path.join(root, 'tools/version_assets.py'), '--check']);
});

test('a persistent browser with stale cached assets loads this release and later updates', async () => {
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'plants-cache-'));
  const fixture = path.join(scratch, 'site');
  fs.mkdirSync(path.join(fixture, 'tools'), { recursive: true });
  const files = assetUrls(fs.readFileSync(path.join(root, 'index.html'), 'utf8')).map(url => url.split('?')[0]);
  for (const file of ['index.html', ...files, 'tools/version_assets.py']) {
    fs.copyFileSync(path.join(root, file), path.join(fixture, file));
  }
  const oldHtml = '<!doctype html><link rel="stylesheet" href="style.css">' +
    files.filter(file => file.endsWith('.js')).map(file => `<script src="${file}" defer></script>`).join('');
  const requests = new Map();
  const errors = [];
  const server = http.createServer((request, response) => {
    const url = new URL(request.url, 'http://localhost');
    const file = path.basename(url.pathname);
    if (files.includes(file)) {
      requests.set(request.url, (requests.get(request.url) || 0) + 1);
      response.setHeader('Cache-Control', 'public, max-age=31536000');
      response.setHeader('Content-Type', file.endsWith('.css') ? 'text/css' : 'text/javascript');
      response.end(url.search ? fs.readFileSync(path.join(fixture, file)) :
        file.endsWith('.css') ? 'body { background: rgb(255, 0, 0); }' : 'window.staleAsset = true;');
    } else {
      response.setHeader('Cache-Control', 'no-cache');
      response.setHeader('Content-Type', 'text/html');
      response.end(file === 'legacy.html' ? oldHtml : fs.readFileSync(path.join(fixture, 'index.html')));
    }
  });
  let browser;
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}/Plants/`;
    const launch = () => chromium.launchPersistentContext(path.join(scratch, 'profile'), {
      executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true,
      args: ['--no-sandbox'], locale: 'fr', reducedMotion: 'reduce',
    });
    browser = await launch();
    let page = browser.pages()[0];
    await page.goto(origin + 'legacy.html');
    await page.evaluate(() => {
      localStorage.setItem('plantsLanguage', 'en');
      localStorage.setItem('plantHistory', JSON.stringify([{ score: 80, kind: 'legacy' }]));
    });
    await page.goto(origin + 'legacy.html?visit=2');
    for (const file of files) assert.equal(requests.get(`/Plants/${file}`), 1, `${file} reused from HTTP cache`);
    await browser.close();
    browser = await launch();
    page = browser.pages()[0];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(origin + 'legacy.html?visit=3');
    for (const file of files) assert.equal(requests.get(`/Plants/${file}`), 1, `${file} persisted in disk cache`);
    await page.goto(origin);
    assert.equal(await page.evaluate(() => window.staleAsset), undefined);
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    assert.equal(await page.locator('.brand').evaluate(brand => getComputedStyle(brand).fontSize), '52px');
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('plantHistory'))[0].kind), 'legacy');
    const initialHtml = fs.readFileSync(path.join(fixture, 'index.html'), 'utf8');
    const initialUrls = assetUrls(initialHtml);
    for (const url of initialUrls) assert.equal(requests.get(`/Plants/${url}`), 1, `fresh version fetched: ${url}`);
    await page.locator('#plantSearch').fill('Monstera');
    await page.locator('[data-plant-id=monstera]').click();
    await page.selectOption('#water', 'surface');
    await page.selectOption('#light', 'indirect');
    await page.selectOption('#drainage', 'drained');
    await page.locator('button[type=submit]').click();
    assert.equal(await page.locator('.score').textContent(), '100%');

    // Simulate the next deployment without touching production source files.
    fs.appendFileSync(path.join(fixture, 'style.css'), '\n:root { --cache-probe: refreshed; }\n');
    fs.appendFileSync(path.join(fixture, 'script.js'), '\nwindow.cacheRelease = "next";\n');
    const tool = path.join(fixture, 'tools/version_assets.py');
    assert.equal(spawnSync('python3', [tool, '--check']).status, 1, 'stale versions detected');
    execFileSync('python3', [tool]);
    const nextHtml = fs.readFileSync(path.join(fixture, 'index.html'), 'utf8');
    execFileSync('python3', [tool]);
    assert.equal(fs.readFileSync(path.join(fixture, 'index.html'), 'utf8'), nextHtml, 'versioning is idempotent');
    const nextUrls = assetUrls(nextHtml);
    assert.notEqual(nextUrls[0], initialUrls[0], 'CSS URL changes');
    assert.notEqual(nextUrls.at(-1), initialUrls.at(-1), 'changed JS URL changes');
    assert.deepEqual(nextUrls.slice(1, -1), initialUrls.slice(1, -1), 'unchanged assets retain their URLs');
    await page.goto(origin + '?release=next');
    assert.equal(await page.evaluate(() => window.cacheRelease), 'next');
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--cache-probe').trim()), 'refreshed');
    for (const url of nextUrls) assert.equal(requests.get(`/Plants/${url}`), 1, 'new URLs fetched, unchanged URLs cached');
    assert.deepEqual(errors, []);
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
    fs.rmSync(scratch, { recursive: true, force: true });
  }
});
