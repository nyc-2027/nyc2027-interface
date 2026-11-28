import ExcelJS from 'exceljs';
import { addons, programTicketLabel } from './event';
import type { AdminRegistration } from './admin-registrations';
export const registrationStatus = { pending: 'Chờ thanh toán', reported: 'Chờ đối soát', confirmed: 'Đã xác nhận' };
export function registrationWorkbook() {
  const workbook = new ExcelJS.Workbook(); workbook.creator = 'NYC 2027';
  const sheet = workbook.addWorksheet('Đăng ký', { views: [{ state: 'frozen', ySplit: 1 }] });
  const fields = [ ['id','Mã đăng ký',30], ['date','Ngày đăng ký (giờ VN)',25], ['name','Người đại diện',28], ['email','Email',32], ['phone','Điện thoại',22], ['chapter','Chapter / Đơn vị',25], ['country','Quốc gia',20], ['mode','Hình thức',20], ['quantity','Số vé',12], ['combo','Vé chương trình',40], ['services','Dịch vụ đã chọn',60], ['handicap','Handicap',14], ['total','Giá trị đăng ký',22], ['currency','Tiền tệ',12], ['amount','Số tiền cần chuyển (VND)',26], ['reference','Nội dung chuyển khoản',55], ['status','Trạng thái',22], ['receipt','Đường dẫn ảnh (private)',45], ['note','Ghi chú',50] ] as const;
  sheet.columns = fields.map(([key, header, width]) => ({ key, header, width }));
  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF690019' } };
  sheet.getRow(1).height = 28;
  sheet.autoFilter = 'A1:S1';
  return { workbook, sheet };
}
export function appendRegistration(sheet: ExcelJS.Worksheet, row: AdminRegistration) {
  const o = row.order_data;
  sheet.addRow({ id: row.id, date: new Date(row.created_at).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }), name: o.name, email: o.email, phone: o.phone, chapter: o.chapter, country: o.country || '', mode: o.currency === 'USD' ? 'Quốc tế' : o.travelMode === 'group' ? 'Theo đoàn' : 'Cá nhân', quantity: o.quantity ?? 1, combo: programTicketLabel(o), services: addons.filter(a => o.addons.includes(a.id)).map(a => a.name).join('; '), handicap: o.handicap || '', total: o.total, currency: o.currency || 'VND', amount: row.payment_data.amount, reference: row.payment_data.transferContent, status: registrationStatus[row.status], receipt: row.receipt_path || '', note: o.note });
  // Text is written as literal strings, never as executable Excel formulas.
  for (const key of ['id', 'phone', 'handicap', 'reference']) sheet.getRow(sheet.rowCount).getCell(key).numFmt = '@';
  for (const key of ['total', 'amount']) sheet.getRow(sheet.rowCount).getCell(key).numFmt = '#,##0.##';
}
