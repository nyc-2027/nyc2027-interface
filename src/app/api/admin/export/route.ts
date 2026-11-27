import { currentAdmin } from '@/lib/admin-auth';
import { registrationPage } from '@/lib/admin-registrations';
import { registrationWorkbook, appendRegistration } from '@/lib/admin-excel';
export const runtime = 'nodejs';
export async function GET(request: Request) {
  if (!await currentAdmin()) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { workbook, sheet } = registrationWorkbook();
    const params = new URL(request.url).searchParams;
    let offset = 0;
    for (;;) {
      const { rows, total } = await registrationPage(params, offset, 500);
      for (const row of rows) appendRegistration(sheet, row);
      offset += rows.length;
      if (offset >= total) break;
      if (!rows.length) throw new Error('Incomplete export');
    }
    const bytes = await workbook.xlsx.writeBuffer();
    return new Response(new Uint8Array(bytes), { headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Content-Disposition': `attachment; filename="NYC2027-registrations-${new Date().toISOString().slice(0,10)}.xlsx"`, 'Cache-Control': 'no-store' } });
  } catch { return Response.json({ error: 'Không xuất được Excel. Vui lòng thử lại.' }, { status: 503 }); }
}
