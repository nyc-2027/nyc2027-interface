export const money = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);
export type MemberType = 'member' | 'non-member';
export type Tier = 'priority' | 'impactor';
export type TravelMode = 'group' | 'individual';
export type ProgramTicket = 'combo' | 'culture' | 'gala';
export const programTicketNames = { combo: 'Combo Culture Night + Gala Night', culture: 'Culture Night · 15/01', gala: 'Gala Night · 16/01' };
export function programPrice(tier: Tier, member: MemberType, ticket: ProgramTicket = 'combo') {
  if (ticket === 'combo') return comboPrice(tier, member);
  return (ticket === 'culture' ? (tier === 'priority' ? 1000000 : 1100000) : (tier === 'priority' ? 1150000 : 1300000)) + (member === 'non-member' ? 50000 : 0);
}
export function programTicketLabel(order: Pick<Order, 'programTicket' | 'internationalPackageId' | 'tier'>) {
  return order.internationalPackageId ? `${order.internationalPackageId === 'delegate' ? 'Delegate' : 'Experience'} Package` : `${programTicketNames[order.programTicket || 'combo']} · ${order.tier === 'priority' ? 'Priority Impactor' : 'Impactor'}`;
}
export function servicesForMode(mode: TravelMode, selected: string[]) {
  const allowed = addonsForMode(mode).map(a => a.id);
  return [...new Set(selected.filter(id => allowed.includes(id)))];
}
export type Addon = { id: string; name: string; detail: string; price: number; category: 'transport' | 'stay' | 'experience'; day?: '15' | '16' | '17' };
export const addons: Addon[] = [
  { id: 'bus', name: 'Xe khứ hồi', detail: 'Hà Nội – Ninh Bình – Hà Nội', price: 500000, category: 'transport' },
  { id: 'stay15', day: '15', name: 'Wyndham · Đêm 15/01', detail: '820.000đ/người · Phòng 2 người · Bao gồm ăn sáng', price: 820000, category: 'stay' },
  { id: 'stay16', day: '16', name: 'Wyndham · Đêm 16/01', detail: '920.000đ/người · Phòng 2 người · Bao gồm ăn sáng', price: 920000, category: 'stay' },
  { id: 'villa15', day: '15', name: 'Villa · Đêm 15/01', detail: '7.200.000đ/căn · 8 người · Bao gồm ăn sáng, bể bơi, phòng bếp, phòng sinh hoạt chung/phòng khách, khuôn viên vườn trước – sau', price: 7200000, category: 'stay' },
  { id: 'villa16', day: '16', name: 'Villa · Đêm 16/01', detail: '8.200.000đ/căn · 8 người · Bao gồm ăn sáng, bể bơi, phòng bếp, phòng sinh hoạt chung/phòng khách, khuôn viên vườn trước – sau', price: 8200000, category: 'stay' },
  { id: 'tour15', day: '15', name: 'Tour · Chiều 15/01', detail: 'Nửa ngày · Đã bao gồm vé vào cửa các khu du lịch Hoa Lư, Tam Cốc, Bích Động, Bái Đính, Tràng An', price: 700000, category: 'experience' },
  { id: 'tour16', day: '16', name: 'Tour · Chiều 16/01', detail: 'Nửa ngày · Đã bao gồm vé vào cửa các khu du lịch Hoa Lư, Tam Cốc, Bích Động, Bái Đính, Tràng An', price: 700000, category: 'experience' },
  { id: 'tour17', day: '17', name: 'Tour · Sáng 17/01', detail: 'Nửa ngày · Đã bao gồm vé vào cửa các khu du lịch Hoa Lư, Tam Cốc, Bích Động, Bái Đính, Tràng An', price: 700000, category: 'experience' },
  { id: 'mineral', name: 'Tắm khoáng nóng', detail: '150.000đ/người', price: 150000, category: 'experience' },
  { id: 'pickleball', day: '17', name: 'Tour · Chiều 17/01', detail: 'Có giải Pickleball · 500.000đ/người', price: 500000, category: 'experience' },
  { id: 'ga01', day: '15', name: 'JCI Vietnam General Assembly 01', detail: 'Chiều 15/01 · Miễn phí', price: 0, category: 'experience' },
  { id: 'thanglong', day: '16', name: 'Inauguration Ceremony JCI Thanglong', detail: 'Sáng 16/01 · Miễn phí', price: 0, category: 'experience' },
  { id: 'awards', day: '16', name: 'JCI Vietnam Awards', detail: 'Chiều 16/01 · Miễn phí', price: 0, category: 'experience' },
  { id: 'golf', day: '15', name: 'Impactor Golf Cup', detail: 'Giải Golf Quốc tế NYC 2027 · Chiều 15/01', price: 3000000, category: 'experience' },
];
export function addonsForMode(mode: TravelMode) { return addons.filter(a => mode === 'group' || !['villa15', 'villa16'].includes(a.id)); }
export function serviceQuantity(id: string, quantity: number) { return id.startsWith('villa') ? Math.ceil(quantity / 8) : quantity; }
export function comboPrice(tier: Tier, member: MemberType) {
  return (tier === 'priority' ? 1950000 : 2200000) + (member === 'non-member' ? 100000 : 0);
}
export function calculateTotal(tier: Tier, member: MemberType, selected: string[], quantity = 1, ticket: ProgramTicket = 'combo') {
  return programPrice(tier, member, ticket) * quantity + addons.filter(a => selected.includes(a.id)).reduce((sum, a) => sum + a.price * serviceQuantity(a.id, quantity), 0);
}
export function currentTier(date = new Date()): Tier {
  return date.getTime() < Date.parse('2026-12-21T00:00:00+07:00') ? 'priority' : 'impactor';
}
export type Order = {
  programTicket?: ProgramTicket;
  handicap?: string;
  quantity?: number;
  currency?: 'VND' | 'USD';
  internationalPackageId?: 'delegate' | 'experience';
  country?: string;
  travelMode?: TravelMode;
  id: string; name: string; email: string; phone: string; chapter: string; note: string;
  tier: Tier; member: MemberType; addons: string[]; total: number; createdAt: string;
  status: 'pending' | 'reported' | 'confirmed';
};
export const ORDER_KEY = 'nyc2027-demo-orders-v1';
export function orderMoney(order: Pick<Order, 'currency' | 'total'>) {
  return order.currency === 'USD'
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(order.total) + ' USD'
    : money(order.total);
}
export function confirmedRevenue(orders: Order[]) {
  const confirmed = orders.filter(order => order.status === 'confirmed');
  const vnd = confirmed.filter(order => order.currency !== 'USD').reduce((sum, order) => sum + order.total, 0);
  const usd = confirmed.filter(order => order.currency === 'USD').reduce((sum, order) => sum + order.total, 0);
  return usd ? `${money(vnd)} · ${orderMoney({ currency: 'USD', total: usd })}` : money(vnd);
}
export function readOrders(): Order[] {
  try { const data: unknown = JSON.parse(localStorage.getItem(ORDER_KEY) || '[]'); return Array.isArray(data) ? data.filter((o): o is Order => !!o && typeof o === 'object' && typeof o.id === 'string' && typeof o.total === 'number' && ['pending', 'reported', 'confirmed'].includes(o.status)) : []; } catch { return []; }
}
export function saveOrder(order: Order) {
  const orders = readOrders();
  localStorage.setItem(ORDER_KEY, JSON.stringify([order, ...orders.filter(o => o.id !== order.id)]));
}
