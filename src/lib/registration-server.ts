import { createHash, randomBytes } from 'node:crypto';
import { addons, calculateTotal, currentTier, servicesForMode, type Order } from './event';
import { internationalPackages } from './international';
import { jciChapters } from './chapters';

export function digest(token: string) { return createHash('sha256').update(token).digest('hex'); }
export async function supabase(path: string, init: RequestInit = {}) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Registration service is not configured.');
  const response = await fetch(`${url.replace(/\/$/, '')}/${path}`, { ...init, headers: { apikey: key, Authorization: `Bearer ${key}`, ...init.headers }, cache: 'no-store' });
  if (!response.ok) throw new Error('Registration service could not complete the request.');
  return response;
}
export function buildRegistration(input: Record<string, unknown>) {
  if (!input || typeof input !== 'object' || !['member', 'non-member'].includes(String(input.member)) || !['individual', 'group'].includes(String(input.travelMode)) || (input.currency !== undefined && !['VND', 'USD'].includes(String(input.currency)))) throw new Error('Invalid registration');
  const text = (key: string, max: number, required = false) => {
    const value = typeof input[key] === 'string' ? input[key].trim() : '';
    if (value.length > max || (required && !value)) throw new Error(`Invalid ${key}`);
    return value;
  };
  const email = text('email', 180, true);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Invalid email');
  const member = input.member === 'member' ? 'member' : 'non-member';
  const travelMode = input.travelMode === 'group' ? 'group' : 'individual';
  const tier = currentTier();
  if (!Array.isArray(input.addons) || input.addons.some(id => typeof id !== 'string' || !addons.some(a => a.id === id))) throw new Error('Invalid services');
  const selected = servicesForMode(travelMode, input.addons);
  const international = input.currency === 'USD';
  const pack = internationalPackages.find(p => p.id === input.internationalPackageId);
  if (international && !pack) throw new Error('Invalid package');
  if (international && input.addons.some(id => id !== 'golf')) throw new Error('Invalid international add-on');
  const quantity = !international && travelMode === 'group' ? input.quantity ?? 1 : 1;
  if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1 || quantity > 1000) throw new Error('Invalid ticket quantity');
  const chapter = text('chapter', 120, member === 'member');
  if (!international && member === 'member' && !jciChapters.includes(chapter)) throw new Error('Invalid chapter');
  if (!international && selected.some(id => id.startsWith('villa')) && quantity < 8) throw new Error('Villa requires at least 8 guests');
  for (const night of ['15', '16']) if (selected.includes(`stay${night}`) && selected.includes(`villa${night}`)) throw new Error('Choose hotel or villa for each night');
  const handicap = selected.includes('golf') ? text('handicap', 10, true) : undefined;
  if (handicap !== undefined && (!Number.isFinite(Number(handicap)) || Number(handicap) < -10 || Number(handicap) > 54)) throw new Error('Invalid handicap');
  const country = text('country', 100, international);
  const rate = Number(process.env.USD_VND_RATE || 26000);
  if (!Number.isFinite(rate) || rate <= 0) throw new Error('Invalid exchange rate');
  const golfVnd = international && selected.includes('golf') ? addons.find(a => a.id === 'golf')!.price : 0;
  const total = international ? Math.round((pack!.price + golfVnd / rate) * 100) / 100 : calculateTotal(tier, member, selected, quantity);
  const order: Order = { handicap, quantity, id: `NYC27-${randomBytes(8).toString('hex').toUpperCase()}`, name: text('name', 120, true), email, phone: text('phone', 30, true), chapter, country, note: text('note', 1000), member, tier, travelMode, addons: selected, total, currency: international ? 'USD' : 'VND', ...(international ? { internationalPackageId: pack!.id } : {}), status: 'pending', createdAt: new Date().toISOString() };
  const amount = international ? Math.round(pack!.price * rate) + golfVnd : total;
  // Keep the reference short, ASCII-only, and unique even for identical names.
  const ascii = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'D').toUpperCase().replace(/[^A-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const chapterCodes: Record<string, string> = { 'JCI HOI AN': 'JCIHA', 'JCI TREVI': 'JCITREVI', 'JCI CAN THO': 'JCICT', 'JCI BINH THUAN': 'JCIBT', 'JCI CENTRAL SAIGON': 'JCICSG', 'JCI DA LAT': 'JCIDL', 'JCI DA NANG': 'JCIDN', 'JCI EAST SAIGON': 'JCIESG', 'JCI GRACE': 'JCIGRACE', 'JCI HA NOI': 'JCIHN', 'JCI HAI PHONG': 'JCIHP', 'JCI HUE': 'JCIHUE', 'JCI KHANH HOA': 'JCIKH', 'JCI SOUTH SAIGON': 'JCISSG', 'JCI THANG LONG': 'JCITL', 'JCI WONDER WOMAN': 'JCIWW' };
  const chapterCode = member === 'member' ? chapterCodes[ascii(chapter)] || ascii(chapter).replace(/ /g, '').slice(0, 10) || 'JCI' : '';
  const prefix = `JCITL NYC ${chapterCode ? `${chapterCode} ` : ''}`;
  const code = order.id.replace('NYC27-', '');
  const transferName = (ascii(order.name) || 'NGUOI DANG KY').slice(0, 50 - prefix.length - code.length - 1).trim();
  const transferContent = `${prefix}${transferName} ${code}`;
  const bankId = process.env.BANK_ID || '970436';
  const account = process.env.BANK_ACCOUNT || '1050120408';
  const accountName = process.env.BANK_NAME || 'CLB DOANH NHAN TRE THE GIOI TAI VIET NAM';
  const query = new URLSearchParams({ amount: String(amount), addInfo: transferContent, accountName });
  return { order, payment: { amount, transferContent, account, accountName, bankId, exchangeRate: international ? rate : null, qrUrl: `https://img.vietqr.io/image/${bankId}-${account}-compact2.png?${query}` } };
}
