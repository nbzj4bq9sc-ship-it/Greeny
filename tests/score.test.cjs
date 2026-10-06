const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const { calculateScore, verdictIndex } = require('../score.js');
const plants = JSON.parse(vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../plants.js'), 'utf8') + '; JSON.stringify(plants)'));
const find = id => plants.find(plant => plant.id === id);
const score = (id, water, light, drainage = 'drained') => calculateScore(find(id), { water, light, drainage });

test('names identify familiar houseplants, without duplicate taxa or garden fillers', () => {
  assert.equal(find('orchid').name.fr, 'Orchidée');
  assert.equal(find('orchid').name.en, 'Orchid');
  assert.equal(find('orchid').botanical, 'Phalaenopsis');
  assert.equal(find('aloe').name.fr, 'Aloe vera');
  assert.equal(find('pothos').botanical, 'Epipremnum aureum');
  assert.equal(find('chamaedorea').name.fr, 'Palmier de salon');
  assert.equal(find('rhapis').name.fr, 'Rhapis');
  for (const key of ['id', 'botanical']) assert.equal(new Set(plants.map(p => p[key])).size, plants.length);
  for (const language of ['fr', 'en']) assert.equal(new Set(plants.map(p => p.name[language])).size, plants.length);
  for (const id of ['lavender', 'rosemary', 'mint', 'basil', 'thyme', 'parsley', 'sage', 'hydrangea', 'bougainvillea', 'fatsia', 'begonia']) assert.equal(find(id), undefined);
});

test('source-backed profiles fit the available answers without contradictory light preferences', () => {
  for (const plant of plants) {
    assert.ok(['dry', 'surface', 'moist', 'tank'].includes(plant.water), plant.id);
    assert.ok(plant.light.ideal.length, plant.id);
    const light = [...plant.light.ideal, ...plant.light.tolerated, ...plant.light.avoid];
    assert.equal(new Set(light).size, light.length, plant.id);
    assert.ok(light.every(value => ['low', 'indirect', 'partial', 'sun'].includes(value)), plant.id);
    assert.ok(plant.note.fr && plant.note.en, plant.id);
    assert.match(plant.sourceUrl, /^https:\/\/plants\.ces\.ncsu\.edu\/plants\/[^/]+\/$/, plant.id);
    assert.ok(!('temperature' in plant), 'no invented temperature target');
  }
});

test('ZZ distinguishes preferred, tolerated and unsuitable light', () => {
  assert.equal(score('zz', 'dry', 'indirect').score, 100);
  assert.equal(score('zz', 'dry', 'low').score, 90);
  const sun = score('zz', 'dry', 'sun');
  assert.equal(sun.score, 60);
  assert.deepEqual(sun.issues, [{ type: 'lightHarsh', points: 40 }]);
});

test('equally suitable conditions are not penalised just to create more score values', () => {
  assert.equal(score('peace', 'moist', 'low').score, 100);
  assert.equal(score('orchid', 'surface', 'low').score, 100);
  assert.equal(score('orchid', 'surface', 'indirect').score, 100);
  assert.equal(score('kalanchoe', 'dry', 'partial').score, 100);
  assert.equal(score('kalanchoe', 'dry', 'sun').score, 60);
});

test('watering distinguishes a nearby routine from the opposite moisture habit', () => {
  assert.equal(score('aloe', 'dry', 'sun').score, 100);
  assert.equal(score('aloe', 'surface', 'sun').score, 80);
  assert.deepEqual(score('aloe', 'moist', 'sun'), { score: 60, issues: [{ type: 'waterTooWet', points: 40 }] });
  assert.equal(score('fern', 'surface', 'indirect').score, 80);
  assert.deepEqual(score('fern', 'dry', 'indirect').issues, [{ type: 'waterTooDry', points: 40 }]);
});

test('forest cacti are not given the desert cactus routine', () => {
  assert.equal(score('cactus', 'dry', 'sun').score, 100);
  assert.equal(score('schlumbergera', 'moist', 'indirect').score, 100);
  assert.equal(score('schlumbergera', 'dry', 'sun').score, 20);
  assert.equal(score('rhipsalis', 'surface', 'indirect').score, 100);
});

test('specific drying limits and tolerances override a generic neighbouring category', () => {
  assert.equal(score('curio', 'dry', 'indirect').score, 60);
  assert.equal(score('platycerium', 'dry', 'indirect').score, 60);
  assert.equal(score('yucca', 'dry', 'sun').score, 90);
});

test('Guzmania separates an empty central cup from constantly wet roots', () => {
  assert.equal(score('bromeliad', 'tank', 'indirect').score, 100);
  assert.deepEqual(score('bromeliad', 'dry', 'indirect').issues, [{ type: 'tankEmpty', points: 20 }]);
  assert.deepEqual(score('bromeliad', 'moist', 'indirect').issues, [{ type: 'tankRootsWet', points: 40 }]);
  assert.deepEqual(score('bromeliad', 'tank', 'indirect', 'wet').issues, [{ type: 'drainageWet', points: 30 }]);
});

test('drainage changes both the score and the practical diagnosis', () => {
  assert.deepEqual(score('pothos', 'dry', 'indirect', 'unknown'), { score: 90, issues: [{ type: 'drainageUnknown', points: 10 }] });
  assert.deepEqual(score('pothos', 'dry', 'indirect', 'wet'), { score: 70, issues: [{ type: 'drainageWet', points: 30 }] });
  assert.equal(score('aloe', 'moist', 'low', 'wet').score, 0);
});

test('all valid combinations stay coarse and bounded; fixing drainage never worsens a result', () => {
  const observed = new Set();
  for (const plant of plants) {
    for (const water of plant.water === 'tank' ? ['dry', 'tank', 'moist'] : ['dry', 'surface', 'moist']) {
      for (const light of ['low', 'indirect', 'partial', 'sun']) {
        const scores = ['drained', 'unknown', 'wet'].map(drainage => calculateScore(plant, { water, light, drainage }));
        for (const result of scores) {
          assert.ok(result.score >= 0 && result.score <= 100, plant.id);
          assert.equal(result.score % 10, 0, 'no made-up decimal precision');
          assert.equal(result.score, Math.max(0, 100 - result.issues.reduce((total, issue) => total + issue.points, 0)));
          observed.add(result.score);
        }
        assert.ok(scores[0].score >= scores[1].score && scores[1].score >= scores[2].score, plant.id);
        assert.deepEqual(scores[1].issues.filter(issue => !issue.type.startsWith('drainage')), scores[0].issues);
      }
    }
  }
  for (const score of [60, 70, 80, 90]) assert.ok(observed.has(score), 'more than three outcome values');
});

test('verdict bands change at the documented thresholds', () => {
  assert.deepEqual([0, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(verdictIndex), [0, 0, 1, 1, 2, 2, 3, 3, 4, 4]);
});
