'use strict';
const $ = selector => document.querySelector(selector);
const readStorage = key => { try { return localStorage.getItem(key); } catch { return null; } };
const writeStorage = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Private mode or a full storage must not block the result. */ } };
const savedLanguage = readStorage('plantsLanguage');
let language = ['fr', 'en'].includes(savedLanguage) ? savedLanguage : (navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en');
let result = null;
let animation = 0;
let shareStatus = '';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const t = key => translations[language][key];
const format = (text, values) => text.replace(/\{(\w+)\}/g, (_, key) => values[key]);
const sourceFor = plant => `https://plants.ces.ncsu.edu/plants/${(plant.source || plant.botanical).toLowerCase().replaceAll(' ', '-')}/`;

function renderResult() {
  if (!result) return;
  const plant = plants.find(item => item.id === result.plantId);
  $('.message').textContent = `${result.score}${language === 'fr' ? ' %' : '%'} · ${t('messages')[Math.min(3, Math.floor(result.score / 30))]}`;
  const advice = [];
  if (result.water !== plant.water) advice.push(format(t('waterAdvice'), { water: t({ dry: 'careDry', surface: 'careSurface', moist: 'careMoist' }[plant.water]) }));
  if (result.light !== plant.light) advice.push(format(t('lightAdvice'), { light: t(plant.light).toLocaleLowerCase(language) }));
  $('.reason').textContent = advice.join(' ') || t('matched');
  $('.tip').textContent = t(plant.id === 'orchid' ? 'orchidTip' : 'tip');
  $('#source').href = sourceFor(plant);
}
function renderLanguage() {
  document.documentElement.lang = language;
  document.title = t('pageTitle');
  document.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = t(element.dataset.i18n); });
  const selection = $('#plantSelect').value;
  $('#plantSelect').replaceChildren(...plants.map(plant => {
    const option = document.createElement('option');
    option.value = plant.id;
    option.textContent = plant.name[language];
    return option;
  }));
  if (selection) $('#plantSelect').value = selection;
  $('#language').textContent = language === 'fr' ? 'FR / EN' : 'EN / FR';
  $('#language').setAttribute('aria-label', t('language'));
  $('#shareFallback').setAttribute('aria-label', t('shareLabel'));
  $('#shareStatus').textContent = shareStatus ? t(shareStatus) : '';
  updateBotanical();
  renderResult();
  if (!$('#shareFallback').hidden && result) $('#shareFallback').value = shareText();
}
function updateBotanical() {
  $('#botanical').textContent = plants.find(plant => plant.id === $('#plantSelect').value).botanical;
}
function saveHistory() {
  let history;
  try { history = JSON.parse(readStorage('plantHistory') || '[]'); } catch { history = []; }
  if (!Array.isArray(history)) history = [];
  // Keep legacy entries intact; new entries use stable IDs rather than translated names.
  history.push({ ...result, schemaVersion: 2, kind: 'conditions-match', date: new Date().toISOString() });
  writeStorage('plantHistory', JSON.stringify(history));
}
function finishAnimation() {
  cancelAnimationFrame(animation);
  animation = 0;
  if (result) $('.score').textContent = `${result.score}%`;
}
function animateScore() {
  cancelAnimationFrame(animation);
  if (reducedMotion.matches) { finishAnimation(); return; }
  const start = performance.now();
  $('.score').textContent = '0%';
  function frame(now) {
    const progress = Math.min(1, (now - start) / 800);
    $('.score').textContent = `${Math.round(result.score * (1 - (1 - progress) ** 3))}%`;
    if (progress < 1) animation = requestAnimationFrame(frame);
    else animation = 0;
  }
  animation = requestAnimationFrame(frame);
}
$('#conditions').addEventListener('submit', event => {
  event.preventDefault();
  const plant = plants.find(item => item.id === $('#plantSelect').value);
  const water = $('#water').value;
  const light = $('#light').value;
  // Equal editorial weights, not measured biological probabilities. Temperature is deliberately unscored.
  const score = (water === plant.water ? 50 : 0) + (light === plant.light ? 50 : 0);
  result = { plantId: plant.id, water, light, temperature: Number($('#temperature').value), score };
  $('#result').hidden = false;
  $('.emoji').textContent = score === 100 ? '🌿' : score === 50 ? '🌱' : '🪴';
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
$('#plantSelect').addEventListener('change', updateBotanical);
$('#temperature').addEventListener('input', () => { $('#tempValue').textContent = `${$('#temperature').value} °C`; });
reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) finishAnimation(); });
function shareText() {
  const plant = plants.find(item => item.id === result.plantId);
  return `${format(t('shareText'), { plant: plant.name[language], score: result.score })}\nhttps://nbzj4bq9sc-ship-it.github.io/Plants/`;
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
        await navigator.share({ title: 'Plants', text });
        shareStatus = 'shared';
        return;
      } catch (error) {
        if (error.name === 'AbortError') return;
        // A platform refusal can still fall back to copying.
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
