import { supabase } from './registration-server';
import type { AdminRegistration } from './admin-registrations';
const selection = 'id,status,created_at,reported_at,receipt_path,order_data,payment_data';
export async function confirmRegistration(id: string, adminId: string) {
  if (!/^NYC27-[A-F0-9]{16}$/.test(id)) throw new Error('Invalid registration ID');
  const filter = `id=eq.${id}`;
  const response = await supabase(`rest/v1/registrations?${filter}&status=in.(pending,reported)&select=${selection}`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify({ status: 'confirmed', confirmed_at: new Date().toISOString(), confirmed_by: adminId }),
  });
  const changed: AdminRegistration[] = await response.json();
  if (changed.length) return { registration: changed[0], changed: true };
  const existing: AdminRegistration[] = await (await supabase(`rest/v1/registrations?${filter}&select=${selection}`)).json();
  return existing[0] ? { registration: existing[0], changed: false } : null;
}
