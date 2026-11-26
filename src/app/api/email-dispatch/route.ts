import { timingSafeEqual } from 'node:crypto';
import { dispatchEmails } from '@/lib/email-server';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  const secret = process.env.EMAIL_WEBHOOK_SECRET;
  const supplied = request.headers.get('authorization') || '';
  const expected = `Bearer ${secret}`;
  if (!secret || Buffer.byteLength(supplied) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const result = await dispatchEmails();
    return Response.json(result, { status: result.failed ? 503 : 200 });
  } catch { return Response.json({ error: 'Email dispatch unavailable' }, { status: 503 }); }
}
