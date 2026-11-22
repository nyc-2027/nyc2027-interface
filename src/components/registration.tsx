'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { addons, calculateTotal, comboPrice, money, saveOrder, type MemberType, type Order, type Tier } from '@/lib/event';
import { Check, Copy, Gift, ShieldCheck, ShoppingBag, X } from './icon';

type Props = { member: MemberType; setMember: (member: MemberType) => void; selected: string[]; toggle: (id: string) => void; tier: Tier; onClose: () => void };

export default function Registration({ member, setMember, selected, toggle, tier, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const total = calculateTotal(tier, member, selected);
  const conflict = selected.includes('golf') && selected.includes('tour17');
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const all = dialogRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, select, textarea, [tabindex="0"]');
      if (!all?.length) return;
      const first = all[0], last = all[all.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialogRef.current)) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', handleKey); previous?.focus(); };
  }, [onClose]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Order = {
      id: `NYC27-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      name: String(data.get('name')).trim(), email: String(data.get('email')).trim(), phone: String(data.get('phone')).trim(),
      chapter: String(data.get('chapter')).trim(), note: String(data.get('note')).trim(),
      member, tier, addons: selected, total, status: 'pending', createdAt: new Date().toISOString(),
    };
    if (!next.name || !next.email || !next.phone) { setError('Vui lòng điền đầy đủ thông tin người tham dự.'); return; }
    try { saveOrder(next); setOrder(next); setStep(2); setError(''); }
    catch { setError('Trình duyệt không cho phép lưu đơn mẫu. Hãy bật lưu trữ cục bộ và thử lại.'); }
  }
  function reportPayment() {
    if (!order) return;
    const updated: Order = { ...order, status: 'reported' };
    try { saveOrder(updated); setOrder(updated); } catch { setError('Không lưu được trạng thái. Vui lòng thử lại.'); }
  }
  async function copy() {
    if (!order) return;
    try { await navigator.clipboard.writeText(order.id); setCopied(true); } catch { setError('Không thể sao chép tự động. Bạn có thể chọn và sao chép mã đơn.'); }
  }

  return <div className="modal-backdrop" onClick={onClose}><div className="registration-modal" role="dialog" aria-modal="true" aria-labelledby="registration-title" tabIndex={-1} ref={dialogRef} onClick={event => event.stopPropagation()}><div className="modal-header"><div><p className="eyebrow blue">HẸN GẶP BẠN TẠI NINH BÌNH</p><h2 id="registration-title">{step === 2 ? 'Hành trình đã được ghi lại.' : 'Hành trình của bạn'}</h2></div><button className="close-button" onClick={onClose} aria-label="Đóng đăng ký"><X /></button></div><div className="registration-steps">{['Chọn trải nghiệm', 'Thông tin tham dự', 'Đơn đăng ký'].map((label, index) => <span className={step >= index ? 'active' : ''} key={label}><b>{step > index ? <Check size={13} /> : index + 1}</b>{label}</span>)}</div>
      <div className="demo-notice"><ShieldCheck size={19} /><span>Bản trải nghiệm giao diện · Đơn chỉ lưu trên trình duyệt này. Chưa tiếp nhận thanh toán thật.</span></div>
      {step === 0 && <div className="registration-content"><div className="cart-combo"><div><span className="eyebrow blue">COMBO CHƯƠNG TRÌNH</span><h3>{tier === 'priority' ? 'Priority' : ''} Impactor</h3><p>Welcome Night + Gala Night + Quà tặng</p></div><strong>{money(comboPrice(tier, member))}</strong></div><label className="field">Đối tượng tham dự<select value={member} onChange={e => setMember(e.target.value as MemberType)}><option value="member">JCI Member</option><option value="non-member">Non-member</option></select></label><h3 className="cart-section-title">Dịch vụ đi cùng</h3><div className="cart-addon-list">{addons.map(item => <label className="cart-addon" key={item.id}><input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggle(item.id)} /><span>{item.name}<small>{item.detail}</small></span><strong>{money(item.price)}</strong></label>)}</div>{conflict && <p className="form-error" role="alert">Tour sáng 17/01 và Golf Cup diễn ra song song. Vui lòng chọn một hoạt động.</p>}<div className="cart-total"><span>Tổng cộng <small>01 người tham dự</small></span><strong>{money(total)}</strong></div><button className="button navy full" disabled={conflict} onClick={() => setStep(1)}>Tiếp tục · Thông tin tham dự</button></div>}
      {step === 1 && <form className="registration-content" onSubmit={submit}><div className="form-grid"><label className="field">Họ và tên *<input name="name" autoComplete="name" required maxLength={120} placeholder="Nguyễn Minh Anh" /></label><label className="field">Số điện thoại *<input name="phone" autoComplete="tel" type="tel" required pattern="[+0-9 ()\-]{8,20}" maxLength={20} placeholder="09xx xxx xxx" /></label><label className="field full-field">Email nhận xác nhận *<input name="email" type="email" autoComplete="email" required maxLength={180} placeholder="ban@example.com" /></label><label className="field full-field">Chapter / Đơn vị<input name="chapter" maxLength={120} placeholder="Ví dụ: JCI Thăng Long" /></label><label className="field full-field">Ghi chú cho Ban tổ chức<textarea name="note" rows={3} maxLength={1000} placeholder="Yêu cầu ăn uống, người ghép phòng hoặc hỗ trợ khác…" /></label></div><label className="consent"><input type="checkbox" required />Tôi hiểu đây là bản mô phỏng và đồng ý lưu thông tin đơn mẫu trên trình duyệt này.</label><div className="order-mini-summary"><ShoppingBag size={21} /><span>01 combo + {selected.length} dịch vụ</span><strong>{money(total)}</strong></div>{error && <p className="form-error" role="alert">{error}</p>}<button className="button navy full" type="submit">Tạo đơn đăng ký mẫu</button><button className="back-link" type="button" onClick={() => setStep(0)}>Quay lại chỉnh sửa lựa chọn</button></form>}
      {step === 2 && order && <div className="registration-content payment-content"><div className="order-success"><span><Check size={25} /></span><h3>{order.status === 'reported' ? 'Đã ghi nhận thao tác mẫu' : 'Tạo đơn mẫu thành công'}</h3><p>Xin chào {order.name}, đây là thông tin đăng ký của bạn.</p></div><div className="qr-layout"><div className="qr-demo"><QRCodeSVG value={`NYC2027-DEMO|${order.id}|${order.total}|NOT-A-PAYMENT`} size={164} level="M" /><strong>QR MINH HỌA</strong><small>Không dùng để chuyển khoản</small></div><div className="payment-info"><span className="status-pill">{order.status === 'reported' ? 'Chờ đối soát mẫu' : 'Chờ thanh toán · Mô phỏng'}</span><label>MÃ ĐƠN ĐĂNG KÝ</label><button className="copy-order" onClick={copy}>{order.id}<Copy size={16} /></button>{copied && <small role="status">Đã sao chép mã đơn</small>}<label>TỔNG GIÁ TRỊ ĐƠN</label><strong className="payment-total">{money(order.total)}</strong><p>Thông tin ngân hàng của BTC sẽ được cấu hình trước khi mở thanh toán chính thức.</p></div></div><div className="receipt-items"><p><span>Combo {order.tier === 'priority' ? 'Priority' : ''} Impactor · {order.member === 'member' ? 'Member' : 'Non-member'}</span><strong>{money(comboPrice(order.tier, order.member))}</strong></p>{addons.filter(a => order.addons.includes(a.id)).map(a => <p key={a.id}><span>{a.name}</span><strong>{money(a.price)}</strong></p>)}</div><div className="email-note"><Gift size={20} /><p>Sau khi BTC xác nhận thanh toán, hệ thống chính thức sẽ gửi email đến <strong>{order.email}</strong>. Bản mô phỏng chưa gửi email.</p></div>{error && <p className="form-error" role="alert">{error}</p>}<button className="button navy full" disabled={order.status === 'reported'} onClick={reportPayment}>{order.status === 'reported' ? <><Check size={17} />Đã ghi nhận · Chờ BTC đối soát mẫu</> : 'Mô phỏng: Tôi đã chuyển khoản'}</button><button className="back-link" onClick={onClose}>Tiếp tục khám phá NYC 2027</button><a className="admin-demo-link" href="/admin">Xem đơn trong trang quản trị mẫu</a></div>}
    </div></div>;
}
