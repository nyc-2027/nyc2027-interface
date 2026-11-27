import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRegistration } from '../src/lib/registration-server';
import { calculateTotal, currentTier } from '../src/lib/event';
const details = { name: 'Test Delegate', email: 'delegate@example.com', phone: '0901234567', member: 'member', chapter: 'JCI Hà Nội', travelMode: 'individual', addons: [], total: 1, status: 'confirmed', id: 'forged' };
test('server replaces client price, id and payment status', () => {
  const { order, payment } = buildRegistration(details);
  assert.equal(order.total, calculateTotal(currentTier(), 'member', []));
  assert.equal(order.status, 'pending');
  assert.notEqual(order.id, details.id);
  assert.equal(payment.amount, order.total);
  assert.match(payment.transferContent, /^JCITL NYC [A-F0-9]{16}$/);
  assert.equal(new URL(payment.qrUrl).searchParams.get('addInfo'), payment.transferContent);
});
test('transfer reference omits guest name and Chapter while preserving the full unique suffix', () => {
  const { payment } = buildRegistration({ ...details, name: 'Đặng Nguyễn Thị Ánh Hồng tên rất dài' });
  assert.match(payment.transferContent, /^JCITL NYC [A-F0-9]{16}$/);
  assert.equal(payment.transferContent.length, 26);
  const nonMember = buildRegistration({ ...details, member: 'non-member' });
  assert.match(nonMember.payment.transferContent, /^JCITL NYC [A-F0-9]{16}$/);
});
test('group mode keeps only selected services; unknown services are rejected', () => {
  const { order } = buildRegistration({ ...details, travelMode: 'group' });
  assert.deepEqual(order.addons, []);
  assert.throws(() => buildRegistration({ ...details, addons: ['unknown'] }));
});
test('group tickets multiply personal services and round villa capacity up', () => {
  const eight = buildRegistration({ ...details, travelMode: 'group', quantity: 8, addons: ['villa15', 'villa16', 'bus'] });
  const nine = buildRegistration({ ...details, travelMode: 'group', quantity: 9, addons: ['villa15', 'villa16', 'bus'] });
  const personal = calculateTotal(currentTier(), 'member', [], 1) + 500000;
  assert.equal(eight.order.total, personal * 8 + 15400000);
  assert.equal(nine.order.total, personal * 9 + 30800000);
  assert.equal(nine.order.quantity, 9);
  assert.equal(nine.payment.amount, nine.order.total);
  for (const quantity of [0, -1, 1.5, 1001, '8']) assert.throws(() => buildRegistration({ ...details, travelMode: 'group', quantity }));
});
test('international QR charges configured VND amount, retaining USD package price', () => {
  const { order, payment } = buildRegistration({ ...details, currency: 'USD', country: 'Singapore', internationalPackageId: 'experience' });
  assert.equal(order.total, 350);
  assert.equal(payment.amount, 350 * Number(process.env.USD_VND_RATE || 26000));
  assert.throws(() => buildRegistration({ ...details, email: 'invalid' }));
});
test('villa minimum, chapter and handicap are validated on the server', () => {
  assert.throws(() => buildRegistration({ ...details, travelMode: 'group', quantity: 7, addons: ['villa15'] }));
  assert.throws(() => buildRegistration({ ...details, chapter: 'Unknown' }));
  assert.throws(() => buildRegistration({ ...details, addons: ['golf'] }));
  assert.equal(buildRegistration({ ...details, addons: ['golf'], handicap: '12.5' }).order.handicap, '12.5');
  assert.throws(() => buildRegistration({ ...details, addons: ['golf'], handicap: '100' }));
  assert.equal(buildRegistration({ ...details, chapter: 'JCI Green' }).order.chapter, 'JCI Green');
});
test('group registration saves representative only and hotel charges each guest', () => {
  const { order } = buildRegistration({ ...details, travelMode: 'group', quantity: 4, addons: ['stay15'] });
  assert.equal(order.total, 4 * (calculateTotal(currentTier(), 'member', []) + 820000));
  assert.equal(order.name, details.name);
  assert.ok(!('attendees' in order));
});
test('hotel and villa cannot be booked together for the same night', () => {
  assert.throws(() => buildRegistration({ ...details, travelMode: 'group', quantity: 8, addons: ['stay15', 'villa15'] }));
  assert.doesNotThrow(() => buildRegistration({ ...details, travelMode: 'group', quantity: 8, addons: ['stay15', 'villa16'] }));
});
test('international golf adds exact VND fee, retains the selected add-on and validates handicap', () => {
  const base = { ...details, currency: 'USD', country: 'Singapore', internationalPackageId: 'delegate', addons: ['golf'], handicap: '12.5' };
  const result = buildRegistration(base);
  const rate = Number(process.env.USD_VND_RATE || 26000);
  assert.equal(result.payment.amount, Math.round(295 * rate) + 3000000);
  assert.equal(result.order.total, Math.round((295 + 3000000 / rate) * 100) / 100);
  assert.deepEqual(result.order.addons, ['golf']);
  assert.equal(result.order.handicap, '12.5');
  assert.throws(() => buildRegistration({ ...base, handicap: '' }));
  assert.throws(() => buildRegistration({ ...base, addons: ['bus'] }));
});
