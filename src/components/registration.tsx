'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { LocalizedLink as Link } from './locale-provider';
import TravelModeSelector from './travel-mode-selector';
import { QRCodeSVG } from 'qrcode.react';
import { addons, calculateTotal, comboPrice, currentTier, groupServices, servicesForMode, money, saveOrder, type MemberType, type Order, type Tier, type TravelMode } from '@/lib/event';
import { Check, Copy, Gift, ShieldCheck, ShoppingBag } from './icon';


const jciChapters = [
  'JCI Hội An',
  'JCI Trevi',
  'JCI Cần Thơ',
  'JCI Bình Thuận',
  'JCI Central Saigon',
  'JCI Đà Lạt',
  'JCI Đà Nẵng',
  'JCI East Saigon',
  'JCI Grace',
  'JCI Hà Nội',
  'JCI Hải Phòng',
  'JCI Huế',
  'JCI Khánh Hoà',
  'JCI South Saigon',
  'JCI Thăng Long',
  'JCI Wonder Woman',
];

export default function Registration() {
  const [memberChapter, setMemberChapter] = useState('');
  const [member, setMember] = useState<MemberType>('member');
  const [travelMode, setTravelMode] = useState<TravelMode>('individual');
  const [individualServices, setSelected] = useState<string[]>([]);
  const selected = servicesForMode(travelMode, individualServices);
  const [tier, setTier] = useState<Tier>('priority');
  const toggle = (id: string) => {
    setSelected(previous => previous.includes(id)
      ? previous.filter(value => value !== id)
      : [...previous, id]);
  };
  const [step, setStep] = useState(0);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const total = calculateTotal(tier, member, selected);

  useEffect(() => { setTier(currentTier()); }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Order = {
      id: `NYC27-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      name: String(data.get('name')).trim(), email: String(data.get('email')).trim(), phone: String(data.get('phone')).trim(),
      chapter: member === 'member' ? memberChapter : String(data.get('chapter') ?? '').trim(), note: String(data.get('note')).trim(),
      travelMode, member, tier, addons: selected, total, status: 'pending', createdAt: new Date().toISOString(),
    };
    if (!next.name || !next.email || !next.phone) { setError('Vui lòng điền đầy đủ thông tin người tham dự.'); return; }
    if (member === 'member' && !jciChapters.includes(memberChapter)) {
      setError('Vui lòng chọn Chapter JCI của bạn.');
      return;
    }
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

  return <section className="registration-card" aria-labelledby="registration-title"><div className="modal-header"><div><p className="eyebrow blue">HẸN GẶP BẠN TẠI NINH BÌNH</p><h2 id="registration-title">{step === 2 ? 'Hành trình đã được ghi lại.' : 'Hành trình của bạn'}</h2></div></div><div className="registration-steps">{['Chọn trải nghiệm', 'Thông tin tham dự', 'Đơn đăng ký'].map((label, index) => <span className={step >= index ? 'active' : ''} key={label}><b>{step > index ? <Check size={13} /> : index + 1}</b>{label}</span>)}</div>
      <div className="demo-notice"><ShieldCheck size={19} /><span>Bản trải nghiệm giao diện · Đơn chỉ lưu trên trình duyệt này. Chưa tiếp nhận thanh toán thật.</span></div>
      {step === 0 && <div className="registration-content"><TravelModeSelector value={travelMode} onChange={setTravelMode} /><div className="cart-combo"><div><span className="eyebrow blue">COMBO CHƯƠNG TRÌNH</span><h3>{tier === 'priority' ? 'Priority' : ''} Impactor</h3><p>Welcome Night + Gala Night + Quà tặng</p></div><strong>{money(comboPrice(tier, member))}</strong></div><label className="field">Đối tượng tham dự<select value={member} onChange={e => setMember(e.target.value as MemberType)}><option value="member">JCI Member</option><option value="non-member">Non-member</option></select></label>{member === 'member' && (
  <label className="field mt-4">
    Chapter JCI *
    <select value={memberChapter} onChange={event => setMemberChapter(event.target.value)} required>
      <option value="" disabled>Chọn Chapter JCI của bạn</option>
      {jciChapters.map(chapter => <option key={chapter} value={chapter}>{chapter}</option>)}
    </select>
  </label>
)}<h3 className="cart-section-title">{travelMode === 'group' ? 'Toàn bộ dịch vụ trong gói đoàn' : 'Tự chọn dịch vụ đi cùng'}</h3><div className="cart-addon-list">{addons.map(item => <label className="cart-addon" key={item.id}><input type="checkbox" checked={selected.includes(item.id)} disabled={travelMode === 'group' && groupServices.includes(item.id)} onChange={() => toggle(item.id)} /><span>{item.name}<small>{travelMode === 'group' && groupServices.includes(item.id) ? 'Đã bao gồm trong gói đi đoàn · ' : ''}{item.detail}</small></span><strong>{money(item.price)}</strong></label>)}</div><div className="cart-total"><span>Tổng cộng <small>01 người tham dự</small></span><strong>{money(total)}</strong></div><button className="button navy full" disabled={member === 'member' && !memberChapter} onClick={() => setStep(1)}>Tiếp tục · Thông tin tham dự</button></div>}
      {step === 1 && <form className="registration-content" onSubmit={submit}><div className="form-grid"><label className="field">Họ và tên *<input name="name" autoComplete="name" required maxLength={120} placeholder="Nguyễn Minh Anh" /></label><label className="field">Số điện thoại *<input name="phone" autoComplete="tel" type="tel" required pattern="[+0-9 ()\-]{8,20}" maxLength={20} placeholder="09xx xxx xxx" /></label><label className="field full-field">Email nhận xác nhận *<input name="email" type="email" autoComplete="email" required maxLength={180} placeholder="ban@example.com" /></label>{member === 'member' ? (
  <label className="field full-field">Chapter JCI
    <input value={memberChapter} readOnly />
  </label>
) : (
  <label className="field full-field">Đơn vị
    <input name="chapter" maxLength={120} placeholder="Tên đơn vị của bạn (nếu có)" />
  </label>
)}<label className="field full-field">Ghi chú cho Ban tổ chức<textarea name="note" rows={3} maxLength={1000} placeholder="Yêu cầu ăn uống, người ghép phòng hoặc hỗ trợ khác…" /></label></div><label className="consent"><input type="checkbox" required />Tôi hiểu đây là bản mô phỏng và đồng ý lưu thông tin đơn mẫu trên trình duyệt này.</label><div className="order-mini-summary"><ShoppingBag size={21} /><span>{travelMode === 'group' ? 'Đi theo đoàn' : 'Đi cá nhân'} · 01 combo + {selected.length} dịch vụ</span><strong>{money(total)}</strong></div>{error && <p className="form-error" role="alert">{error}</p>}<button className="button navy full" type="submit">Tạo đơn đăng ký mẫu</button><button className="back-link" type="button" onClick={() => setStep(0)}>Quay lại chỉnh sửa lựa chọn</button></form>}
      {step === 2 && order && <div className="registration-content payment-content"><div className="order-success"><span><Check size={25} /></span><h3>{order.status === 'reported' ? 'Đã ghi nhận thao tác mẫu' : 'Tạo đơn mẫu thành công'}</h3><p>Xin chào {order.name}, đây là thông tin đăng ký của bạn.</p></div><div className="qr-layout"><div className="qr-demo"><QRCodeSVG value={`NYC2027-DEMO|${order.id}|${order.total}|NOT-A-PAYMENT`} size={164} level="M" /><strong>QR MINH HỌA</strong><small>Không dùng để chuyển khoản</small></div><div className="payment-info"><span className="status-pill">{order.status === 'reported' ? 'Chờ đối soát mẫu' : 'Chờ thanh toán · Mô phỏng'}</span><label>MÃ ĐƠN ĐĂNG KÝ</label><button className="copy-order" onClick={copy}>{order.id}<Copy size={16} /></button>{copied && <small role="status">Đã sao chép mã đơn</small>}<label>TỔNG GIÁ TRỊ ĐƠN</label><strong className="payment-total">{money(order.total)}</strong><p>Thông tin ngân hàng của BTC sẽ được cấu hình trước khi mở thanh toán chính thức.</p></div></div><p className="booking-mode-summary">Hình thức tham dự: <strong>{order.travelMode === 'group' ? 'Đi theo đoàn · Trọn gói' : 'Đi cá nhân · Tự chọn'}</strong></p><div className="receipt-items"><p><span>Combo {order.tier === 'priority' ? 'Priority' : ''} Impactor · {order.member === 'member' ? 'Member' : 'Non-member'}</span><strong>{money(comboPrice(order.tier, order.member))}</strong></p>{addons.filter(a => order.addons.includes(a.id)).map(a => <p key={a.id}><span>{a.name}</span><strong>{money(a.price)}</strong></p>)}</div><div className="email-note"><Gift size={20} /><p>Sau khi BTC xác nhận thanh toán, hệ thống chính thức sẽ gửi email đến <strong>{order.email}</strong>. Bản mô phỏng chưa gửi email.</p></div>{error && <p className="form-error" role="alert">{error}</p>}<button className="button navy full" disabled={order.status === 'reported'} onClick={reportPayment}>{order.status === 'reported' ? <><Check size={17} />Đã ghi nhận · Chờ BTC đối soát mẫu</> : 'Mô phỏng: Tôi đã chuyển khoản'}</button><Link className="back-link" href="/">Tiếp tục khám phá NYC 2027</Link><a className="admin-demo-link" href="/admin">Xem đơn trong trang quản trị mẫu</a></div>}
    </section>;
}
