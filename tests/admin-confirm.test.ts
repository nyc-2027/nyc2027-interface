import test from 'node:test';
import assert from 'node:assert/strict';
import { confirmRegistration } from '../src/lib/admin-confirm';
test('admin confirmation atomically updates only unconfirmed orders and records the admin', async () => {
  const originalFetch = globalThis.fetch;
  const oldUrl = process.env.SUPABASE_URL; const oldKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.SUPABASE_URL = 'https://example.test'; process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-only';
  const id = 'NYC27-1234567890ABCDEF'; const admin = '00000000-0000-4000-8000-000000000001';
  const calls: { url: string; init?: RequestInit }[] = [];
  try {
    globalThis.fetch = async (url, init) => { calls.push({ url: String(url), init }); return Response.json([{ id, status: 'confirmed' }]); };
    const first = await confirmRegistration(id, admin);
    assert.equal(first?.changed, true);
    assert.ok(calls[0].url.includes('status=in.(pending,reported)'));
    const update = JSON.parse(calls[0].init!.body as string);
    assert.equal(update.confirmed_by, admin); assert.equal(update.status, 'confirmed');
    assert.ok(Number.isFinite(Date.parse(update.confirmed_at)));
    calls.length = 0;
    globalThis.fetch = async (url, init) => { calls.push({ url: String(url), init }); return Response.json(init?.method === 'PATCH' ? [] : [{ id, status: 'confirmed' }]); };
    const repeated = await confirmRegistration(id, admin);
    assert.equal(repeated?.changed, false); assert.equal(calls.length, 2);
    globalThis.fetch = async () => Response.json([]);
    assert.equal(await confirmRegistration(id, admin), null);
    await assert.rejects(confirmRegistration('bad-id', admin));
  } finally {
    globalThis.fetch = originalFetch;
    if (oldUrl === undefined) delete process.env.SUPABASE_URL; else process.env.SUPABASE_URL = oldUrl;
    if (oldKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY; else process.env.SUPABASE_SERVICE_ROLE_KEY = oldKey;
  }
});
