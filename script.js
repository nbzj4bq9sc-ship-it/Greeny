'use strict';
const $ = selector => document.querySelector(selector);
const readStorage = key => { try { return localStorage.getItem(key); } catch { return null; } };
const writeStorage = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
const savedLanguage = readStorage('plantsLanguage');
let language = ['fr', 'en'].includes(savedLanguage) ? savedLanguage : (navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en');
let result = null;
let animation = 0;
let shareStatus = '';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const t = key => translations[language][key];
const format = (text, values) => text.replace(/\{(\w+)\}/g, (_, key) => values[key]);
const formatScore = score => `${score}${language === 'fr' ? ' %' : '%'}`;

function renderResult() {
  if (!result) return;
  const plant = plants.find(item => item.id === result.plantId);
  $('#resultTitle').textContent = format(t('resultTitle'), { plant: plant.name[language] });
  $('#accessibleScore').textContent = format(t('accessibleScore'), { score: result.score });
  $('.message').textContent = t('verdicts')[verdictIndex(result.score)];
  $('.score').textContent = formatScore(animation ? parseInt($('.score').textContent) || 0 : result.score);
  const advice = result.issues.map(issue => {
    const item = document.createElement('li');
    item.textContent = `−${issue.points} · ${format(t('issues')[issue.type], {
      water: t('careWater')[plant.water], light: t('careLight')[plant.light.ideal[0]],
    })}`;
    return item;
  });
  if (!advice.length) {
    const item = document.createElement('li');
    item.textContent = t('matched');
    advice.push(item);
  }
  $('.reason').replaceChildren(...advice);
  $('.tip').textContent = plant.note[language];
  $('#source').href = plant.sourceUrl;
}

function renderWater(plant) {
  const previous = $('#water').value;
  const choices = plant.water === 'tank' ? { dry: 'tankDry', tank: 'tank', moist: 'tankWet' } : { dry: 'dry', surface: 'surface', moist: 'moist' };
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.disabled = true;
  placeholder.textContent = t('chooseWater');
  const options = Object.entries(choices).map(([value, key]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = t(key);
    return option;
  });
  $('#water').replaceChildren(placeholder, ...options);
  $('#water').value = Object.hasOwn(choices, previous) ? previous : '';
  $('#waterHint').textContent = t(plant.water === 'tank' ? 'tankHint' : 'waterHint');
}

function updatePlant() {
  const plant = plants.find(item => item.id === $('#plantSelect').value);
  $('#botanical').textContent = plant.botanical;
  renderWater(plant);
}

function renderLanguage() {
  document.documentElement.lang = language;
  document.title = t('pageTitle');
  document.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = t(element.dataset.i18n); });
  const selection = $('#plantSelect').value || 'pothos';
  const collator = new Intl.Collator(language, { sensitivity: 'base' });
  $('#plantSelect').replaceChildren(...[...plants].sort((a, b) => collator.compare(a.name[language], b.name[language])).map(plant => {
    const option = document.createElement('option');
    option.value = plant.id;
    option.textContent = plant.name[language];
    return option;
  }));
  $('#plantSelect').value = selection;
  $('#language').textContent = language === 'fr' ? 'FR / EN' : 'EN / FR';
  $('#language').setAttribute('aria-label', t('language'));
  $('#shareFallback').setAttribute('aria-label', t('shareLabel'));
  $('#shareStatus').textContent = shareStatus ? t(shareStatus) : '';
  updatePlant();
  renderResult();
  if (!$('#shareFallback').hidden && result) $('#shareFallback').value = shareText();
}

function saveHistory() {
  let history;
  try { history = JSON.parse(readStorage('plantHistory') || '[]'); } catch { history = []; }
  if (!Array.isArray(history)) history = [];
  history.push({ ...result, schemaVersion: 3, kind: 'care-game', date: new Date().toISOString() });
  writeStorage('plantHistory', JSON.stringify(history));
}

function finishAnimation() {
  cancelAnimationFrame(animation);
  animation = 0;
  if (result) $('.score').textContent = formatScore(result.score);
}

function animateScore() {
  cancelAnimationFrame(animation);
  if (reducedMotion.matches || result.score === 0) { finishAnimation(); return; }
  const start = performance.now();
  $('.score').textContent = formatScore(0);
  function frame(now) {
    const progress = Math.min(1, (now - start) / 800);
    $('.score').textContent = formatScore(Math.round(result.score * (1 - (1 - progress) ** 3)));
    animation = progress < 1 ? requestAnimationFrame(frame) : 0;
  }
  animation = requestAnimationFrame(frame);
}

$('#conditions').addEventListener('submit', event => {
  event.preventDefault();
  const plant = plants.find(item => item.id === $('#plantSelect').value);
  const conditions = { water: $('#water').value, light: $('#light').value, drainage: $('#drainage').value };
  result = { plantId: plant.id, ...conditions, ...calculateScore(plant, conditions) };
  $('#result').hidden = false;
  $('.emoji').textContent = result.score >= 70 ? '🌿' : result.score >= 40 ? '🌱' : '🪴';
  shareStatus = '';
  $('#shareStatus').textContent = '';
  $('#shareFallback').hidden = true;
  renderResult();
  saveHistory();
  animateScore();
});
$('#language').addEventListener('click', () => {
  language = language === 'fr' ? 'en' : 'fr';
  writeStorage('plantsLanguage', language);
  renderLanguage();
});
$('#plantSelect').addEventListener('change', updatePlant);
reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) finishAnimation(); });

function shareText() {
  const plant = plants.find(item => item.id === result.plantId);
  return `${format(t('shareText'), { plant: plant.name[language], score: result.score, verdict: t('verdicts')[verdictIndex(result.score)] })}\nhttps://nbzj4bq9sc-ship-it.github.io/Plants/`;
}
$('#shareBtn').addEventListener('click', async () => {
  if (!result) return;
  const text = shareText();
  shareStatus = '';
  $('#shareStatus').textContent = '';
  $('#shareFallback').hidden = true;
  $('#shareBtn').disabled = true;
  try {
    if (navigator.share) {
      try {
        await navigator.share({ title: t('pageTitle'), text });
        shareStatus = 'shared';
        return;
      } catch (error) {
        if (error.name === 'AbortError') return;
      }
    }
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      shareStatus = 'copied';
    } catch {
      shareStatus = 'copyFailed';
      $('#shareFallback').value = text;
      $('#shareFallback').hidden = false;
      $('#shareFallback').focus();
      $('#shareFallback').select();
    }
  } finally {
    $('#shareBtn').disabled = false;
    $('#shareStatus').textContent = shareStatus ? t(shareStatus) : '';
  }
});
renderLanguage();
