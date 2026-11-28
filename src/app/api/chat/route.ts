import { createHash } from 'node:crypto';
import { supabase } from '@/lib/registration-server';
import { sameOrigin } from '@/lib/admin-auth';
import { parseChatMessages, eventChatContext, groundedChatAnswer, chatResponseSchema } from '@/lib/chat';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  const headers = { 'Cache-Control': 'no-store' };
  if (!sameOrigin(request)) return Response.json({ error: 'Forbidden' }, { status: 403, headers });
  const key = process.env.GOOGLE_GEMINI_API_KEY;
  if (!key) return Response.json({ error: 'unavailable' }, { status: 503, headers });
  let messages; let locale: 'vi' | 'en';
  try {
    const raw = await request.text(); if (raw.length > 12000) throw new Error();
    const body = JSON.parse(raw); messages = parseChatMessages(body.messages); locale = body.locale === 'en' ? 'en' : 'vi';
  } catch { return Response.json({ error: 'invalid' }, { status: 400, headers }); }
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    const subject = createHash('sha256').update(`${key}:${ip}`).digest('hex');
    const allowed = await (await supabase('rest/v1/rpc/consume_chat_quota', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ p_subject: subject }) })).json();
    if (allowed !== true) return Response.json({ error: 'limit' }, { status: 429, headers });
    const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
    if (!/^[a-z0-9.-]+$/.test(model)) throw new Error('Invalid model');
    const context = eventChatContext(locale);
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST', signal: AbortSignal.timeout(20000), headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({ systemInstruction: { parts: [{ text: context }] }, contents: messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })), generationConfig: { temperature: 0, maxOutputTokens: 512, responseMimeType: 'application/json', responseJsonSchema: chatResponseSchema, thinkingConfig: model.startsWith('gemini-2.5') ? { thinkingBudget: 0 } : { thinkingLevel: 'minimal' } } }),
    });
    if (!response.ok) return Response.json({ error: response.status === 429 ? 'limit' : 'unavailable' }, { status: response.status === 429 ? 429 : 503, headers });
    const result = await response.json();
    const answer = result.candidates?.[0]?.content?.parts?.filter((p: { text?: string; thought?: boolean }) => p.text && !p.thought).map((p: { text: string }) => p.text).join('').trim();
    if (!answer) throw new Error('Empty response');
    let structured: unknown = null;
    try { structured = JSON.parse(answer); } catch { /* Fail closed if JSON is incomplete or malformed. */ }
    return Response.json({ answer: groundedChatAnswer(structured, context, locale) }, { headers });
  } catch { return Response.json({ error: 'unavailable' }, { status: 503, headers }); }
}
