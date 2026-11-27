import { currentAdmin, sameOrigin } from '@/lib/admin-auth';
import { confirmRegistration } from '@/lib/admin-confirm';
import { dispatchEmails } from '@/lib/email-server';
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await currentAdmin();
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (!sameOrigin(request)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await params;
  if (!/^NYC27-[A-F0-9]{16}$/.test(id)) return Response.json({ error: 'Mã đăng ký không hợp lệ.' }, { status: 400 });
  try {
    const result = await confirmRegistration(id, admin.id);
    if (!result) return Response.json({ error: 'Không tìm thấy đơn đăng ký.' }, { status: 404 });
    let emailStatus = result.changed ? 'queued' : 'unchanged';
    if (result.changed) {
      try { const delivery = await dispatchEmails(id); if (!delivery.failed && delivery.sent) emailStatus = 'sent'; } catch { /* Status stays confirmed; email remains queued for retry. */ }
    }
    return Response.json({ ...result, emailStatus }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return Response.json({ error: 'Không xác nhận được. Vui lòng kiểm tra kết nối và migration V3 rồi thử lại.' }, { status: 503 }); }
}
