'use strict';
const $ = selector => document.querySelector(selector);
const readStorage = key => { try { return localStorage.getItem(key); } catch { return null; } };
const writeStorage = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
const savedLanguage = readStorage('plantsLanguage');
let language = ['fr', 'en'].includes(savedLanguage) ? savedLanguage : (navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en');
let result = null;
let animation = 0;
let shareStatus = '';
let selectedPlantId = null;
let waterPlantId = null;
let suggestions = [];
let activeSuggestion = -1;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const t = key => translations[language][key];
const format = (text, values) => text.replace(/\{(\w+)\}/g, (_, key) => values[key]);
const publicUrl = 'https://nbzj4bq9sc-ship-it.github.io/Plants/';
const rankedIssues = snapshot => [...snapshot.issues].sort((a, b) => b.points - a.points);
function verdictText() {
  return `${t('verdictVariants')[verdictIndex(result.score)][result.variant]} ${t('jokes')[rankedIssues(result)[0]?.type || 'matched']}`;
}
const formatScore = score => `${score}${language === 'fr' ? ' %' : '%'}`;

function renderResult() {
  if (!result) return;
  const plant = plants.find(item => item.id === result.plantId);
  $('#resultTitle').textContent = format(t('resultTitle'), { plant: possessivePlant(plant, language) });
  $('#accessibleScore').textContent = format(t('accessibleScore'), { score: result.score });
  $('#result').dataset.level = result.score >= 70 ? 'good' : result.score >= 50 ? 'mixed' : 'poor';
  $('#resultLevel').textContent = t('levels')[verdictIndex(result.score)];
  $('.message').textContent = verdictText();
  $('.score').textContent = formatScore(animation ? parseInt($('.score').textContent) || 0 : result.score);
  const [priority, ...remaining] = buildAdvice(plant, rankedIssues(result), language);
  $('#priorityTitle').textContent = t(result.issues.length ? 'priorityTitle' : 'maintenanceTitle');
  $('#priorityAction').textContent = priority.text;
  $('#priorityAction').dataset.topic = priority.topic;
  $('#otherAdviceTitle').hidden = !remaining.length;
  const advice = remaining.map(({ topic, text }) => {
    const item = document.createElement('li');
    item.dataset.topic = topic;
    item.textContent = text;
    return item;
  });
  $('.reason').replaceChildren(...advice);
  $('#source').href = plant.sourceUrl;
  $('#resultAnnouncement').textContent = `${$('#resultTitle').textContent}. ${$('#accessibleScore').textContent} ${t('scoreHint')}. ${$('.message').textContent}`;
}

function renderWater(plant) {
  const previous = $('#water').value;
  const choices = plant?.water === 'tank' ? { dry: 'tankDry', tank: 'tank', moist: 'tankWet' } : { dry: 'dry', surface: 'surface', moist: 'moist' };
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
  $('#waterHint').textContent = t(plant?.water === 'tank' ? 'tankHint' : 'waterHint');
}

function updatePlant() {
  const plant = plants.find(item => item.id === selectedPlantId);
  $('#botanical').textContent = plant?.botanical || '';
  renderWater(plant || plants.find(item => item.id === waterPlantId));
}

function closeSuggestions() {
  $('#plantSuggestions').hidden = true;
  $('#plantSearch').setAttribute('aria-expanded', 'false');
  $('#plantSearch').removeAttribute('aria-activedescendant');
  activeSuggestion = -1;
}

function renderSuggestions() {
  suggestions = searchPlants(plants, $('#plantSearch').value, language);
  activeSuggestion = -1;
  $('#plantSearch').removeAttribute('aria-activedescendant');
  const options = suggestions.map(plant => {
    const option = document.createElement('li');
    option.id = `suggestion-${plant.id}`;
    option.dataset.plantId = plant.id;
    option.setAttribute('role', 'option');
    option.setAttribute('aria-selected', 'false');
    const name = document.createElement('span');
    name.textContent = plant.name[language];
    const botanical = document.createElement('small');
    botanical.textContent = plant.botanical;
    option.append(name, botanical);
    return option;
  });
  $('#plantSuggestions').replaceChildren(...options);
  $('#plantSuggestions').hidden = !options.length;
  $('#plantSearch').setAttribute('aria-expanded', String(!!options.length));
  $('#searchStatus').textContent = options.length ? format(t('suggestionCount'), { count: options.length }) : t('noPlants');
}

function selectPlant(id) {
  selectedPlantId = id;
  waterPlantId = id;
  $('#plantSearch').value = plants.find(plant => plant.id === id).name[language];
  $('#plantSearch').setCustomValidity('');
  $('#clearSearch').hidden = false;
  $('#searchStatus').textContent = '';
  updatePlant();
  closeSuggestions();
}

$('#plantSearch').addEventListener('input', () => {
  selectedPlantId = null;
  $('#botanical').textContent = '';
  $('#plantSearch').setCustomValidity(t('selectPlant'));
  $('#clearSearch').hidden = !$('#plantSearch').value;
  renderSuggestions();
});
$('#plantSearch').addEventListener('focus', () => { if (!selectedPlantId) renderSuggestions(); });
$('#plantSearch').addEventListener('click', () => {
  if (!selectedPlantId && $('#plantSuggestions').hidden) renderSuggestions();
});
$('#plantSearch').addEventListener('invalid', () => {
  $('#searchStatus').textContent = suggestions.length || !$('#plantSearch').value ? t('selectPlant') : t('noPlants');
});
$('#plantSearch').addEventListener('keydown', event => {
  if (event.key === 'Escape' || event.key === 'Tab') { closeSuggestions(); return; }
  if (event.key === 'Enter' && !$('#plantSuggestions').hidden) {
    event.preventDefault();
    if (activeSuggestion >= 0) selectPlant(suggestions[activeSuggestion].id);
    else $('#searchStatus').textContent = t('selectPlant');
    return;
  }
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
  if (['Home', 'End'].includes(event.key) && $('#plantSuggestions').hidden) return;
  event.preventDefault();
  if ($('#plantSuggestions').hidden) renderSuggestions();
  if (!suggestions.length) return;
  if (event.key === 'Home') activeSuggestion = 0;
  else if (event.key === 'End') activeSuggestion = suggestions.length - 1;
  else if (activeSuggestion < 0) activeSuggestion = event.key === 'ArrowDown' ? 0 : suggestions.length - 1;
  else activeSuggestion = (activeSuggestion + (event.key === 'ArrowDown' ? 1 : -1) + suggestions.length) % suggestions.length;
  const options = [...$('#plantSuggestions').children];
  options.forEach((option, index) => option.setAttribute('aria-selected', String(index === activeSuggestion)));
  const option = options[activeSuggestion];
  $('#plantSearch').setAttribute('aria-activedescendant', option.id);
  option.scrollIntoView({ block: 'nearest' });
});
$('#plantSuggestions').addEventListener('mousedown', event => event.preventDefault());
$('#plantSuggestions').addEventListener('click', event => {
  const option = event.target.closest('[data-plant-id]');
  if (!option) return;
  selectPlant(option.dataset.plantId);
  $('#plantSearch').focus({ preventScroll: true });
});
document.addEventListener('focusin', event => {
  if (!event.target.closest('.plant-search')) closeSuggestions();
});
document.addEventListener('pointerdown', event => {
  if (!event.target.closest('.plant-search')) closeSuggestions();
});
$('#clearSearch').addEventListener('click', () => {
  selectedPlantId = null;
  $('#plantSearch').value = '';
  $('#plantSearch').setCustomValidity(t('selectPlant'));
  $('#clearSearch').hidden = true;
  updatePlant();
  $('#plantSearch').focus({ preventScroll: true });
  renderSuggestions();
});

function renderLanguage() {
  document.documentElement.lang = language;
  document.title = t('pageTitle');
  document.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = t(element.dataset.i18n); });
  $('#plantSearch').placeholder = t('searchPlaceholder');
  $('#plantSearch').setCustomValidity(selectedPlantId ? '' : t('selectPlant'));
  $('#clearSearch').setAttribute('aria-label', t('clearSearch'));
  if (selectedPlantId) $('#plantSearch').value = plants.find(plant => plant.id === selectedPlantId).name[language];
  else if ($('#plantSearch').value || document.activeElement === $('#plantSearch')) renderSuggestions();
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
  const plant = plants.find(item => item.id === selectedPlantId);
  if (!plant) {
    $('#plantSearch').setCustomValidity(t('selectPlant'));
    $('#plantSearch').reportValidity();
    return;
  }
  const conditions = { water: $('#water').value, light: $('#light').value, drainage: $('#drainage').value };
  result = { plantId: plant.id, ...conditions, ...calculateScore(plant, conditions) };
  // Stable across language switches and repeated calculations of the same answers.
  result.variant = [...`${plant.id}:${conditions.water}:${conditions.light}:${conditions.drainage}`]
    .reduce((sum, character) => sum + character.charCodeAt(0), 0) % 2;
  $('#result').hidden = false;
  $('.emoji').textContent = result.score >= 70 ? '🌿' : result.score >= 50 ? '🌱' : '🪴';
  shareStatus = '';
  $('#shareStatus').textContent = '';
  $('#shareFallback').hidden = true;
  renderResult();
  saveHistory();
  animateScore();
  $('#resultNotice').hidden = false;
  if (!reducedMotion.matches) $('#verdictSummary').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
$('#language').addEventListener('click', () => {
  language = language === 'fr' ? 'en' : 'fr';
  writeStorage('plantsLanguage', language);
  renderLanguage();
});
reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) finishAnimation(); });

function shareText() {
  const plant = plants.find(item => item.id === result.plantId);
  return `${format(t('shareText'), { plant: plant.name[language], score: result.score, verdict: verdictText() })}\n${publicUrl}`;
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
        await navigator.share({ title: t('pageTitle'), text: text.replace(`\n${publicUrl}`, ''), url: publicUrl });
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
