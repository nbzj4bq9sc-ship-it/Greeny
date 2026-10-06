'use strict';

function calculateScore(plant, { water, light, drainage }) {
  const issues = [];
  const add = (type, points) => issues.push({ type, points });

  if (water !== plant.water) {
    if (plant.waterTolerated?.includes(water)) add('waterTolerated', 10);
    else if (plant.water === 'tank') add(water === 'dry' ? 'tankEmpty' : 'tankRootsWet', water === 'dry' ? 20 : 40);
    else {
      const levels = ['dry', 'surface', 'moist'];
      const difference = levels.indexOf(water) - levels.indexOf(plant.water);
      const points = Math.abs(difference) === 2 || plant.waterAvoid?.includes(water) ? 40 : 20;
      add(difference > 0 ? 'waterTooWet' : 'waterTooDry', points);
    }
  }

  if (!plant.light.ideal.includes(light)) {
    if (plant.light.tolerated.includes(light)) add('lightTolerated', 10);
    else if (plant.light.avoid.includes(light)) add(light === 'low' ? 'lightLow' : 'lightHarsh', 40);
    else add(light === 'low' ? 'lightLow' : 'lightNotIdeal', 20);
  }

  if (drainage === 'wet') add('drainageWet', 30);
  else if (drainage === 'unknown') add('drainageUnknown', 10);

  return { score: Math.max(0, 100 - issues.reduce((sum, issue) => sum + issue.points, 0)), issues };
}

function verdictIndex(score) {
  return score >= 90 ? 4 : score >= 70 ? 3 : score >= 50 ? 2 : score >= 30 ? 1 : 0;
}

// One entry per care topic: a diagnosis and its plant-specific action stay together.
function buildAdvice(plant, issues, language) {
  const copy = translations[language];
  const water = plant.care?.water?.[language] || copy.careWater[plant.water];
  const light = plant.care?.light?.[language] || copy.lightAdvice.replace('{light}',
    plant.light.ideal.map(value => copy.careLight[value]).join(copy.lightOr));
  const entries = issues.map(issue => ({
    topic: issue.type.startsWith('light') ? 'light' : issue.type.startsWith('drainage') ? 'drainage' : 'water',
    text: copy.issues[issue.type].replace('{water}', water).replace('{light}', light),
  }));
  for (const [topic, text] of Object.entries({ water, light })) {
    if (!entries.some(entry => entry.topic === topic)) entries.push({ topic, text });
  }
  if (plant.care?.extra) entries.push({ topic: 'extra', text: plant.care.extra[language] });
  return entries;
}

if (typeof module !== 'undefined') module.exports = { calculateScore, verdictIndex, buildAdvice };
