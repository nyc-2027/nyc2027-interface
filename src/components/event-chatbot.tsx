'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useLocale } from './locale-provider';
import { Sparkles, X } from './icon';
import type { ChatMessage } from '@/lib/chat';
import ChatMarkdown from './chat-markdown';
export default function EventChatbot({ onClose }: { onClose: () => void }) {
  const { locale } = useLocale(); const en = locale === 'en';
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState(''); const [pending, setPending] = useState(''); const [error, setError] = useState('');
  const bottom = useRef<HTMLDivElement>(null); const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => { bottom.current?.scrollIntoView({ block: 'nearest' }); }, [messages, pending, error]);
  useEffect(() => {
    if (!typing) return;
    const timer = setInterval(() => { const panel = bottom.current?.parentElement; if (panel && panel.scrollHeight - panel.scrollTop - panel.clientHeight < 160) panel.scrollTop = panel.scrollHeight; }, 100);
    return () => clearInterval(timer);
  }, [typing]);
  async function send(event: FormEvent) {
    event.preventDefault(); const text = input.trim(); if (!text || pending || typing) return;
    setPending(text); setError(''); controller.current = new AbortController();
    try {
      const response = await fetch('/api/chat', { method: 'POST', signal: controller.current.signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ locale, messages: [...messages.slice(-6).map(message => ({ ...message, text: message.text.slice(0,1200) })), { role: 'user', text }] }) });
      if (!response.ok) throw new Error(response.status === 429 ? 'limit' : 'unavailable');
      const result = await response.json();
      setMessages(previous => [...previous, { role: 'user', text }, { role: 'model', text: result.answer }].slice(-30) as ChatMessage[]); setInput('');
    } catch (e) {
      if (!controller.current?.signal.aborted) setError(e instanceof Error && e.message === 'limit' ? (en ? 'The assistant has reached its question limit. Please contact the COC or try again later.' : 'Trợ lý đã đạt giới hạn câu hỏi. Vui lòng liên hệ BTC hoặc thử lại sau.') : (en ? 'The assistant is temporarily unavailable. Please retry or contact the COC.' : 'Trợ lý tạm thời chưa trả lời được. Bạn thử lại hoặc liên hệ BTC nhé.'));
    } finally { setPending(''); }
  }
  return <section className="assistant-popover event-chatbot" role="dialog" aria-label={'HeyLongs'} onKeyDown={e => { if (e.key === 'Escape') onClose(); }}>
    <div className="assistant-header"><Sparkles size={21} /><strong>{'HeyLongs'}</strong><button aria-label={en ? 'Close' : 'Đóng'} onClick={onClose}><X size={18} /></button></div>
    <div className="chat-messages" role="log" aria-live="polite" aria-relevant="additions">
      {!messages.length && <p className="chat-welcome">{en ? 'Hello! Ask me about tickets, schedules, accommodation or services for NYC 2027.' : 'Chào bạn! Mình có thể hỗ trợ thông tin vé, lịch trình, lưu trú và các dịch vụ NYC 2027.'}</p>}
      {messages.map((message, index) => <div className={`chat-bubble chat-${message.role}`} key={index}><small>{message.role === 'user' ? (en ? 'You' : 'Bạn') : 'HeyLongs'}</small>{message.role === 'model' ? <ChatMarkdown text={message.text} animate={index === messages.length - 1} onTyping={setTyping} /> : <p>{message.text}</p>}</div>)}
      {pending && <><div className="chat-bubble chat-user"><small>{en ? 'You' : 'Bạn'}</small><p>{pending}</p></div><p role="status">{en ? 'Preparing an answer…' : 'Đang trả lời…'}</p></>}
      {error && <p className="form-error" role="alert">{error}</p>}<div ref={bottom} />
    </div>
    <form className="chat-form" onSubmit={send}><label className="sr-only" htmlFor="nyc-question">{en ? 'Your question' : 'Câu hỏi của bạn'}</label><textarea id="nyc-question" autoFocus value={input} onChange={e => setInput(e.target.value)} disabled={!!pending} maxLength={1200} rows={2} placeholder={en ? 'What is included in the combo?' : 'Combo chương trình gồm những gì?'} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); e.currentTarget.form?.requestSubmit(); } }} /><button className="button navy" disabled={!!pending || typing || !input.trim()}>{en ? 'Send' : 'Gửi'}</button></form>
    <div className="chat-footer"><a href={`https://nyc2027.jci.vn${en ? '/en/dang-ky' : '/dang-ky'}`} target="_blank" rel="noopener noreferrer">{en ? 'Official registration' : 'Đăng ký tham dự chính thức'}</a><a href="tel:0941752949">{en ? 'Contact COC' : 'Liên hệ BTC'}: 0941752949</a></div>
  </section>;
}
