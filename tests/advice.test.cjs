const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const context = vm.createContext({});
for (const file of ['plants.js', 'translations.js', 'score.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context);
const evaluate = code => JSON.parse(vm.runInContext(`JSON.stringify(${code})`, context));

test('every combination has a single actionable entry per topic in both languages', () => {
  const profiles = evaluate('plants');
  for (const plant of profiles) {
    for (const language of ['fr', 'en']) {
      for (const water of plant.water === 'tank' ? ['dry', 'tank', 'moist'] : ['dry', 'surface', 'moist']) {
        for (const light of ['low', 'indirect', 'partial', 'sun']) {
          for (const drainage of ['drained', 'wet', 'unknown']) {
            const care = evaluate(`buildAdvice(plants.find(p => p.id === '${plant.id}'), calculateScore(plants.find(p => p.id === '${plant.id}'), ${JSON.stringify({water,light,drainage})}).issues, '${language}')`);
            assert.equal(new Set(care.map(c => c.topic)).size, care.length, plant.id);
            assert.equal(care.filter(c => c.topic === 'water').length, 1);
            assert.equal(care.filter(c => c.topic === 'light').length, 1);
            assert.equal(care.filter(c => c.topic === 'drainage').length, drainage === 'drained' ? 0 : 1);
            assert.ok(care.every(c => c.text && !/undefined|\{\w+\}/.test(c.text)), plant.id);
            assert.equal(new Set(care.map(c => c.text)).size, care.length);
          }
        }
      }
    }
  }
});

test('combined Aloe problems mention drying, light and standing water once, without a repeated general paragraph', () => {
  for (const language of ['fr', 'en']) {
    const care = evaluate(`buildAdvice(plants.find(p => p.id === 'aloe'), calculateScore(plants.find(p => p.id === 'aloe'), {water: 'moist', light: 'low', drainage: 'wet'}).issues, '${language}')`);
    assert.deepEqual(care.map(c => c.topic), ['water', 'light', 'drainage']);
    const joined = care.map(c => c.text).join(' ');
    assert.equal((joined.match(language === 'fr' ? /sécher/g : /dry/g) || []).length, 1);
    assert.equal((joined.match(language === 'fr' ? /soucoupe/g : /saucer/g) || []).length, 1);
  }
});

test('plant-specific care keeps useful seasonal and specialist instructions in their topic', () => {
  assert.match(evaluate("buildAdvice(plants.find(p => p.id === 'schlumbergera'), [], 'en')").find(c => c.topic === 'water').text, /after flowering/);
  assert.match(evaluate("buildAdvice(plants.find(p => p.id === 'orchid'), [], 'fr')").find(c => c.topic === 'water').text, /écorces/);
  assert.match(evaluate("buildAdvice(plants.find(p => p.id === 'ficus'), [], 'en')").find(c => c.topic === 'light').text, /moving/);
  const care = evaluate("buildAdvice(plants.find(p => p.id === 'bromeliad'), [{type:'tankRootsWet'}], 'fr')");
  assert.equal(care.filter(c => c.text.includes('coupe centrale')).length, 1);
  assert.ok(!JSON.stringify(evaluate('plants')).includes('substrat'));
});

test('new profiles match source-backed indoor routines without duplicating taxa', () => {
  const expected = { strelitzia: ['surface', 'indirect'], maculata: ['moist', 'indirect'], coffee: ['moist', 'indirect'], scindapsus: ['moist', 'indirect'], oxalis: ['surface', 'partial'], ginseng: ['moist', 'sun'] };
  for (const [id, [water, light]] of Object.entries(expected)) {
    const result = evaluate(`calculateScore(plants.find(p => p.id === '${id}'), {water:'${water}', light:'${light}', drainage:'drained'})`);
    assert.equal(result.score, 100, id);
  }
  const satin = evaluate("plants.find(p => p.id === 'scindapsus')");
  assert.equal(satin.botanical, 'Scindapsus pictus');
  assert.notEqual(satin.water, evaluate("plants.find(p => p.id === 'pothos')").water);
});
