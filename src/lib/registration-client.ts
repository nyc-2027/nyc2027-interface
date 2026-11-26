import type { Order } from './event';
export type Booking = { order: Order; token: string; payment: { amount: number; transferContent: string; account: string; accountName: string; bankId: string; qrUrl: string; exchangeRate: number | null } };
export function restoreBooking(international: boolean): Booking | null {
  try { const value = JSON.parse(sessionStorage.getItem(international ? 'nyc-booking-en' : 'nyc-booking-vi') || 'null'); return value?.order?.id && value?.payment?.qrUrl && value?.token ? value : null; } catch { return null; }
}
export async function register(order: Order): Promise<Booking> {
  const response = await fetch('/api/registrations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  try { sessionStorage.setItem(order.currency === 'USD' ? 'nyc-booking-en' : 'nyc-booking-vi', JSON.stringify(data)); } catch { /* Registration remains valid even if browser storage is unavailable. */ }
  return data;
}
