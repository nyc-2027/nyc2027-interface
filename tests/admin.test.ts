import test from 'node:test';
import assert from 'node:assert/strict';
import ExcelJS from 'exceljs';
import { registrationWorkbook, appendRegistration } from '../src/lib/admin-excel';
import { registrationFilters, type AdminRegistration } from '../src/lib/admin-registrations';
import { isAdminEmail } from '../src/lib/admin-auth';
test('admin authorization requires an explicitly allowlisted email', () => {
  const previous = process.env.ADMIN_EMAILS;
  try { process.env.ADMIN_EMAILS = ' admin@example.com, other@example.com'; assert.ok(isAdminEmail('ADMIN@example.com')); assert.ok(!isAdminEmail('guest@example.com')); process.env.ADMIN_EMAILS = ''; assert.ok(!isAdminEmail('admin@example.com')); }
  finally { if (previous === undefined) delete process.env.ADMIN_EMAILS; else process.env.ADMIN_EMAILS = previous; }
});
test('export produces a real XLSX with literal guest strings and authoritative payment status', async () => {
  const { workbook, sheet } = registrationWorkbook();
  const row: AdminRegistration = { id: 'NYC27-TEST', created_at: '2026-11-27T03:00:00Z', reported_at: null, receipt_path: null, status: 'reported', order_data: { id: 'NYC27-TEST', name: '=HYPERLINK("test")', email: 'guest@example.com', phone: '0901234567', chapter: 'JCI Hà Nội', note: '+123', member: 'member', tier: 'priority', addons: ['golf'], total: 4950000, quantity: 4, status: 'pending', createdAt: '', handicap: '12.5' }, payment_data: { amount: 4950000, transferContent: 'JCITL NYC TEST' } };
  appendRegistration(sheet, row);
  const buffer = await workbook.xlsx.writeBuffer();
  const restored = new ExcelJS.Workbook(); await restored.xlsx.load(buffer);
  const exported = restored.getWorksheet('Đăng ký')!;
  assert.equal(exported.getCell('C2').value, row.order_data.name);
  assert.equal(exported.getCell('C2').type, ExcelJS.ValueType.String);
  assert.equal(exported.getCell('E2').value, '0901234567');
  assert.equal(exported.getCell('I2').value, 4);
  assert.equal(exported.getCell('Q2').value, 'Chờ đối soát');
});
test('filters validate status and quote PostgREST search values', () => {
  const filters = registrationFilters(new URLSearchParams({ status: 'confirmed', q: 'A",status.eq.pending' }));
  assert.equal(filters.get('status'), 'eq.confirmed');
  assert.ok(filters.get('or')!.includes('A\\",status.eq.pending'));
  assert.ok(!registrationFilters(new URLSearchParams({ status: 'bad' })).has('status'));
});
