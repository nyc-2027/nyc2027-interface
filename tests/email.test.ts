import test from 'node:test';
import assert from 'node:assert/strict';
import { confirmationEmail, type EmailPayload } from '../src/lib/email-template';
const payload: EmailPayload = { order: { id: 'NYC27-1234567890ABCDEF', name: '<script>hello</script>', email: 'test@example.com', phone: '0901234567', chapter: 'JCI Hà Nội', note: '', member: 'member', tier: 'priority', addons: ['bus'], total: 2450000, createdAt: '', status: 'pending' }, payment: { amount: 2450000, account: '1050120408', accountName: 'CLB DOANH NHAN TRE THE GIOI TAI VIET NAM', transferContent: 'JCITL NYC TEST 1234567890ABCDEF' } };
test('registration email escapes guest input and explicitly leaves payment unconfirmed', () => {
  const email = confirmationEmail(payload, 'registered');
  assert.ok(email.html.includes('&lt;script&gt;'));
  assert.ok(!email.html.includes('<script>'));
  assert.ok(email.text.includes('chưa được xác nhận'));
  assert.ok(email.text.includes(payload.payment.transferContent));
});
test('confirmed email acknowledges reconciliation; English package uses English content', () => {
  const paid = confirmationEmail(payload, 'confirmed');
  assert.ok(paid.text.includes('BTC đã đối soát'));
  assert.ok(!paid.text.includes('chưa được xác nhận'));
  const english = confirmationEmail({ ...payload, order: { ...payload.order, currency: 'USD', internationalPackageId: 'delegate', total: 295 } }, 'registered');
  assert.ok(english.subject.includes('Registration received'));
  assert.ok(english.text.includes('Delegate Package'));
});
test('HTML email includes inline logo, group ticket count and rounded villa count', () => {
  const email = confirmationEmail({ ...payload, order: { ...payload.order, quantity: 9, addons: ['villa15', 'villa16'] } }, 'registered');
  assert.ok(email.html.includes('cid:nyc-logo'));
  assert.ok(email.text.includes('Số vé: 9'));
  assert.ok(email.text.includes('Số căn villa 15/01: 2'));
});
