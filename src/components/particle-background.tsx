'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const ParticleCanvas = dynamic(() => import('./particle-canvas'), { ssr: false });

export default function ParticleBackground() {
  const [preferences, setPreferences] = useState<{ reduced: boolean; compact: boolean } | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compact = window.matchMedia('(max-width: 760px), (pointer: coarse)');
    const update = () => setPreferences({ reduced: reduced.matches, compact: compact.matches });
    update();
    reduced.addEventListener('change', update);
    compact.addEventListener('change', update);
    return () => {
      reduced.removeEventListener('change', update);
      compact.removeEventListener('change', update);
    };
  }, []);

  if (!preferences || preferences.reduced) return null;

  return <div className="event-particles" aria-hidden="true">
    <ParticleCanvas compact={preferences.compact} />
  </div>;
}
