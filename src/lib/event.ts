export const money = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);
export type MemberType = 'member' | 'non-member';
export type Tier = 'priority' | 'impactor';
export type TravelMode = 'group' | 'individual';
export function servicesForMode(mode: TravelMode, selected: string[]) {
  return mode === 'group' ? [...new Set([...groupServices, ...selected])] : selected;
}
export type Addon = { id: string; name: string; detail: string; price: number; category: 'transport' | 'stay' | 'experience' };
export const addons: Addon[] = [
  { id: 'bus', name: 'Xe khứ hồi', detail: 'Hà Nội – Ninh Bình – Hà Nội', price: 500000, category: 'transport' },
  { id: 'stay15', name: 'Wyndham · Đêm 15/01', detail: 'Phòng ghép 2 người, bao gồm ăn sáng', price: 950000, category: 'stay' },
  { id: 'stay16', name: 'Wyndham · Đêm 16/01', detail: 'Phòng ghép 2 người, bao gồm ăn sáng', price: 1150000, category: 'stay' },
  { id: 'tour15', name: 'Tour · Chiều 15/01', detail: 'Một hành trình nửa ngày khám phá Ninh Bình', price: 800000, category: 'experience' },
  { id: 'tour16', name: 'Tour · Chiều 16/01', detail: 'Một hành trình nửa ngày khám phá Ninh Bình', price: 800000, category: 'experience' },
  { id: 'tour17', name: 'Tour · Sáng 17/01', detail: 'Một hành trình nửa ngày khám phá Ninh Bình', price: 800000, category: 'experience' },
  { id: 'golf', name: 'Impactor Golf Cup', detail: 'Giải Golf Quốc tế NYC 2027 · 07:00 ngày 16/01', price: 3000000, category: 'experience' },
];
export const groupServices = addons.map(addon => addon.id);
export function comboPrice(tier: Tier, member: MemberType) {
  return (tier === 'priority' ? 1950000 : 2200000) + (member === 'non-member' ? 100000 : 0);
}
export function calculateTotal(tier: Tier, member: MemberType, selected: string[]) {
  return comboPrice(tier, member) + addons.filter(a => selected.includes(a.id)).reduce((sum, a) => sum + a.price, 0);
}
export function currentTier(date = new Date()): Tier {
  return date.getTime() < Date.parse('2026-12-13T00:00:00+07:00') ? 'priority' : 'impactor';
}
export type Order = {
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
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(order.total) + ' USD'
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
