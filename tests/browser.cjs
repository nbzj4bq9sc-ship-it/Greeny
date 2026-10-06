/* Run with Node.js and Playwright installed; CHROMIUM_PATH can override the browser. */
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const url = process.env.PLANTS_URL || 'http://127.0.0.1:8000/';
const browserPath = process.env.CHROMIUM_PATH || '/usr/bin/chromium';
let checks = 0;
const check = (value, message) => { assert.ok(value, message); checks++; };
async function calculate(page, plant = 'zz', water = 'dry', light = 'indirect') {
  await page.selectOption('#plantSelect', plant);
  await page.selectOption('#water', water);
  await page.selectOption('#light', light);
  await page.locator('button[type=submit]').click();
  await page.waitForFunction(() => document.querySelector('.score').textContent === '100%');
}
(async () => {
  const browser = await chromium.launch({ executablePath: browserPath, headless: true, args: ['--no-sandbox'] });
  const errors = [];
  const make = async options => {
    const context = await browser.newContext(options);
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    return { context, page };
  };
  try {
    const { context, page } = await make({ locale: 'fr-CA', viewport: { width: 320, height: 720 }, reducedMotion: 'reduce' });
    await page.goto(url);
    check(await page.locator('html').getAttribute('lang') === 'fr', 'French browser language');
    check(await page.locator('#plantSelect option').count() === 47, '47 plants');
    for (const file of ['plants.js', 'translations.js', 'script.js', 'style.css']) {
      check((await page.request.get(new URL(file, url).href)).status() === 200, `${file} served`);
    }
    await page.evaluate(() => localStorage.setItem('plantHistory', JSON.stringify([{ name: 'ZZ Plant', score: 80, date: '2025-01-01' }])));
    await calculate(page);
    check(await page.locator('#result').isVisible(), 'visible result');
    check(await page.locator('.message').textContent() === '100 % · Vos conditions correspondent à ce profil général.', 'French result');
    const history = await page.evaluate(() => JSON.parse(localStorage.getItem('plantHistory')));
    check(history.length === 2 && history[0].score === 80 && history[1].plantId === 'zz' && history[1].kind === 'conditions-match', 'legacy history preserved, stable new schema');
    await page.locator('#language').click();
    check(await page.locator('html').getAttribute('lang') === 'en', 'switch after calculation');
    check(await page.locator('#plantSelect').inputValue() === 'zz' && await page.locator('#water').inputValue() === 'dry', 'choices retained');
    check(await page.locator('.message').textContent() === '100% · Your conditions fit this broad profile.', 'result translated');
    check(await page.evaluate(() => JSON.parse(localStorage.getItem('plantHistory')).length) === 2, 'language switch does not add history');
    await page.reload();
    check(await page.locator('html').getAttribute('lang') === 'en', 'saved language overrides browser');
    await page.evaluate(() => localStorage.setItem('plantHistory', '{broken'));
    await calculate(page);
    check(await page.evaluate(() => JSON.parse(localStorage.getItem('plantHistory')).length) === 1, 'malformed history recovered');
    await page.selectOption('#plantSelect', 'aloe'); // Unsubmitted changes must not alter sharing.
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'share', { configurable: true, writable: true, value: async data => { window.shared = data; } });
    });
    await page.locator('#shareBtn').click();
    const shared = await page.evaluate(() => window.shared);
    check(shared.text.includes('ZZ plant') && shared.text.includes('100%') && !shared.text.includes('Aloe'), 'native share uses calculated snapshot');
    check(!shared.text.includes('chance of survival'), 'share is not survival probability');
    await page.locator('#language').click();
    await page.locator('#shareBtn').click();
    check((await page.evaluate(() => window.shared.text)).includes('Plante ZZ : 100 %'), 'French native share');
    await page.evaluate(() => {
      navigator.share = async () => { throw new DOMException('Canceled', 'AbortError'); };
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => { window.copied = text; } } });
    });
    await page.locator('#shareBtn').click();
    check(await page.evaluate(() => window.copied === undefined), 'native cancellation does not copy');
    check(await page.locator('#shareStatus').textContent() === '', 'cancellation clears stale status');
    await page.evaluate(() => { navigator.share = undefined; });
    await page.locator('#shareBtn').click();
    check((await page.evaluate(() => window.copied)).includes('Plante ZZ'), 'clipboard fallback');
    await page.evaluate(() => { navigator.share = async () => { throw new DOMException('Denied', 'NotAllowedError'); }; });
    await page.locator('#shareBtn').click();
    check(await page.locator('#shareStatus').textContent() === 'Résultat copié. Prêt à partager !', 'native refusal falls back to copy');
    await page.evaluate(() => { navigator.clipboard.writeText = async () => { throw new Error('Denied'); }; });
    await page.locator('#shareBtn').click();
    check(await page.locator('#shareFallback').isVisible(), 'manual fallback when clipboard refused');
    await page.locator('#language').click();
    check((await page.locator('#shareFallback').inputValue()).includes('ZZ plant:'), 'manual share text translated');
    check(await page.locator('#shareStatus').textContent() === 'Copy is unavailable. Select and copy the text below.', 'share status translated');
    for (const locale of ['en', 'fr']) {
      if (await page.locator('html').getAttribute('lang') !== locale) await page.locator('#language').click();
      for (const width of [320, 360, 390, 768, 1280]) {
        await page.setViewportSize({ width, height: 850 });
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `no horizontal overflow ${locale} ${width}`);
      }
      check(await page.locator('label[for=water]').textContent() === (locale === 'fr' ? 'Quand arrosez-vous ?' : 'When do you water?'), `${locale} label`);
      check(await page.evaluate(() => [...document.querySelectorAll('button, select, input[type=range]')].every(e => e.getBoundingClientRect().height >= 44)), 'touch target heights');
    }
    const data = await page.evaluate(() => plants);
    check(new Set(data.map(p => p.id)).size === 47, 'unique IDs');
    for (const plant of data) {
      check(['dry', 'surface', 'moist'].includes(plant.water) && ['low', 'indirect', 'sun'].includes(plant.light), `${plant.id} reachable form profile`);
      await calculate(page, plant.id, plant.water, plant.light);
    }
    check(await page.evaluate(() => JSON.parse(localStorage.getItem('plantHistory')).length) === 48, 'all 47 profiles calculated');
    await page.locator('#temperature').fill('35');
    await page.locator('#temperature').dispatchEvent('input');
    await calculate(page, 'hydrangea', 'moist', 'indirect');
    check(await page.locator('#tempValue').textContent() === '35 °C', 'temperature display');
    check(await page.evaluate(() => JSON.parse(localStorage.getItem('plantHistory')).at(-1).temperature) === 35, 'temperature saved without invented score target');
    await page.selectOption('#water', 'dry');
    await page.locator('button[type=submit]').click();
    check(await page.locator('.score').textContent() === '50%', 'one mismatch');
    await page.selectOption('#light', 'low');
    await page.locator('button[type=submit]').click();
    check(await page.locator('.score').textContent() === '0%', 'two mismatches');
    check((await page.locator('.reason').textContent()).length > 20, 'actionable advice');
    await page.setViewportSize({ width: 320, height: 720 });
    await page.screenshot({ path: '/tmp/plants-mobile.png', fullPage: true });
    await context.close();

    const animated = await make({ locale: 'de-DE', reducedMotion: 'no-preference' });
    await animated.page.goto(url);
    check(await animated.page.locator('html').getAttribute('lang') === 'en', 'non-French defaults to English');
    await animated.page.selectOption('#plantSelect', 'zz');
    await animated.page.selectOption('#water', 'dry');
    await animated.page.selectOption('#light', 'indirect');
    await animated.page.locator('button[type=submit]').click();
    await animated.page.waitForTimeout(200);
    check(!['0%', '100%'].includes(await animated.page.locator('.score').textContent()), 'score genuinely animates');
    await animated.page.locator('#language').click();
    await animated.page.waitForFunction(() => document.querySelector('.score').textContent === '100%');
    check((await animated.page.locator('.message').textContent()).includes('Vos conditions'), 'language can change during animation');
    await animated.page.locator('button[type=submit]').click();
    await animated.page.selectOption('#water', 'moist');
    await animated.page.locator('button[type=submit]').click();
    await animated.page.waitForFunction(() => document.querySelector('.score').textContent === '50%');
    check(await animated.page.evaluate(() => JSON.parse(localStorage.getItem('plantHistory')).length) === 3, 'rapid repeated calculations record once each');
    await animated.page.emulateMedia({ reducedMotion: 'reduce' });
    await calculate(animated.page);
    check(await animated.page.locator('.score').textContent() === '100%', 'reduced motion final score');
    await animated.page.setViewportSize({width:1280,height:1000});
    await animated.page.screenshot({path:'/tmp/plants-desktop.png',fullPage:true});
    await animated.context.close();

    const unavailable = await make({ locale: 'en' });
    await unavailable.context.addInitScript(() => {
      Storage.prototype.getItem = () => { throw new Error('Blocked'); };
      Storage.prototype.setItem = () => { throw new Error('Blocked'); };
    });
    await unavailable.page.goto(url);
    await calculate(unavailable.page);
    await unavailable.page.locator('#language').click();
    check(await unavailable.page.locator('html').getAttribute('lang') === 'fr', 'blocked storage does not break language or result');
    await unavailable.context.close();
    check(errors.length === 0, `browser errors: ${errors.join(', ')}`);
    console.log(`PASS: ${checks} assertions; bilingual UI, 47 profiles, mobile, motion, share, history, storage.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
