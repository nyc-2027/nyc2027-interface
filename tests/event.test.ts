import test from 'node:test';
import assert from 'node:assert/strict';
import { addons, calculateTotal, comboPrice, currentTier, servicesForMode } from '../src/lib/event';

test('combo prices match all four published member and non-member prices', () => {
  assert.equal(comboPrice('priority', 'member'), 1950000);
  assert.equal(comboPrice('priority', 'non-member'), 2050000);
  assert.equal(comboPrice('impactor', 'member'), 2200000);
  assert.equal(comboPrice('impactor', 'non-member'), 2300000);
});
test('total includes each selected service once and ignores unknown service IDs', () => {
  assert.equal(calculateTotal('priority', 'member', []), 1950000);
  assert.equal(calculateTotal('priority', 'member', ['bus', 'stay15', 'stay16']), 4550000);
  assert.equal(calculateTotal('priority', 'non-member', ['bus', 'bus', 'unknown']), 2550000);
  assert.equal(calculateTotal('impactor', 'member', addons.map(a => a.id)), 10200000);
});
test('Priority ends at midnight Vietnam time after December 12', () => {
  assert.equal(currentTier(new Date('2026-12-12T23:59:59+07:00')), 'priority');
  assert.equal(currentTier(new Date('2026-12-13T00:00:00+07:00')), 'impactor');
});

test('full-option group includes every service without duplicates; individual preserves choices', () => {
  assert.deepEqual(servicesForMode('group', []), addons.map(addon => addon.id));
  assert.equal(calculateTotal('priority', 'member', servicesForMode('group', [])), 9950000);
  assert.equal(calculateTotal('priority', 'non-member', servicesForMode('group', ['bus', 'golf'])), 10050000);
  assert.equal(calculateTotal('impactor', 'member', servicesForMode('group', [])), 10200000);
  assert.equal(calculateTotal('priority', 'member', servicesForMode('individual', [])), 1950000);
  assert.deepEqual(servicesForMode('individual', ['tour15']), ['tour15']);
});
