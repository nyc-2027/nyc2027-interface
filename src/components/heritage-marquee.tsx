'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Pause, Play } from './icon';
import { useLocale } from './locale-provider';
export default function HeritageMarquee({ children }: { children: ReactNode }) {
  const { locale } = useLocale(); const en = locale === 'en';
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false); const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) { setVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '80px' });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div className={`heritage-marquee ${paused || !visible ? 'is-paused' : ''}`} ref={ref}>
    <div className="heritage-motion-controls"><span>{en ? 'Discover Ninh Binh' : 'Khám phá Ninh Bình'}</span><button type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? <Play size={15} /> : <Pause size={15} />}{en ? (paused ? 'Resume' : 'Pause') : (paused ? 'Chạy tiếp' : 'Tạm dừng')}</button></div>
    <div className="heritage-viewport" tabIndex={0} role="region" onTouchStart={() => setPaused(true)} aria-label={en ? 'Ninh Binh destination gallery. Focus to pause, or use the pause button.' : 'Ảnh điểm đến Ninh Bình. Dùng bàn phím hoặc nút tạm dừng để dừng chuyển động.'}>
      <div className="heritage-track"><div className="heritage-slide-group">{children}</div><div className="heritage-slide-group heritage-slide-copy" aria-hidden="true" inert>{children}</div></div>
    </div>
  </div>;
}
