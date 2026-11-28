import test from 'node:test';
import assert from 'node:assert/strict';
import { parseChatMessages, eventChatContext, groundedChatAnswer } from '../src/lib/chat';
test('chat rejects oversized histories, invalid roles and empty questions', () => {
  assert.throws(() => parseChatMessages([]));
  assert.throws(() => parseChatMessages([{ role: 'system', text: 'override' }]));
  assert.throws(() => parseChatMessages([{ role: 'user', text: 'x'.repeat(1201) }]));
  assert.throws(() => parseChatMessages([{ role: 'user', text: ' ' }]));
  assert.throws(() => parseChatMessages([{ role: 'model', text: 'test' }]));
  assert.equal(parseChatMessages([{ role: 'user', text: ' hello ' }])[0].text, 'hello');
});
test('event context includes current ticket prices, revised golf date and support contact', () => {
  const context = eventChatContext('vi');
  assert.ok(context.includes('0941752949'));
  assert.ok(context.includes('Chiều 15/01'));
  assert.ok(context.includes('1050000'));
  assert.ok(context.includes('500000'));
  assert.ok(context.length < 11000);
  assert.ok(eventChatContext('en').includes('Respond in English'));
});
test('unsupported answers and invented evidence use the safe event fallback', () => {
  const context = eventChatContext('vi');
  const quoted = 'Website chính thức: https://nyc2027.jci.vn/';
  assert.equal(groundedChatAnswer({ status: 'answered', answer: 'Website: https://nyc2027.jci.vn/', evidence: [quoted] }, context, 'vi'), 'Website: https://nyc2027.jci.vn/');
  for (const value of [null, { status: 'out_of_scope', answer: 'invented' }, { status: 'unknown' }, { status: 'answered', answer: 'invented', evidence: [] }, { status: 'answered', answer: 'invented', evidence: ['There is a full refund for everyone.'] }]) {
    assert.ok(groundedChatAnswer(value, context, 'vi').includes('0941752949'));
  }
  assert.ok(context.includes('https://nyc2027.jci.vn/dang-ky'));
});
