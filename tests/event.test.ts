import test from 'node:test';
import assert from 'node:assert/strict';
import { addons, groupServices, addonsForMode, calculateTotal, comboPrice, currentTier, servicesForMode, orderMoney, confirmedRevenue, type Order } from '../src/lib/event';
import { internationalPackages, indicativeUsdRate } from '../src/lib/international';
import { program } from '../src/lib/agenda';

test('combo prices match all four published member and non-member prices', () => {
  assert.equal(comboPrice('priority', 'member'), 1950000);
  assert.equal(comboPrice('priority', 'non-member'), 2050000);
  assert.equal(comboPrice('impactor', 'member'), 2200000);
  assert.equal(comboPrice('impactor', 'non-member'), 2300000);
});
test('total includes each selected service once and ignores unknown service IDs', () => {
  assert.equal(calculateTotal('priority', 'member', []), 1950000);
  assert.equal(calculateTotal('priority', 'member', ['bus', 'stay15', 'stay16']), 4190000);
  assert.equal(calculateTotal('priority', 'non-member', ['bus', 'bus', 'unknown']), 2550000);
  assert.equal(calculateTotal('impactor', 'member', addons.map(a => a.id)), 25090000);
});
test('Priority ends at midnight Vietnam time after December 12', () => {
  assert.equal(currentTier(new Date('2026-12-12T23:59:59+07:00')), 'priority');
  assert.equal(currentTier(new Date('2026-12-13T00:00:00+07:00')), 'impactor');
});
test('accommodation visibility follows travel mode and free events do not add fees', () => {
  assert.ok(!addonsForMode('individual').some(a => a.id.startsWith('villa')));
  assert.ok(!addonsForMode('group').some(a => a.id.startsWith('stay')));
  assert.equal(calculateTotal('priority', 'member', ['ga01', 'thanglong', 'awards']), 1950000);
  assert.equal(calculateTotal('priority', 'member', ['tour15', 'mineral']), 2800000);
});

test('full-option group includes every service without duplicates; individual preserves choices', () => {
  assert.deepEqual(servicesForMode('group', []), groupServices);
  assert.equal(calculateTotal('priority', 'member', servicesForMode('group', [])), 23100000);
  assert.equal(calculateTotal('priority', 'non-member', servicesForMode('group', ['bus', 'golf'])), 23200000);
  assert.equal(calculateTotal('impactor', 'member', servicesForMode('group', [])), 23350000);
  assert.equal(calculateTotal('priority', 'member', servicesForMode('individual', [])), 1950000);
  assert.deepEqual(servicesForMode('individual', ['tour15']), ['tour15']);
});

test('international registrations have only the two poster packages with fixed USD prices', () => {
  assert.deepEqual(internationalPackages.map(item => [item.id, item.price]), [['delegate', 295], ['experience', 350]]);
  assert.equal(295 * indicativeUsdRate, 7670000);
  assert.equal(350 * indicativeUsdRate, 9100000);
});

test('confirmed revenue keeps USD and legacy VND orders in their own currencies', () => {
  const base: Order = { id: 'demo', name: 'Test', email: 'test@example.com', phone: '12345678', chapter: '', note: '', tier: 'priority', member: 'member', addons: [], total: 1950000, status: 'confirmed', createdAt: '2026-11-23T00:00:00Z' };
  const usdOrder: Order = { ...base, id: 'international', total: 295, currency: 'USD', internationalPackageId: 'delegate' };
  assert.equal(orderMoney(usdOrder), '$295 USD');
  assert.equal(confirmedRevenue([base, usdOrder]), `${orderMoney(base)} · $295 USD`);
  assert.equal(confirmedRevenue([base, { ...usdOrder, status: 'pending' }]), orderMoney(base));
});

test('program follows the eight sessions and times supplied in Agenda.md', () => {
  assert.deepEqual(program.map(day => day.sessions.map(session => session.time)), [
    ['14:00', '19:00'], ['07:00', '08:30', '13:00', '19:00'], ['07:30', '08:00'],
  ]);
  assert.equal(program[1].sessions[0].module, true);
  assert.equal(program[2].sessions[1].module, true);
  assert.equal(program.flatMap(day => day.sessions).every(session => session.name.vi && session.name.en && session.description.vi && session.description.en), true);
});
