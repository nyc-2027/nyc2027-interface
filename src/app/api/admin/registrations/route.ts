import { currentAdmin } from '@/lib/admin-auth';
import { registrationPage } from '@/lib/admin-registrations';
export async function GET(request: Request) {
  if (!await currentAdmin()) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const params = new URL(request.url).searchParams;
  const page = Math.max(1, Math.floor(Number(params.get('page')) || 1));
  try { return Response.json({ ...await registrationPage(params, (page - 1) * 50), page }, { headers: { 'Cache-Control': 'no-store' } }); }
  catch { return Response.json({ error: 'Không tải được danh sách đăng ký.' }, { status: 503 }); }
}
