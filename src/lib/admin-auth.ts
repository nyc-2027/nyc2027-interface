import { cookies } from 'next/headers';
export const adminCookie = 'nyc-admin-session';
export function isAdminEmail(email: string) {
  return (process.env.ADMIN_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean).includes(email.toLowerCase());
}
export async function currentAdmin() {
  const token = (await cookies()).get(adminCookie)?.value;
  if (!token || !process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  try {
    const response = await fetch(`${process.env.SUPABASE_URL.replace(/\/$/, '')}/auth/v1/user`, { headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${token}` }, cache: 'no-store' });
    if (!response.ok) return null;
    const user = await response.json();
    return user.email && user.email_confirmed_at && isAdminEmail(user.email) ? { id: user.id, email: user.email as string } : null;
  } catch { return null; }
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  return !!origin && origin === new URL(request.url).origin;
}
