const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const { normalizeSearch, searchPlants, possessivePlant } = require('../search.js');
const plants = JSON.parse(vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../plants.js'), 'utf8') + '; JSON.stringify(plants)'));
const find = id => plants.find(plant => plant.id === id);

test('both common names, botanical names and every recorded alias find the same species', () => {
  for (const plant of plants) {
    for (const name of [...Object.values(plant.name), plant.botanical, ...(plant.aliases || [])]) {
      for (const language of ['fr', 'en']) {
        assert.ok(searchPlants(plants, name.toUpperCase(), language).some(match => match.id === plant.id), `${language}: ${name}`);
      }
    }
  }
  assert.equal(searchPlants(plants, 'orchidee', 'en')[0].id, 'orchid');
  assert.equal(searchPlants(plants, 'SANSEVIERIA trifasciata', 'fr')[0].id, 'snake');
  assert.equal(searchPlants(plants, 'Schefflera arboricola', 'en')[0].id, 'schefflera');
  assert.equal(searchPlants(plants, 'Saintpaulia', 'fr')[0].id, 'violet');
  assert.equal(normalizeSearch('Chaîne des CŒURS'), 'chaine des coeurs');
});

test('unknown text produces no profile and empty search offers a short starting list', () => {
  assert.deepEqual(searchPlants(plants, 'intergalactic unicorn', 'fr'), []);
  assert.equal(searchPlants(plants, '   ', 'en').length, 6);
  assert.equal(searchPlants(plants, 'cactus', 'fr')[0].id, 'cactus');
  assert.equal(searchPlants(plants, 'Zebra plant', 'en')[0].id, 'aphelandra');
});

test('French possessives cover gender, vowels, accents and all catalogue entries', () => {
  const feminine = new Set('spider peace snake zz fern violet orchid monstera echeveria hoya alocasia aspidistra cordyline tradescantia adiantum davallia platycerium sedum ceropegia nematanthus'.split(' '));
  for (const plant of plants) {
    assert.equal(plant.genderFr, feminine.has(plant.id) ? 'f' : 'm', plant.id);
    const expected = feminine.has(plant.id) && !/^[aeiouyh]/.test(normalizeSearch(plant.name.fr)) ? 'ta ' : 'ton ';
    assert.ok(possessivePlant(plant, 'fr').startsWith(expected), plant.id);
    assert.ok(possessivePlant(plant, 'en').startsWith('your '), plant.id);
  }
  assert.equal(possessivePlant(find('monstera'), 'fr'), 'ta Monstera');
  assert.equal(possessivePlant(find('cactus'), 'fr'), 'ton cactus');
  assert.equal(possessivePlant(find('orchid'), 'fr'), 'ton orchidée');
  assert.equal(possessivePlant(find('echeveria'), 'fr'), 'ton échévéria');
  assert.equal(possessivePlant(find('fern'), 'fr'), 'ta fougère de Boston');
  assert.equal(possessivePlant(find('cactus'), 'en'), 'your cactus');
  assert.equal(possessivePlant(find('orchid'), 'en'), 'your orchid');
  assert.equal(possessivePlant(find('zz'), 'en'), 'your ZZ plant');
  assert.equal(possessivePlant(find('fern'), 'en'), 'your Boston fern');
});
