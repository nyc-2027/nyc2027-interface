import { cookies } from 'next/headers';
import { adminCookie, isAdminEmail, sameOrigin } from '@/lib/admin-auth';
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const { email, password } = await request.json();
    if (typeof email !== 'string' || typeof password !== 'string' || email.length > 180 || password.length > 512 || !isAdminEmail(email.trim())) return Response.json({ error: 'Thông tin đăng nhập không hợp lệ.' }, { status: 401 });
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return Response.json({ error: 'Chưa cấu hình dịch vụ đăng nhập.' }, { status: 503 });
    const response = await fetch(`${url.replace(/\/$/, '')}/auth/v1/token?grant_type=password`, { method: 'POST', headers: { apikey: key, 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.trim(), password }), cache: 'no-store' });
    const result = await response.json();
    if (!response.ok || !result.user?.email_confirmed_at || !isAdminEmail(result.user.email)) return Response.json({ error: 'Thông tin đăng nhập không hợp lệ hoặc tài khoản chưa được xác nhận.' }, { status: response.status === 429 ? 429 : 401 });
    (await cookies()).set(adminCookie, result.access_token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: Math.min(result.expires_in || 3600, 3600) });
    return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return Response.json({ error: 'Không đăng nhập được. Vui lòng thử lại.' }, { status: 503 }); }
}
