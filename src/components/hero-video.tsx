'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
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

  function togglePlayback() {
    const video = ref.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => {});
    else video.pause();
  }

  return <>
    <video ref={ref} className="hero-photo" style={{ opacity: ready && !failed ? 1 : 0 }}
      src="/videos/trang-an.mp4" aria-hidden="true" muted loop playsInline preload="none"
      onPlaying={() => { setReady(true); setPlaying(true); }}
      onPause={() => setPlaying(false)} onError={() => setFailed(true)} />
    {!failed && <button type="button" className="hero-playback" onClick={togglePlayback}
      aria-label={playing ? 'Tạm dừng video Tràng An' : 'Phát video Tràng An'}>
      {playing ? <Pause size={18} /> : <Play size={18} />}
    </button>}
  </>;
}
