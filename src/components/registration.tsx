'use client';
import { useEffect, useState, type FormEvent } from 'react';
import TravelModeSelector from './travel-mode-selector';
import Payment from './payment';
import { register, restoreBooking, type Booking } from '@/lib/registration-client';
import { jciChapters } from '@/lib/chapters';
import { addonsForMode, serviceQuantity, calculateTotal, comboPrice, currentTier, servicesForMode, money, type Addon, type MemberType, type Order, type Tier, type TravelMode } from '@/lib/event';
import { Check, ShieldCheck, ShoppingBag } from './icon';
type Guest = { name: string; phone: string; handicap: string };
const emptyGuest = (): Guest => ({ name: '', phone: '', handicap: '' });
function highlight(field: HTMLElement) {
  field.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  field.focus({ preventScroll: true }); field.classList.remove('field-attention');
  void field.offsetWidth; field.classList.add('field-attention');
  field.setAttribute('aria-invalid', 'true');
  field.addEventListener('input', () => { field.classList.remove('field-attention'); field.removeAttribute('aria-invalid'); }, { once: true });
}
export default function Registration() {
  const [memberChapter, setMemberChapter] = useState('');
  const [member, setMember] = useState<MemberType>('member');
  const [travelMode, setTravelMode] = useState<TravelMode>('individual');
  const [ticketCount, setTicketCount] = useState(8);
  const quantity = travelMode === 'group' ? ticketCount : 1;
  const [choices, setChoices] = useState<string[]>([]);
  const selected = servicesForMode(travelMode, choices);
  const [tier, setTier] = useState<Tier>('priority');
  const [step, setStep] = useState(0);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [representative, setRepresentative] = useState({ ...emptyGuest(), email: '', chapter: '', note: '' });
  const total = calculateTotal(tier, member, selected, quantity);
  const golf = selected.includes('golf');
  useEffect(() => { setTier(currentTier()); const saved = restoreBooking(false); if (saved) { setBooking(saved); setStep(2); } }, []);
  function toggle(id: string) {
    setChoices(previous => {
      if (previous.includes(id)) return previous.filter(value => value !== id);
      return [...previous, id];
    });
  }
  function validate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('');
    const field = event.currentTarget.querySelector<HTMLElement>(':invalid');
    if (field) { setError('Vui lòng kiểm tra các trường bắt buộc được đánh dấu đỏ.'); highlight(field); return false; }
    return true;
  }
  function next(event: FormEvent<HTMLFormElement>) {
    if (!validate(event)) return;
    if (selected.some(id => id.startsWith('villa')) && quantity < 8) { setError('Villa yêu cầu đoàn tối thiểu 8 người.'); highlight(document.getElementById('ticket-count')!); return; }
    setStep(1);
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    if (!validate(event) || busy) return;
    const order: Order = { id: '', ...representative, chapter: member === 'member' ? memberChapter : representative.chapter, quantity, handicap: golf ? representative.handicap : undefined, travelMode, member, tier, addons: selected, total, status: 'pending', createdAt: '' };
    setBusy(true);
    try { const saved = await register(order); setBooking(saved); setStep(2); }
    catch { setError('Chưa lưu được đăng ký. Vui lòng kiểm tra thông tin và thử lại.'); }
    finally { setBusy(false); }
  }
  const repField = (key: keyof typeof representative, value: string) => setRepresentative(previous => ({ ...previous, [key]: value }));
  function addonRow(item: Addon, night?: string) { return <label className="cart-addon" key={item.id}><input type={night ? "radio" : "checkbox"} name={night ? `stay-${night}` : undefined} checked={selected.includes(item.id)} onChange={() => night ? chooseStay(night, item.id) : toggle(item.id)} /><span>{item.name}<small>{item.detail}{item.id.startsWith('villa') && quantity < 8 ? ' · Yêu cầu tối thiểu 8 người' : ''}</small></span><strong className="addon-price">{travelMode === 'group' && item.price > 0 && <small className="addon-calculation">{money(item.price)} × {serviceQuantity(item.id, quantity)} {item.id.startsWith('villa') ? 'căn' : 'người'} =</small>}{item.price === 0 ? 'Miễn phí' : money(item.price * serviceQuantity(item.id, quantity))}</strong></label>; }
  function chooseStay(night: string, id: string) { setChoices(previous => [...previous.filter(value => value !== `stay${night}` && value !== `villa${night}`), ...(id ? [id] : [])]); }
  return <section className="registration-card" aria-labelledby="registration-title">
    <div className="modal-header"><div><p className="eyebrow blue">HẸN GẶP BẠN TẠI NINH BÌNH</p><h2 id="registration-title">Hành trình của bạn</h2></div></div>
    <div className="registration-steps">{['Chọn trải nghiệm', 'Thông tin tham dự', 'Thanh toán'].map((label, index) => <span className={step >= index ? 'active' : ''} key={label}><b>{step > index ? <Check size={13} /> : index + 1}</b>{label}</span>)}</div>
    <div className="demo-notice"><ShieldCheck size={19} /><span>Đăng ký được lưu an toàn. BTC xác nhận thanh toán sau khi đối soát.</span></div>
    {step === 0 && <form className="registration-content" noValidate onSubmit={next}>
      <TravelModeSelector value={travelMode} onChange={mode => { setTravelMode(mode); setError(''); }} />
      {travelMode === 'group' && <label className="field">Số vé cho cả đoàn *<input id="ticket-count" type="number" min={1} max={1000} step={1} required value={ticketCount || ''} onChange={e => setTicketCount(Number(e.target.value))} /><small>Khách sạn tính theo người. Villa chỉ dành cho đoàn từ 8 người, tối đa 8 người/căn.</small></label>}
      <div className="cart-combo"><div><span className="eyebrow blue">COMBO CHƯƠNG TRÌNH</span><h3>{tier === 'priority' ? 'Priority ' : ''}Impactor</h3><p>Welcome Night + Gala Night + Quà tặng</p></div><strong>{money(comboPrice(tier, member) * quantity)}</strong></div>
      <label className="field">Đối tượng tham dự<select value={member} onChange={e => setMember(e.target.value as MemberType)}><option value="member">JCI Member</option><option value="non-member">Non-member</option></select></label>
      {member === 'member' && <label className="field mt-4">Chapter JCI *<select id="jci-chapter" required value={memberChapter} onChange={e => setMemberChapter(e.target.value)}><option value="">Chọn Chapter JCI của bạn</option>{jciChapters.map(chapter => <option key={chapter}>{chapter}</option>)}</select></label>}
      <h3 className="cart-section-title">Tự chọn dịch vụ đi cùng</h3>
      <div className="accommodation-options">{['15', '16'].map(night => <fieldset className="accommodation-night" key={night}><legend>Lưu trú đêm {night}/01</legend><p>Chọn một loại lưu trú cho đêm này.</p><label className="stay-none"><input type="radio" name={`stay-${night}`} checked={!selected.includes(`stay${night}`) && !selected.includes(`villa${night}`)} onChange={() => chooseStay(night, '')} /> Không đăng ký lưu trú</label>{addonsForMode(travelMode).filter(item => item.id === `stay${night}` || item.id === `villa${night}`).map(item => addonRow(item, night))}</fieldset>)}</div>
      <h3 className="cart-section-title">Di chuyển & trải nghiệm</h3><div className="cart-addon-list">{addonsForMode(travelMode).filter(item => item.category !== 'stay').map(item => addonRow(item))}</div>
      {golf && selected.includes('thanglong') && <p className="schedule-warning" role="status">Golf và Inauguration Ceremony JCI Thanglong cùng diễn ra sáng 16/01. Vui lòng cân nhắc lịch tham dự; bạn vẫn có thể giữ cả hai lựa chọn cho đoàn.</p>}
      <div className="cart-total"><span>Tổng cộng <small>{quantity} người tham dự</small></span><strong>{money(total)}</strong></div>
      {error && <p className="form-error" role="alert">{error}</p>}<button className="button navy full" type="submit">Tiếp tục · Thông tin tham dự</button>
    </form>}
    {step === 1 && <form className="registration-content" noValidate onSubmit={submit}>
      <h3 className="cart-section-title">{travelMode === 'group' ? 'Thông tin người đại diện đoàn' : 'Thông tin người tham dự'}</h3>
      <div className="form-grid">
        <label className="field">Họ và tên *<input required pattern=".*\S.*" name="name" maxLength={120} autoComplete="name" value={representative.name} onChange={e => repField('name', e.target.value)} /></label>
        <label className="field">Số điện thoại *<input required type="tel" name="phone" pattern="[+0-9 \(\)\-]{8,30}" maxLength={30} autoComplete="tel" value={representative.phone} onChange={e => repField('phone', e.target.value)} /></label>
        <label className="field full-field">Email nhận xác nhận *<input required type="email" maxLength={180} autoComplete="email" value={representative.email} onChange={e => repField('email', e.target.value)} /></label>
        {golf && <label className="field">Handicap *<input type="number" required min={-10} max={54} step="0.1" value={representative.handicap} onChange={e => repField('handicap', e.target.value)} placeholder="Ví dụ: 12.5" /><small>Nhập Handicap hiện tại; có thể nhập số lẻ (ví dụ 12.5).</small></label>}
        {member !== 'member' && <label className="field">Đơn vị<input maxLength={120} value={representative.chapter} onChange={e => repField('chapter', e.target.value)} /></label>}
        <label className="field full-field">Ghi chú cho Ban tổ chức<textarea rows={3} maxLength={1000} value={representative.note} onChange={e => repField('note', e.target.value)} /></label>
      </div>
      <label className="consent"><input type="checkbox" required />Tôi đồng ý để BTC lưu thông tin đăng ký của tôi và các thành viên đã đồng ý ủy quyền nhằm tổ chức sự kiện và đối soát thanh toán.</label>
      <div className="order-mini-summary"><ShoppingBag size={21} /><span>{quantity} vé · {selected.length} dịch vụ</span><strong>{money(total)}</strong></div>
      {error && <p className="form-error" role="alert">{error}</p>}<button className="button navy full" type="submit" disabled={busy}>{busy ? 'Đang tạo đăng ký…' : 'Xác nhận đăng ký & thanh toán'}</button>
      <button className="back-link" type="button" onClick={() => { setStep(0); setError(''); }}>Quay lại chỉnh sửa lựa chọn</button>
    </form>}
    {step === 2 && booking && <Payment booking={booking} />}
  </section>;
}
