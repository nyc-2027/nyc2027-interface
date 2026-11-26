import { randomUUID } from 'node:crypto';
import { digest, supabase } from '@/lib/registration-server';
export const runtime = 'nodejs';
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = request.headers.get('authorization')?.replace(/^Bearer /, '') || '';
  if (!/^NYC27-[A-F0-9]{16}$/.test(id) || !/^[a-f0-9]{64}$/.test(token)) return Response.json({ error: 'Invalid registration access' }, { status: 403 });
  if (Number(request.headers.get('content-length')) > 3200000) return Response.json({ error: 'Maximum upload size: 3 MB' }, { status: 413 });
  try {
    const filter = `id=eq.${id}&access_token_hash=eq.${digest(token)}`;
    const records = await (await supabase(`rest/v1/registrations?${filter}&select=id,status`)).json();
    if (!records.length) return Response.json({ error: 'Registration not found' }, { status: 404 });
    if (records[0].status !== 'pending') return Response.json({ status: records[0].status });
    const form = await request.formData();
    const file = form.get('receipt');
    let receiptPath: string | null = null;
    if (file instanceof File && file.size) {
      const bytes = Buffer.from(await file.arrayBuffer());
      const png = bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
      const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
      if (file.size > 3 * 1024 * 1024 || (!png && !jpeg)) return Response.json({ error: 'Please upload a JPEG or PNG image, maximum 3 MB.' }, { status: 400 });
      receiptPath = `${id}/${randomUUID()}.${png ? 'png' : 'jpg'}`;
      await supabase(`storage/v1/object/payment-receipts/${receiptPath}`, { method: 'POST', headers: { 'Content-Type': png ? 'image/png' : 'image/jpeg' }, body: bytes });
    }
    await supabase(`rest/v1/registrations?${filter}&status=eq.pending`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'reported', receipt_path: receiptPath, reported_at: new Date().toISOString() }) });
    return Response.json({ status: 'reported' });
  } catch { return Response.json({ error: 'Could not report payment. Please try again.' }, { status: 503 }); }
}
