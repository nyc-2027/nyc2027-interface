export const money = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);
export type MemberType = 'member' | 'non-member';
export type Tier = 'priority' | 'impactor';
export type Addon = { id: string; name: string; detail: string; price: number; category: 'transport' | 'stay' | 'experience' };
export const addons: Addon[] = [
  { id: 'bus', name: 'Xe khứ hồi', detail: 'Hà Nội – Ninh Bình – Hà Nội', price: 500000, category: 'transport' },
  { id: 'stay15', name: 'Wyndham · Đêm 15/01', detail: 'Phòng ghép 2 người, bao gồm ăn sáng', price: 950000, category: 'stay' },
  { id: 'stay16', name: 'Wyndham · Đêm 16/01', detail: 'Phòng ghép 2 người, bao gồm ăn sáng', price: 1150000, category: 'stay' },
  { id: 'tour15', name: 'Tour · Chiều 15/01', detail: 'Một hành trình nửa ngày khám phá Ninh Bình', price: 800000, category: 'experience' },
  { id: 'tour16', name: 'Tour · Chiều 16/01', detail: 'Một hành trình nửa ngày khám phá Ninh Bình', price: 800000, category: 'experience' },
  { id: 'tour17', name: 'Tour · Sáng 17/01', detail: 'Một hành trình nửa ngày khám phá Ninh Bình', price: 800000, category: 'experience' },
  { id: 'golf', name: 'Impactor Golf Cup', detail: 'Hoạt động thể thao sáng 17/01', price: 3000000, category: 'experience' },
];
export function comboPrice(tier: Tier, member: MemberType) {
  return (tier === 'priority' ? 1950000 : 2200000) + (member === 'non-member' ? 100000 : 0);
}
export function calculateTotal(tier: Tier, member: MemberType, selected: string[]) {
  return comboPrice(tier, member) + addons.filter(a => selected.includes(a.id)).reduce((sum, a) => sum + a.price, 0);
}
export function currentTier(date = new Date()): Tier {
  return date.getTime() < Date.parse('2026-12-13T00:00:00+07:00') ? 'priority' : 'impactor';
}
export const days = [
  { date: '15', weekday: 'THỨ SÁU', title: 'Hội ngộ', subtitle: 'Khởi đầu những kết nối mới', events: [
    { time: '09:00', name: 'Hà Nội → Ninh Bình', detail: 'Khởi hành cùng đoàn NYC 2027', tag: 'Di chuyển' },
    { time: '14:00 – 17:00', name: 'General Assembly 01', detail: 'Đại hội đồng JCI Vietnam · Song song tour tự chọn', tag: 'Đại hội' },
    { time: '18:30 – 22:00', name: 'Welcome Night', detail: 'Gặp gỡ, kết nối và chào đón hành trình mới', tag: 'Trong combo' },
  ] },
  { date: '16', weekday: 'THỨ BẢY', title: 'Vinh danh & kết nối', subtitle: 'Cùng nhau tạo nên tác động', events: [
    { time: 'Buổi sáng', name: 'JCI Vietnam × JCI Mông Cổ', detail: 'Chương trình gặp gỡ · Song song tour tự chọn', tag: 'Kết nối' },
    { time: '14:00 – 17:00', name: 'Lễ trao giải', detail: 'Tôn vinh những dấu ấn và hành trình cống hiến', tag: 'Vinh danh' },
    { time: '18:30 – 22:00', name: 'Gala Night', detail: 'Đêm hội của những người dẫn dắt thay đổi', tag: 'Trong combo' },
    { time: 'Từ 22:00', name: 'After-party', detail: 'Dành cho khách quốc tế · Báo giá theo nhu cầu', tag: 'Tự chọn' },
  ] },
  { date: '17', weekday: 'CHỦ NHẬT', title: 'Trải nghiệm & gắn kết', subtitle: 'Mang cảm hứng đi xa hơn', events: [
    { time: 'Buổi sáng', name: 'Chọn trải nghiệm của bạn', detail: 'Tour tự chọn · Impactor Pickleball Cup · Impactor Golf Cup', tag: 'Song song' },
    { time: '14:00', name: 'Ninh Bình → Hà Nội', detail: 'Khép lại hành trình, mở ra những kết nối', tag: 'Di chuyển' },
  ] },
];
export type Order = {
  id: string; name: string; email: string; phone: string; chapter: string; note: string;
  tier: Tier; member: MemberType; addons: string[]; total: number; createdAt: string;
  status: 'pending' | 'reported' | 'confirmed';
};
export const ORDER_KEY = 'nyc2027-demo-orders-v1';
export function readOrders(): Order[] {
  try { const data: unknown = JSON.parse(localStorage.getItem(ORDER_KEY) || '[]'); return Array.isArray(data) ? data.filter((o): o is Order => !!o && typeof o === 'object' && typeof o.id === 'string' && typeof o.total === 'number' && ['pending', 'reported', 'confirmed'].includes(o.status)) : []; } catch { return []; }
}
export function saveOrder(order: Order) {
  const orders = readOrders();
  localStorage.setItem(ORDER_KEY, JSON.stringify([order, ...orders.filter(o => o.id !== order.id)]));
}
