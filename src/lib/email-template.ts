import { money, orderMoney, addons, serviceQuantity, type Order } from './event';
export type EmailPayload = { order: Order; payment: { amount: number; account: string; accountName: string; transferContent: string } };
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
export function confirmationEmail(payload: EmailPayload, kind: 'registered' | 'confirmed') {
  const { order, payment } = payload;
  const en = order.currency === 'USD';
  const paid = kind === 'confirmed';
  const heading = en ? (paid ? 'Payment confirmed' : 'Registration received') : (paid ? 'Xác nhận thanh toán thành công' : 'Đã nhận đăng ký tham dự');
  const services = order.currency === 'USD' ? `${order.internationalPackageId === 'experience' ? 'Experience' : 'Delegate'} Package` : [`${order.tier === 'priority' ? 'Priority ' : ''}Impactor`, ...addons.filter(a => order.addons.includes(a.id)).map(a => a.name)].join(' · ');
  const lines = [
    `${en ? 'Hello' : 'Xin chào'} ${order.name},`,
    en ? (paid ? 'The COC has verified your payment. See you at NYC 2027!' : 'Your registration has been saved. Payment has not yet been confirmed.') : (paid ? 'BTC đã đối soát và xác nhận thanh toán của bạn. Hẹn gặp bạn tại NYC 2027!' : 'Thông tin đăng ký đã được lưu. Thanh toán của bạn chưa được xác nhận.'),
    `${en ? 'Registration ID' : 'Mã đăng ký'}: ${order.id}`,
    `2027 JCI Vietnam New Year Convention`,
    `15–17.01.2027 · Wyndham Grand Vedana Ninh Bình`,
    `${en ? 'Package' : 'Gói tham dự'}: ${services}`,
    `${en ? 'Tickets' : 'Số vé'}: ${order.quantity ?? 1}`,
    ...order.addons.filter(id => id.startsWith('villa')).map(id => `${en ? 'Villas' : 'Số căn villa'} ${id === 'villa15' ? '15/01' : '16/01'}: ${serviceQuantity(id, order.quantity ?? 1)}`),
    `${en ? 'Package total' : 'Giá trị đăng ký'}: ${orderMoney(order)}`,
    `${en ? 'Transfer amount' : 'Số tiền chuyển khoản'}: ${money(payment.amount)}`,
    ...(!paid ? [`Vietcombank · ${payment.account}`, payment.accountName, `${en ? 'Transfer reference' : 'Nội dung chuyển khoản'}: ${payment.transferContent}`, en ? 'If you have already transferred, please wait for the COC to verify it. Do not pay again.' : 'Nếu đã chuyển khoản, vui lòng chờ BTC đối soát; không chuyển lại.'] : []),
  ];
  const subject = `NYC 2027 · ${heading} · ${order.id}`;
  const text = lines.join('\n\n');
  const e = escapeHtml;
  const rows = [[en ? 'Registration ID' : 'Mã đăng ký', order.id], [en ? 'Representative' : 'Người đại diện', order.name], ['Email', order.email], [en ? 'Tickets' : 'Số vé', String(order.quantity ?? 1)], [en ? 'Package' : 'Gói tham dự', services], ...order.addons.filter(id => id.startsWith('villa')).map(id => [id === 'villa15' ? 'Villa 15/01' : 'Villa 16/01', `${serviceQuantity(id, order.quantity ?? 1)} ${en ? 'villa(s)' : 'căn'}`]), [en ? 'Registration total' : 'Tổng giá trị đăng ký', orderMoney(order)]];
  const html = `<!doctype html><html lang="${en ? 'en' : 'vi'}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#30202a"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:28px 12px"><table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:100%;max-width:600px;background:#fff;border:1px solid #e7e1e3"><tr><td align="center" style="background:#690019;padding:28px"><img src="cid:nyc-logo" width="96" alt="JCI Vietnam" style="display:block;width:96px;height:auto;border:0"><p style="color:#f4cf86;margin:18px 0 0;font-size:22px;font-weight:bold">NYC 2027</p><p style="color:#fff;margin:8px 0 0;font-size:13px">Leading for Impact</p></td></tr><tr><td style="padding:30px 24px"><h1 style="font-size:23px;line-height:1.4;margin:0 0 22px;color:#690019">${e(heading)}</h1><p style="line-height:1.7">${e(lines[0])}</p><p style="line-height:1.7">${e(lines[1])}</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0;background:#faf7f8">${rows.map(([label,value]) => `<tr><td width="35%" style="padding:12px;font-size:13px;border-bottom:1px solid #eadfe3;vertical-align:top;color:#78656d">${e(label)}</td><td style="padding:12px;font-size:14px;border-bottom:1px solid #eadfe3;overflow-wrap:anywhere">${e(value)}</td></tr>`).join('')}</table>${!paid ? `<h2 style="font-size:18px;color:#690019">${en ? 'Bank transfer details' : 'Thông tin chuyển khoản'}</h2><p style="line-height:1.8">Vietcombank · ${e(payment.account)}<br>${e(payment.accountName)}</p><p style="font-size:23px;font-weight:bold">${e(money(payment.amount))}</p><p style="background:#f6edf0;padding:16px;line-height:1.7"><strong>${en ? 'Transfer reference' : 'Nội dung chuyển khoản'}</strong><br>${e(payment.transferContent)}</p><p style="font-size:13px;line-height:1.7">${e(lines[lines.length - 1])}</p>` : ''}<h2 style="font-size:18px;margin-top:28px">2027 JCI Vietnam New Year Convention</h2><p style="line-height:1.8">15–17.01.2027<br>Wyndham Grand Vedana Ninh Bình</p><p style="line-height:1.7;margin-top:28px">${en ? 'Kind regards,<br>NYC 2027 Organising Committee' : 'Trân trọng,<br>Ban Tổ chức NYC 2027'}</p></td></tr><tr><td align="center" style="padding:20px;background:#faf7f8;color:#806c75;font-size:12px;line-height:1.7">JCI Vietnam · NYC 2027<br>${en ? 'Please retain this email for your registration records.' : 'Vui lòng lưu email này để tra cứu thông tin đăng ký.'}</td></tr></table></td></tr></table></body></html>`;
  return { subject, text, html };
}
