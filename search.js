'use strict';

function normalizeSearch(value) {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
    .replace(/œ/g, 'oe').replace(/æ/g, 'ae').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

function searchPlants(catalogue, query, language) {
  const terms = normalizeSearch(query).split(' ').filter(Boolean);
  if (!terms.length) return ['monstera', 'pothos', 'orchid', 'cactus', 'snake', 'zz']
    .map(id => catalogue.find(plant => plant.id === id)).filter(Boolean);
  const matches = catalogue.map(plant => {
    const names = [plant.name[language], plant.name[language === 'fr' ? 'en' : 'fr'], plant.botanical, ...(plant.aliases || [])];
    const rank = names.findIndex(name => terms.every(term => normalizeSearch(name).includes(term)));
    return { plant, rank };
  }).filter(item => item.rank >= 0);
  const collator = new Intl.Collator(language, { sensitivity: 'base' });
  return matches.sort((a, b) => a.rank - b.rank || collator.compare(a.plant.name[language], b.plant.name[language]))
    .map(item => item.plant);
}

function possessivePlant(plant, language) {
  if (language === 'en') {
    const name = /^(African|Boston|Chinese|Christmas|Madagascar|Ming|Norfolk|ZZ)\b/.test(plant.name.en)
      ? plant.name.en : plant.name.en[0].toLowerCase() + plant.name.en.slice(1);
    return `your ${name}`;
  }
  const name = plant.id === 'monstera' ? plant.name.fr : plant.name.fr[0].toLowerCase() + plant.name.fr.slice(1);
  const possessive = plant.genderFr === 'f' && !/^[aeiouyh]/.test(normalizeSearch(name)) ? 'ta' : 'ton';
  return `${possessive} ${name}`;
}

if (typeof module !== 'undefined') module.exports = { normalizeSearch, searchPlants, possessivePlant };
