'use client';
import { useEffect, useRef, useState } from 'react';

export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!motion.matches) void video.play().catch(() => {});
    const preferenceChanged = () => { if (motion.matches) video.pause(); };
    motion.addEventListener('change', preferenceChanged);
    return () => motion.removeEventListener('change', preferenceChanged);
  }, []);

  return <>
    <video ref={ref} className="hero-photo" style={{ opacity: ready && !failed ? 1 : 0 }}
      src="/videos/trang-an.mp4" aria-hidden="true" muted loop playsInline preload="none"
      onPlaying={() => setReady(true)} onError={() => setFailed(true)} />
  </>;
}
