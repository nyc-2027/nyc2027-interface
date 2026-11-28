'use client';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
export default function ChatMarkdown({ text, animate, onTyping }: { text: string; animate: boolean; onTyping: (typing: boolean) => void }) {
  const [visible, setVisible] = useState(animate ? '' : text);
  useEffect(() => {
    if (!animate || matchMedia('(prefers-reduced-motion: reduce)').matches) { setVisible(text); return; }
    const characters = Array.from(text); let index = 0;
    setVisible(''); onTyping(true);
    const timer = window.setInterval(() => { index = Math.min(index + 5, characters.length); setVisible(characters.slice(0,index).join('')); if (index >= characters.length) { clearInterval(timer); onTyping(false); } }, 20);
    return () => { clearInterval(timer); onTyping(false); };
  }, [text, animate, onTyping]);
  return <div className="chat-markdown"><div aria-hidden={animate || undefined}><Markdown remarkPlugins={[remarkGfm]} skipHtml disallowedElements={['img', 'iframe', 'script', 'style', 'input']} unwrapDisallowed components={{ a: ({ href, children }) => {
    let safe = false; try { const url = new URL(href || '', 'https://nyc2027.jci.vn'); safe = url.protocol === 'https:' && url.hostname === 'nyc2027.jci.vn' && ['/', '/dang-ky', '/en', '/en/dang-ky'].includes(url.pathname); } catch { /* Render unsafe destinations as plain text. */ }
    return safe ? <a href={new URL(href!, 'https://nyc2027.jci.vn').href} target="_blank" rel="noopener noreferrer">{children}</a> : <span>{children}</span>;
  } }}>{animate ? visible : text}</Markdown></div>{animate && <span className="sr-only">{text}</span>}</div>;
}
