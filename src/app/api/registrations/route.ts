import { randomBytes } from 'node:crypto';
import { buildRegistration, digest, supabase } from '@/lib/registration-server';
import { dispatchEmails } from '@/lib/email-server';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  if (Number(request.headers.get('content-length')) > 16000) return Response.json({ error: 'Request too large' }, { status: 413 });
  let booking;
  try { booking = buildRegistration(await request.json()); }
  catch { return Response.json({ error: 'Please check your registration details.' }, { status: 400 }); }
  const token = randomBytes(32).toString('hex');
  try {
    await supabase('rest/v1/registrations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: booking.order.id, order_data: booking.order, payment_data: booking.payment, access_token_hash: digest(token) }) });
    let emailStatus = 'queued';
    try { const delivery = await dispatchEmails(booking.order.id); if (delivery.sent) emailStatus = 'sent'; } catch { /* The durable outbox can be retried after configuration or provider recovery. */ }
    return Response.json({ ...booking, token, emailStatus }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch { return Response.json({ error: 'Registration service unavailable. Please try again later.' }, { status: 503 }); }
}
