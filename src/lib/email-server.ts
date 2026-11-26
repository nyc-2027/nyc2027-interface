import { supabase } from './registration-server';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { confirmationEmail, type EmailPayload } from './email-template';
type PendingEmail = { id: string; kind: 'registered' | 'confirmed'; payload: EmailPayload };
export async function dispatchEmails(registrationId?: string) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) throw new Error('Email service not configured');
  const filter = registrationId ? `&registration_id=eq.${encodeURIComponent(registrationId)}` : '';
  const rows: PendingEmail[] = await (await supabase(`rest/v1/registration_emails?sent_at=is.null&order=created_at.asc&limit=10${filter}`)).json();
  let sent = 0;
  for (const row of rows) {
    try {
      const content = confirmationEmail(row.payload, row.kind);
      const logo = await readFile(join(process.cwd(), 'public/images/logo_mail.png'));
      const titleImage = await readFile(join(process.cwd(), 'public/images/Text_NYC.png'));
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST', signal: AbortSignal.timeout(10000),
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `nyc2027/${row.id}` },
        body: JSON.stringify({ from: process.env.EMAIL_FROM, to: [row.payload.order.email], attachments: [{ filename: 'logo_mail.png', content: logo.toString('base64'), content_id: 'nyc-logo' }, { filename: 'Text_NYC.png', content: titleImage.toString('base64'), content_id: 'nyc-title' }], ...(process.env.EMAIL_REPLY_TO ? { reply_to: process.env.EMAIL_REPLY_TO } : {}), ...content }),
      });
      if (!response.ok) throw new Error('Email provider rejected request');
      const data = await response.json();
      if (!data.id) throw new Error('Email provider returned no ID');
      await supabase(`rest/v1/registration_emails?id=eq.${row.id}&sent_at=is.null`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sent_at: new Date().toISOString(), provider_id: data.id, last_error: null }) });
      sent++;
    } catch {
      await supabase(`rest/v1/registration_emails?id=eq.${row.id}&sent_at=is.null`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ last_error: 'Email send failed; retry dispatch. Check provider logs.' }) });
    }
  }
  return { sent, failed: rows.length - sent };
}
