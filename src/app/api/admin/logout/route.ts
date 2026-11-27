import { cookies } from 'next/headers';
import { adminCookie, sameOrigin } from '@/lib/admin-auth';
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  (await cookies()).delete(adminCookie);
  return Response.json({ ok: true });
}
