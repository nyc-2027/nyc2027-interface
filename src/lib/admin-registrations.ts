import { supabase } from './registration-server';
import type { Order } from './event';
export type AdminRegistration = { id: string; status: Order['status']; created_at: string; reported_at: string | null; receipt_path: string | null; order_data: Order; payment_data: { amount: number; transferContent: string } };
export function registrationFilters(params: URLSearchParams) {
  const status = params.get('status') || '';
  const query = (params.get('q') || '').trim().slice(0, 120);
  const filters = new URLSearchParams();
  if (['pending', 'reported', 'confirmed'].includes(status)) filters.set('status', `eq.${status}`);
  if (query) {
    // Quote and escape PostgREST filter literals, including wildcard characters.
    const literal = `"%${query.replace(/[\\"]/g, '\\$&').replace(/[%_*]/g, '')}%"`;
    filters.set('or', `(id.ilike.${literal},order_data->>name.ilike.${literal},order_data->>email.ilike.${literal},order_data->>phone.ilike.${literal},order_data->>chapter.ilike.${literal})`);
  }
  return filters;
}
export async function registrationPage(params: URLSearchParams, offset: number, limit = 50) {
  const filters = registrationFilters(params);
  filters.set('select', 'id,status,created_at,reported_at,receipt_path,order_data,payment_data');
  filters.set('order', 'created_at.desc,id.asc'); filters.set('offset', String(offset)); filters.set('limit', String(limit));
  const response = await supabase(`rest/v1/registrations?${filters}`, { headers: { Prefer: 'count=exact' } });
  const rows: AdminRegistration[] = await response.json();
  const total = Number(response.headers.get('content-range')?.split('/')[1]);
  if (!Number.isFinite(total)) throw new Error('Missing registration count');
  return { rows, total };
}
