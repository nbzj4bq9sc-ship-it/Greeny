const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const url = process.env.PLANTS_URL || 'http://127.0.0.1:8000/';
let checks = 0;
const check = (value, message) => { assert.ok(value, message); checks++; };

async function calculate(page, { plant = 'zz', water = 'dry', light = 'indirect', drainage = 'drained', expected = 100 } = {}) {
  await page.selectOption('#plantSelect', plant);
  await page.selectOption('#water', water);
  await page.selectOption('#light', light);
  await page.selectOption('#drainage', drainage);
  await page.locator('button[type=submit]').click();
  await page.waitForFunction(score => parseInt(document.querySelector('.score').textContent) === score, expected);
}
async function sorted(page) {
  return page.locator('#plantSelect').evaluate(select => {
    const names = [...select.options].map(option => option.textContent);
    const compare = new Intl.Collator(document.documentElement.lang, { sensitivity: 'base' }).compare;
    return names.every((name, index) => index === 0 || compare(names[index - 1], name) <= 0);
  });
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
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
    check(await page.locator('html').getAttribute('lang') === 'fr', 'French detected on first visit');
    check(await page.locator('#plantSelect option').count() === 69, '69 houseplants rendered');
    check(await sorted(page), 'French alphabetical order');
    check(await page.locator('#plantSelect option').first().textContent() === 'Aeschynanthe', 'French common name used for sorting');
    check(await page.locator('button[type=submit]').textContent() === 'Affronte la vérité', 'French button and informal tone');
    check(await page.locator('#temperature').count() === 0, 'decorative temperature slider removed');
    check((await page.locator('#botanical').textContent()) === 'Epipremnum aureum', 'botanical detail for initial Pothos');
    await page.locator('button[type=submit]').click();
    check(await page.locator('#result').isHidden(), 'unanswered habits do not produce an invented result');
    for (const asset of ['plants.js', 'translations.js', 'score.js', 'script.js', 'style.css']) {
      check((await page.request.get(new URL(asset, url).href)).status() === 200, `${asset} served`);
    }
    await page.evaluate(() => localStorage.setItem('plantHistory', JSON.stringify([
      { name: 'ZZ Plant', score: 80, date: '2025-01-01' },
      { plantId: 'zz', score: 100, kind: 'conditions-match', schemaVersion: 2 },
    ])));
    await calculate(page);
    check(await page.locator('.message').textContent() === 'Toujours verte. Ta plante approuve.', 'French verdict');
    const history = await page.evaluate(() => JSON.parse(localStorage.getItem('plantHistory')));
    check(history.length === 3 && history[0].score === 80 && history[1].kind === 'conditions-match', 'old history untouched');
    check(history[2].kind === 'care-game' && history[2].schemaVersion === 3 && history[2].drainage === 'drained' && !('temperature' in history[2]), 'new score model recorded separately');
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
    check(await page.locator('#language').evaluate(button => { const r = button.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; }), 'language toggle available while scrolling');
    await page.locator('#language').click();
    check(await sorted(page), 'English alphabetical order');
    check(await page.locator('#plantSelect option').first().textContent() === 'African violet', 'English common name used for sorting');
    check(await page.locator('button[type=submit]').textContent() === 'Face the truth', 'original English button');
    check(await page.locator('#plantSelect').inputValue() === 'zz' && await page.locator('#water').inputValue() === 'dry' && await page.locator('#light').inputValue() === 'indirect' && await page.locator('#drainage').inputValue() === 'drained', 'all choices preserved after sorting');
    check(await page.locator('.message').textContent() === 'Still green. Your plant approves.', 'result translated immediately');
    check(await page.evaluate(() => JSON.parse(localStorage.getItem('plantHistory')).length) === 3, 'language switch does not calculate or add history');
    await calculate(page, { plant: 'aloe', water: 'surface', light: 'sun', expected: 80 });
    check((await page.locator('.reason').textContent()).includes('−20') && (await page.locator('.reason').textContent()).includes('Let the mix dry out'), 'moderate watering problem explained');
    await calculate(page, { plant: 'aloe', water: 'moist', light: 'sun', expected: 60 });
    check((await page.locator('.reason').textContent()).includes('−40'), 'opposite watering habit has larger impact');
    await calculate(page, { plant: 'zz', light: 'low', drainage: 'unknown', expected: 80 });
    check(await page.locator('.reason li').count() === 2, 'light tolerance and missing drainage information both explained');
    await page.locator('#language').click();
    check((await page.locator('.reason').textContent()).includes('Elle tolère cette lumière') && (await page.locator('.reason').textContent()).includes('Vérifie les trous'), 'diagnosis translated after imperfect result');
    check(parseInt(await page.locator('.score').textContent()) === 80, 'score retained on language switch');
    await page.locator('#language').click();
    await calculate(page, { drainage: 'wet', expected: 70 });
    check((await page.locator('.reason').textContent()).includes('Standing water'), 'drainage affects score and advice');
    await calculate(page, { plant: 'schlumbergera', water: 'dry', light: 'sun', expected: 20 });
    check((await page.locator('.tip').textContent()).includes('bleach the stems'), 'forest cactus advice differs from desert cactus');
    await calculate(page, { plant: 'aloe', water: 'dry', light: 'indirect', expected: 80 });
    check((await page.locator('.reason').textContent()).includes('Try a different light'), 'moderate light mismatch rendered');
    await calculate(page, { plant: 'yucca', water: 'dry', light: 'sun', expected: 90 });
    check((await page.locator('.reason').textContent()).includes('tolerates this routine'), 'documented drought tolerance is not called a severe problem');
    await calculate(page, { plant: 'bromeliad', water: 'dry', expected: 80 });
    check((await page.locator('.reason').textContent()).includes('central cup is dry'), 'empty cup diagnosis');
    await calculate(page, { plant: 'bromeliad', water: 'moist', expected: 60 });
    check((await page.locator('.reason').textContent()).includes('roots do not need to stay wet'), 'wet roots diagnosis');
    await calculate(page, { plant: 'bromeliad', water: 'tank', expected: 100 });
    await page.locator('#language').click();
    check(await page.locator('#water').inputValue() === 'tank' && (await page.locator('#waterHint').textContent()).includes('cœur des feuilles'), 'Guzmania habits kept and translated');
    await page.locator('#language').click();
    await calculate(page);
    check(await page.locator('#water option[value=tank]').count() === 0, 'central-cup answer not offered for unrelated plants');
    await page.reload();
    check(await page.locator('html').getAttribute('lang') === 'en', 'preference overrides French browser after reload');
    await page.evaluate(() => localStorage.setItem('plantHistory', '{broken'));
    await calculate(page);
    check(await page.evaluate(() => JSON.parse(localStorage.getItem('plantHistory')).length) === 1, 'malformed history recovered');

    await page.selectOption('#plantSelect', 'aloe');
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'share', { configurable: true, writable: true, value: async data => { window.shared = data; } });
    });
    await page.locator('#shareBtn').click();
    const share = await page.evaluate(() => window.shared);
    check(share.text.includes('ZZ plant') && share.text.includes('100%') && !share.text.includes('Aloe'), 'share uses the calculated snapshot');
    check(share.text.includes('has opinions') && share.text.includes('not survival odds'), 'English share is fun without a scientific probability claim');
    await page.locator('#language').click();
    await page.locator('#shareBtn').click();
    check((await page.evaluate(() => window.shared.text)).includes('Plante ZZ : 100 %') && (await page.evaluate(() => window.shared.text)).includes('Ta plante approuve'), 'French share translated naturally');
    await page.evaluate(() => {
      navigator.share = async () => { throw new DOMException('Canceled', 'AbortError'); };
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => { window.copied = text; } } });
    });
    await page.locator('#shareBtn').click();
    check(await page.evaluate(() => window.copied === undefined) && await page.locator('#shareStatus').textContent() === '', 'native cancellation does not copy or show stale success');
    await page.evaluate(() => { navigator.share = undefined; });
    await page.locator('#shareBtn').click();
    check((await page.evaluate(() => window.copied)).includes('Plante ZZ'), 'clipboard fallback');
    await page.evaluate(() => { navigator.share = async () => { throw new DOMException('Denied', 'NotAllowedError'); }; });
    await page.locator('#shareBtn').click();
    check(await page.locator('#shareStatus').textContent() === 'Copié. Le groupe peut te juger !', 'native refusal falls back to copy');
    await page.evaluate(() => { navigator.clipboard.writeText = async () => { throw new Error('Denied'); }; });
    await page.locator('#shareBtn').click();
    check(await page.locator('#shareFallback').isVisible(), 'manual copy offered when clipboard is denied');
    await page.locator('#language').click();
    check((await page.locator('#shareFallback').inputValue()).includes('My ZZ plant has opinions'), 'manual share text updates with language');

    for (const language of ['en', 'fr']) {
      if (await page.locator('html').getAttribute('lang') !== language) await page.locator('#language').click();
      for (const width of [320, 360, 390, 768, 1280]) {
        await page.setViewportSize({ width, height: 850 });
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `no overflow ${language} ${width}`);
      }
      await page.setViewportSize({ width: 320, height: 720 });
      check(await page.evaluate(() => [...document.querySelectorAll('button,select')].every(e => e.getBoundingClientRect().height >= 44)), 'touch targets');
      check(await page.evaluate(() => [...document.querySelectorAll('select')].every(select => {
        const canvas = document.createElement('canvas').getContext('2d');
        canvas.font = getComputedStyle(select).font;
        return [...select.options].every(option => canvas.measureText(option.textContent).width <= select.clientWidth - 48);
      })), `common names and answers readable at 320px ${language}`);
      check(await page.evaluate(() => [...document.querySelectorAll('[data-i18n]')].every(e => e.textContent && !e.textContent.includes('undefined'))), 'all interface text translated');
    }
    const catalog = await page.evaluate(() => plants);
    for (const plant of catalog) {
      await calculate(page, { plant: plant.id, water: plant.water, light: plant.light.ideal[0] });
      check(await page.locator('#source').getAttribute('href') === plant.sourceUrl && (await page.locator('.tip').textContent()) === plant.note.fr, `${plant.id} selectable with its own advice and reference`);
    }
    await calculate(page, { plant: 'aloe', water: 'moist', light: 'low', drainage: 'wet', expected: 0 });
    check(await page.locator('.reason li').count() === 3 && (await page.locator('.message').textContent()).includes('évasion'), 'combined problems produce a playful low verdict with concrete advice');
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: '/tmp/plants-mobile.png', fullPage: true });
    await page.setViewportSize({ width: 1280, height: 1000 });
    await calculate(page, { plant: 'monstera', water: 'surface', light: 'indirect', drainage: 'unknown', expected: 90 });
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: '/tmp/plants-desktop.png', fullPage: true });
    await context.close();

    const animated = await make({ locale: 'de-DE', reducedMotion: 'no-preference' });
    await animated.page.goto(url);
    check(await animated.page.locator('html').getAttribute('lang') === 'en', 'other browsers default to English');
    await animated.page.selectOption('#plantSelect', 'zz');
    await animated.page.selectOption('#water', 'dry');
    await animated.page.selectOption('#light', 'indirect');
    await animated.page.selectOption('#drainage', 'drained');
    await animated.page.locator('button[type=submit]').click();
    await animated.page.waitForTimeout(200);
    const halfway = parseInt(await animated.page.locator('.score').textContent());
    check(halfway > 0 && halfway < 100, 'percentage genuinely animates');
    await animated.page.locator('#language').click();
    await animated.page.waitForFunction(() => parseInt(document.querySelector('.score').textContent) === 100);
    check((await animated.page.locator('.message').textContent()).includes('Ta plante approuve'), 'language changes during animation without losing verdict');
    await animated.page.locator('button[type=submit]').click();
    await animated.page.selectOption('#water', 'moist');
    await animated.page.locator('button[type=submit]').click();
    await animated.page.waitForFunction(() => parseInt(document.querySelector('.score').textContent) === 60);
    check(await animated.page.evaluate(() => JSON.parse(localStorage.getItem('plantHistory')).length) === 3, 'rapid calculations each saved once');
    await animated.page.emulateMedia({ reducedMotion: 'reduce' });
    await calculate(animated.page);
    check(await animated.page.locator('.score').textContent() === '100 %', 'reduced motion shows final score immediately');
    await animated.context.close();

    const blocked = await make({ locale: 'en', reducedMotion: 'reduce' });
    await blocked.context.addInitScript(() => {
      Storage.prototype.getItem = () => { throw new Error('Blocked'); };
      Storage.prototype.setItem = () => { throw new Error('Blocked'); };
    });
    await blocked.page.goto(url);
    await calculate(blocked.page);
    await blocked.page.locator('#language').click();
    check(await blocked.page.locator('html').getAttribute('lang') === 'fr', 'storage denial does not break calculation or language');
    await blocked.context.close();
    check(errors.length === 0, `no browser errors: ${errors.join(', ')}`);
    console.log(`PASS: ${checks} browser assertions; bilingual sorting, verdicts, all 69 houseplants, mobile, motion, share and history.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
