import { currentAdmin, sameOrigin } from '@/lib/admin-auth';
import { supabase } from '@/lib/registration-server';
import { dispatchEmails } from '@/lib/email-server';
export async function POST(request: Request) {
  if (!await currentAdmin()) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (!sameOrigin(request)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  let id: string | null = null;
  try { const body = await request.json(); if (body.id !== undefined) { if (typeof body.id !== 'string' || !/^NYC27-[A-F0-9]{16}$/.test(body.id)) throw new Error(); id = body.id; } }
  catch { return Response.json({ error: 'Yêu cầu không hợp lệ.' }, { status: 400 }); }
  try {
    const queued = await (await supabase('rest/v1/rpc/queue_payment_reminders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ target_id: id }) })).json();
    if (queued > 0) { try { await dispatchEmails(id || undefined); } catch { /* Durable queue is retried by the existing dispatcher. */ } }
    return Response.json({ queued }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return Response.json({ error: 'Chưa tạo được lời nhắc. Kiểm tra migration V4 và thử lại.' }, { status: 503 }); }
}
