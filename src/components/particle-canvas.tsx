'use client';

import { useMemo } from 'react';
import Particles, { ParticlesProvider } from '@tsparticles/react';
import type { Engine, ISourceOptions } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';

const initializeParticles = async (engine: Engine) => { await loadSlim(engine); };

export default function ParticleCanvas({ compact }: { compact: boolean }) {
  const options = useMemo<ISourceOptions>(() => ({
    fullScreen: { enable: false },
    background: { color: { value: 'transparent' } },
    fpsLimit: 30,
    detectRetina: false,
    pauseOnBlur: true,
    pauseOnOutsideViewport: true,
    interactivity: {
      // Listen through the decorative canvas without intercepting page controls.
      detectsOn: 'window',
      events: {
        onHover: { enable: !compact, mode: 'grab' },
        onClick: { enable: !compact, mode: 'repulse' },
      },
      modes: {
        grab: { distance: 150, links: { opacity: 0.7 } },
        repulse: { distance: 110, duration: 0.5 },
      },
    },
    particles: {
      number: { value: compact ? 32 : 80, density: { enable: true, width: 1440, height: 900 } },
      color: { value: ['#baf4ff', '#5cdcff', '#ffffff', '#ffe6ac'] },
      shape: { type: 'circle' },
      opacity: { value: { min: 0.2, max: 0.65 }, animation: { enable: true, speed: 0.35, sync: false } },
      size: { value: { min: 1, max: compact ? 2.5 : 3 } },
      links: { enable: true, distance: compact ? 90 : 125, color: '#8ceaff', opacity: 0.4, width: 1.1 },
      move: { enable: true, speed: compact ? 0.35 : 0.55, direction: 'none', random: true, straight: false, outModes: { default: 'out' } },
    },
  }), [compact]);

  return <ParticlesProvider init={initializeParticles}>
    <Particles id="nyc-background-particles" options={options} />
  </ParticlesProvider>;
}
