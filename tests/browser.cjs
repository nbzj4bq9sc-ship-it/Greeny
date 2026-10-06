const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const url = process.env.PLANTS_URL || 'http://127.0.0.1:8000/';
let checks = 0;
const check = (value, message) => { assert.ok(value, message); checks++; };

async function calculate(page, { plant = 'zz', water = 'dry', light = 'indirect', drainage = 'drained', expected = 100 } = {}) {
  await choosePlant(page, plant);
  await page.selectOption('#water', water);
  await page.selectOption('#light', light);
  await page.selectOption('#drainage', drainage);
  await page.locator('button[type=submit]').click();
  await page.waitForFunction(score => parseInt(document.querySelector('.score').textContent) === score, expected);
}
async function choosePlant(page, id) {
  const name = await page.evaluate(id => plants.find(plant => plant.id === id).name[document.documentElement.lang], id);
  await page.locator('#plantSearch').fill(name);
  await page.locator(`[data-plant-id="${id}"]`).click();
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
    check(await page.evaluate(() => plants.length) === 69, 'catalogue unchanged');
    check(await page.locator('button[type=submit]').textContent() === 'Affronte la vérité', 'French button and informal tone');
    check(await page.locator('#temperature').count() === 0, 'decorative temperature slider removed');
    check((await page.locator('#plantSearch').inputValue()) === '', 'no plant selected implicitly');
    await page.locator('button[type=submit]').click();
    check(await page.locator('#result').isHidden(), 'unanswered habits do not produce an invented result');
    for (const asset of ['plants.js', 'translations.js', 'score.js', 'search.js', 'script.js', 'style.css']) {
      check((await page.request.get(new URL(asset, url).href)).status() === 200, `${asset} served`);
    }
    await page.locator('#plantSearch').fill('SANSEVIERIA');
    check(await page.locator('[role=option]').first().textContent() === 'Langue de belle-mèreDracaena trifasciata', 'synonym search and French common name first');
    await page.locator('#plantSearch').press('ArrowDown');
    check(await page.locator('#plantSearch').getAttribute('aria-activedescendant') === 'suggestion-snake', 'keyboard active option');
    await page.locator('#plantSearch').press('Enter');
    check(await page.evaluate(() => selectedPlantId) === 'snake' && await page.locator('#plantSuggestions').isHidden(), 'Enter selects species');
    check(await page.locator('#plantSearch').evaluate(input => input === document.activeElement), 'selection retains input focus');
    await page.locator('#plantSearch').fill('cactus');
    await page.locator('#plantSearch').press('ArrowUp');
    check(await page.locator('[role=option][aria-selected=true]').evaluate(option => option === option.parentElement.lastElementChild), 'ArrowUp starts with last suggestion');
    await page.locator('#plantSearch').press('Home');
    check(await page.locator('#plantSearch').getAttribute('aria-activedescendant') === 'suggestion-cactus', 'Home selects first matching option');
    await page.locator('#plantSearch').press('End');
    check(await page.locator('[role=option][aria-selected=true]').evaluate(option => option === option.parentElement.lastElementChild), 'End selects last matching option');
    await page.locator('#plantSearch').press('Tab');
    check(await page.locator('#plantSuggestions').isHidden(), 'Tab closes suggestions without selecting');
    await choosePlant(page, 'snake');
    await page.locator('#language').click();
    check(await page.locator('#plantSearch').inputValue() === 'Snake plant', 'selection preserved when translated');
    await page.locator('#language').click();
    await page.locator('#clearSearch').click();
    check(await page.locator('#plantSearch').inputValue() === '' && await page.evaluate(() => selectedPlantId) === null, 'clear removes selection');
    check(await page.locator('[role=option]').count() === 6, 'short starter suggestions');
    await page.locator('#plantSearch').fill('plante intergalactique');
    check((await page.locator('#searchStatus').textContent()).includes('Aucune plante') && await page.locator('[role=option]').count() === 0, 'no-match message');
    await page.locator('#water').selectOption('dry');
    await page.locator('#light').selectOption('indirect');
    await page.locator('button[type=submit]').click();
    check(await page.locator('#result').isHidden(), 'unknown text cannot generate a result even with conditions');
    await page.locator('#plantSearch').fill('orchidee');
    check(await page.locator('[data-plant-id=orchid]').count() === 1, 'accents ignored');
    await page.locator('#plantSearch').press('Escape');
    check(await page.locator('#plantSuggestions').isHidden(), 'Escape closes suggestions');
    await page.locator('#plantSearch').press('ArrowDown');
    await page.locator('#plantSearch').press('Enter');
    await page.locator('#water').selectOption('surface');
    await page.locator('#drainage').selectOption('drained');
    await page.locator('button[type=submit]').click();
    check(await page.locator('#resultTitle').textContent() === 'Le verdict pour ton orchidée', 'feminine vowel possessive');
    check(await page.locator('.score-label').textContent() === 'Potentiel de survie' && await page.locator('#verdictSummary .hint').textContent() === 'Estimation ludique selon tes réponses', 'game percentage clearly labelled');
    check(await page.locator('button[type=submit]').evaluate(button => button === document.activeElement), 'calculation does not steal focus');
    check(await page.locator('#resultNotice').isVisible() && (await page.locator('#resultAnnouncement').textContent()).includes('ton orchidée'), 'result link and live announcement');
    await page.evaluate(() => localStorage.removeItem('plantHistory'));
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
    check(await page.locator('#plantSearch').inputValue() === 'ZZ plant', 'selected common name translated');
    check(await page.locator('button[type=submit]').textContent() === 'Face the truth', 'original English button');
    check(await page.evaluate(() => selectedPlantId) === 'zz' && await page.locator('#water').inputValue() === 'dry' && await page.locator('#light').inputValue() === 'indirect' && await page.locator('#drainage').inputValue() === 'drained', 'all choices preserved after sorting');
    check(await page.locator('.message').textContent() === 'Still green. Your plant approves.', 'result translated immediately');
    check(await page.evaluate(() => JSON.parse(localStorage.getItem('plantHistory')).length) === 3, 'language switch does not calculate or add history');
    await calculate(page, { plant: 'aloe', water: 'surface', light: 'sun', expected: 80 });
    check(!(await page.locator('.reason').textContent()).includes('−20') && (await page.locator('.reason').textContent()).includes('Let the mix dry out'), 'moderate watering problem explained');
    await calculate(page, { plant: 'aloe', water: 'moist', light: 'sun', expected: 60 });
    check(!(await page.locator('.reason').textContent()).includes('−40'), 'penalties hidden; score still reflects impact');
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

    await choosePlant(page, 'aloe');
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'share', { configurable: true, writable: true, value: async data => { window.shared = data; } });
    });
    await page.locator('#shareBtn').click();
    const share = await page.evaluate(() => window.shared);
    check(share.text.includes('ZZ plant') && share.text.includes('100%') && !share.text.includes('Aloe'), 'share uses the calculated snapshot');
    check(share.text.includes('Survival potential') && share.text.includes('playful estimate') && share.text.includes('not scientific survival odds'), 'English share is fun without a scientific probability claim');
    check(share.text.includes('https://nbzj4bq9sc-ship-it.github.io/Plants/'), 'share includes site link');
    await page.locator('#water').selectOption('moist');
    await page.locator('#light').selectOption('low');
    await page.locator('#drainage').selectOption('wet');
    await page.locator('#shareBtn').click();
    check((await page.evaluate(() => window.shared.text)) === share.text, 'edited conditions do not alter shared snapshot');
    await page.locator('#language').click();
    await page.locator('#shareBtn').click();
    check((await page.evaluate(() => window.shared.text)).includes('Plante ZZ · Potentiel de survie : 100 %') && (await page.evaluate(() => window.shared.text)).includes('Ta plante approuve'), 'French share translated naturally');
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
    check((await page.locator('#shareFallback').inputValue()).includes('ZZ plant · Survival potential'), 'manual share text updates with language');

    for (const language of ['en', 'fr']) {
      if (await page.locator('html').getAttribute('lang') !== language) await page.locator('#language').click();
      for (const width of [320, 360, 390, 768, 1280]) {
        await page.setViewportSize({ width, height: 850 });
        await page.locator('#plantSearch').fill('a');
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `no overflow ${language} ${width}`);
      }
      await page.setViewportSize({ width: 320, height: 720 });
      check(await page.evaluate(() => [...document.querySelectorAll('button,select,input')].filter(e => e.getBoundingClientRect().height > 0).every(e => e.getBoundingClientRect().height >= 44)), 'touch targets');
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

    const touch = await make({ locale: 'fr', hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await touch.page.goto(url);
    await touch.page.locator('#plantSearch').tap();
    await touch.page.locator('#plantSearch').fill('MOTH ORCHID');
    await touch.page.locator('[data-plant-id=orchid]').tap();
    check(await touch.page.evaluate(() => selectedPlantId) === 'orchid', 'touch selects English alias in French UI');
    await touch.page.locator('#clearSearch').tap();
    await touch.page.locator('#plantSearch').fill('Guzmania');
    await touch.page.locator('[data-plant-id=bromeliad]').tap();
    await touch.page.selectOption('#water', 'tank');
    await touch.page.locator('#plantSearch').fill('Guz');
    await touch.page.locator('#language').tap();
    check(await touch.page.locator('#plantSearch').inputValue() === 'Guz' && await touch.page.locator('#water').inputValue() === 'tank', 'language preserves pending query and special watering answer');
    await touch.page.locator('[data-plant-id=bromeliad]').tap();
    await touch.page.selectOption('#light', 'indirect');
    await touch.page.selectOption('#drainage', 'drained');
    await touch.page.locator('button[type=submit]').tap();
    check(await touch.page.locator('.score').textContent() === '100%' && await touch.page.locator('#resultNotice').isVisible(), 'touch calculation exposes result immediately with reduced motion');
    check(await touch.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'no touch viewport overflow');
    await touch.context.close();

    const animated = await make({ locale: 'de-DE', reducedMotion: 'no-preference' });
    await animated.page.goto(url);
    check(await animated.page.locator('html').getAttribute('lang') === 'en', 'other browsers default to English');
    await choosePlant(animated.page, 'zz');
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
    check((await animated.page.locator('#resultAnnouncement').textContent()).includes('Potentiel de survie'), 'accessible result translated immediately');
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
    console.log(`PASS: ${checks} browser assertions; search, selection, FR/EN, all 69 plants, mobile, motion, share and history.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
