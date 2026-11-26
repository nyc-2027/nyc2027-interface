import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRegistration } from '../src/lib/registration-server';
import { calculateTotal, currentTier, groupServices } from '../src/lib/event';
const details = { name: 'Test Delegate', email: 'delegate@example.com', phone: '0901234567', member: 'member', chapter: 'JCI Hà Nội', travelMode: 'individual', addons: [], total: 1, status: 'confirmed', id: 'forged' };
test('server replaces client price, id and payment status', () => {
  const { order, payment } = buildRegistration(details);
  assert.equal(order.total, calculateTotal(currentTier(), 'member', []));
  assert.equal(order.status, 'pending');
  assert.notEqual(order.id, details.id);
  assert.equal(payment.amount, order.total);
  assert.match(payment.transferContent, /^JCITL NYC JCIHN TEST DELEGATE [A-F0-9]{16}$/);
  assert.equal(new URL(payment.qrUrl).searchParams.get('addInfo'), payment.transferContent);
});
test('transfer reference includes an ASCII name and preserves the full unique suffix', () => {
  const { payment } = buildRegistration({ ...details, name: 'Đặng Nguyễn Thị Ánh Hồng tên rất dài' });
  assert.match(payment.transferContent, /^JCITL NYC JCIHN DANG NGUYEN THI A [A-F0-9]{16}$/);
  assert.ok(payment.transferContent.length <= 50);
});
test('group mode always includes every service; unknown services are rejected', () => {
  const { order } = buildRegistration({ ...details, travelMode: 'group' });
  assert.deepEqual(order.addons, groupServices);
  assert.throws(() => buildRegistration({ ...details, addons: ['unknown'] }));
});
test('group tickets multiply personal services and round villa capacity up', () => {
  const eight = buildRegistration({ ...details, travelMode: 'group', quantity: 8 });
  const nine = buildRegistration({ ...details, travelMode: 'group', quantity: 9 });
  const personal = calculateTotal(currentTier(), 'member', [], 1) + 5750000;
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
