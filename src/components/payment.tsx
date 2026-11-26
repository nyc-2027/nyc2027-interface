'use client';
import { useState } from 'react';
import { money } from '@/lib/event';
import type { Booking } from '@/lib/registration-client';
export default function Payment({ booking, english = false }: { booking: Booking; english?: boolean }) {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [reported, setReported] = useState(false);
  const [error, setError] = useState('');
  const p = booking.payment;
  async function report() {
    setBusy(true); setError('');
    try {
      const form = new FormData(); if (file) form.set('receipt', file);
      const response = await fetch(`/api/registrations/${booking.order.id}/payment`, { method: 'POST', headers: { Authorization: `Bearer ${booking.token}` }, body: form });
      const data = await response.json(); if (!response.ok) throw new Error(data.error);
      setReported(true);
    } catch { setError(english ? 'Unable to report payment. Please retry. Use a JPEG/PNG under 3 MB.' : 'Chưa gửi được thông báo. Vui lòng thử lại; ảnh cần là JPEG/PNG dưới 3 MB.'); }
    finally { setBusy(false); }
  }
  return <div className="registration-content payment-content"><div className="order-success"><h3>{english ? 'Registration created' : 'Đăng ký thành công'}</h3><p>{booking.order.name} · {booking.order.id}</p><p>{english ? 'Tickets' : 'Số vé'}: {booking.order.quantity ?? 1}</p></div><div className="qr-layout live-payment-qr"><div><img src={p.qrUrl} className="payment-qr-image" width={420} height={546} alt="VietQR" /><a href={p.qrUrl} target="_blank" rel="noreferrer">{english ? 'Open payment QR' : 'Mở mã QR thanh toán'}</a></div><div className="payment-info"><strong className="payment-total">{money(p.amount)}</strong><p>Vietcombank · {p.account}</p><p>{p.accountName}</p><label>{english ? 'Transfer reference' : 'Nội dung chuyển khoản'}</label><strong className="transfer-reference">{p.transferContent}</strong>{p.exchangeRate && <p>1 USD = {money(p.exchangeRate)} · {booking.order.total} USD</p>}<p>{english ? 'Use the exact amount and reference. Payment is confirmed only after COC reconciliation.' : 'Chuyển đúng số tiền và nội dung. Thanh toán chỉ được xác nhận sau khi BTC đối soát.'}</p></div></div><label className="field payment-receipt-field">{english ? 'Transfer receipt (optional, JPEG/PNG, max. 3 MB)' : 'Ảnh chuyển khoản (không bắt buộc, JPEG/PNG, tối đa 3 MB)'}<input type="file" accept="image/jpeg,image/png" disabled={busy || reported} onChange={e => setFile(e.target.files?.[0] || null)} /></label>{error && <p role="alert" className="form-error">{error}</p>}<button className="button navy full" disabled={busy || reported} onClick={report}>{busy ? (english ? 'Sending…' : 'Đang gửi…') : reported ? (english ? 'Payment reported · Awaiting verification' : 'Đã thông báo · Chờ BTC đối soát') : (english ? 'Finish' : 'Hoàn tất')}</button></div>;
}
