'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { LocalizedLink as Link } from './locale-provider';
import TravelModeSelector from './travel-mode-selector';
import Payment from './payment';
import { register, restoreBooking, type Booking } from '@/lib/registration-client';
import { addonsForMode, serviceQuantity, calculateTotal, comboPrice, currentTier, groupServices, servicesForMode, money, type MemberType, type Order, type Tier, type TravelMode } from '@/lib/event';
import { Check, ShieldCheck, ShoppingBag } from './icon';


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
  const [ticketCount, setTicketCount] = useState(8);
  const quantity = travelMode === 'group' ? ticketCount : 1;
  const [individualServices, setSelected] = useState<string[]>([]);
  const selected = servicesForMode(travelMode, individualServices);
  const [tier, setTier] = useState<Tier>('priority');
  const toggle = (id: string) => {
    setSelected(previous => previous.includes(id)
      ? previous.filter(value => value !== id)
      : [...previous, id]);
  };
  const [step, setStep] = useState(0);
  const [booking, setBooking] = useState<Booking | null>(null); const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const total = calculateTotal(tier, member, selected, quantity);

  useEffect(() => { setTier(currentTier()); }, []);

  useEffect(() => { const saved = restoreBooking(false); if (saved) { setBooking(saved); setStep(2); } }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Order = {
      id: `NYC27-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      name: String(data.get('name')).trim(), email: String(data.get('email')).trim(), phone: String(data.get('phone')).trim(),
      chapter: member === 'member' ? memberChapter : String(data.get('chapter') ?? '').trim(), note: String(data.get('note')).trim(),
      quantity, travelMode, member, tier, addons: selected, total, status: 'pending', createdAt: new Date().toISOString(),
    };
    if (!next.name || !next.email || !next.phone) { setError('Vui lòng điền đầy đủ thông tin người tham dự.'); return; }
    if (member === 'member' && !jciChapters.includes(memberChapter)) {
      setError('Vui lòng chọn Chapter JCI của bạn.');
      return;
    }
    setBusy(true); try { const saved = await register(next); setBooking(saved); setStep(2); setError(''); } catch { setError('Không lưu được đăng ký / Registration unavailable. Please try again.'); } finally { setBusy(false); }
  }



  return <section className="registration-card" aria-labelledby="registration-title"><div className="modal-header"><div><p className="eyebrow blue">HẸN GẶP BẠN TẠI NINH BÌNH</p><h2 id="registration-title">{step === 2 ? 'Hành trình đã được ghi lại.' : 'Hành trình của bạn'}</h2></div></div><div className="registration-steps">{['Chọn trải nghiệm', 'Thông tin tham dự', 'Đơn đăng ký'].map((label, index) => <span className={step >= index ? 'active' : ''} key={label}><b>{step > index ? <Check size={13} /> : index + 1}</b>{label}</span>)}</div>
      <div className="demo-notice"><ShieldCheck size={19} /><span>Đăng ký được lưu an toàn. BTC xác nhận thanh toán sau khi đối soát.</span></div>
      {step === 0 && <div className="registration-content"><TravelModeSelector value={travelMode} onChange={setTravelMode} />{travelMode === 'group' && <label className="field">Số vé cho cả đoàn<input type="number" min={1} max={1000} step={1} value={ticketCount} onChange={e => setTicketCount(Math.max(1, Math.min(1000, Math.trunc(Number(e.target.value)) || 1)))} /><small>Combo và dịch vụ tính theo số vé; villa: {Math.ceil(quantity / 8)} căn mỗi đêm (8 người/căn).</small></label>}<div className="cart-combo"><div><span className="eyebrow blue">COMBO CHƯƠNG TRÌNH</span><h3>{tier === 'priority' ? 'Priority' : ''} Impactor</h3><p>Welcome Night + Gala Night + Quà tặng</p></div><strong>{money(comboPrice(tier, member) * quantity)}</strong></div><label className="field">Đối tượng tham dự<select value={member} onChange={e => setMember(e.target.value as MemberType)}><option value="member">JCI Member</option><option value="non-member">Non-member</option></select></label>{member === 'member' && (
  <label className="field mt-4">
    Chapter JCI *
    <select value={memberChapter} onChange={event => setMemberChapter(event.target.value)} required>
      <option value="" disabled>Chọn Chapter JCI của bạn</option>
      {jciChapters.map(chapter => <option key={chapter} value={chapter}>{chapter}</option>)}
    </select>
  </label>
)}<h3 className="cart-section-title">{travelMode === 'group' ? 'Toàn bộ dịch vụ trong gói đoàn' : 'Tự chọn dịch vụ đi cùng'}</h3><div className="cart-addon-list">{addonsForMode(travelMode).map(item => <label className="cart-addon" key={item.id}><input type="checkbox" checked={selected.includes(item.id)} disabled={travelMode === 'group' && groupServices.includes(item.id)} onChange={() => toggle(item.id)} /><span>{item.name}<small>{travelMode === 'group' && groupServices.includes(item.id) ? 'Đã bao gồm trong gói đi đoàn · ' : ''}{item.detail}</small></span><strong className="addon-price">{travelMode === 'group' && item.price > 0 && <small className="addon-calculation">{item.category === 'stay' ? <>{money(item.price)} × {serviceQuantity(item.id, quantity)} căn =</> : <>{money(item.price)} × {quantity} người =</>}</small>}{item.price === 0 ? 'Miễn phí' : money(item.price * serviceQuantity(item.id, quantity))}</strong></label>)}</div><div className="cart-total"><span>Tổng cộng <small>{quantity} người tham dự</small></span><strong>{money(total)}</strong></div><button className="button navy full" disabled={member === 'member' && !memberChapter} onClick={() => setStep(1)}>Tiếp tục · Thông tin tham dự</button></div>}
      {step === 1 && <form className="registration-content" onSubmit={submit}><div className="form-grid"><label className="field">Họ và tên *<input name="name" autoComplete="name" required maxLength={120} placeholder="Nguyễn Minh Anh" /></label><label className="field">Số điện thoại *<input name="phone" autoComplete="tel" type="tel" required pattern="[+0-9 ()\-]{8,20}" maxLength={20} placeholder="09xx xxx xxx" /></label><label className="field full-field">Email nhận xác nhận *<input name="email" type="email" autoComplete="email" required maxLength={180} placeholder="ban@example.com" /></label>{member !== 'member' && (
  <label className="field full-field">Đơn vị
    <input name="chapter" maxLength={120} placeholder="Tên đơn vị của bạn (nếu có)" />
  </label>
)}<label className="field full-field">Ghi chú cho Ban tổ chức<textarea name="note" rows={3} maxLength={1000} placeholder="Yêu cầu ăn uống, người ghép phòng hoặc hỗ trợ khác…" /></label></div><label className="consent"><input type="checkbox" required />Tôi đồng ý để BTC lưu thông tin đăng ký nhằm tổ chức sự kiện và đối soát thanh toán.</label><div className="order-mini-summary"><ShoppingBag size={21} /><span>{travelMode === 'group' ? 'Đi theo đoàn' : 'Đi cá nhân'} · {quantity} combo + {selected.length} dịch vụ</span><strong>{money(total)}</strong></div>{error && <p className="form-error" role="alert">{error}</p>}<button className="button navy full" type="submit" disabled={busy}>{busy ? 'Đang lấy mã…' : 'Lấy mã'}</button><button className="back-link" type="button" onClick={() => setStep(0)}>Quay lại chỉnh sửa lựa chọn</button></form>}
      {step === 2 && booking && <Payment booking={booking} />}
    </section>;
}
