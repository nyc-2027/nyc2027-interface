import ParticleBackground from './particle-background';
export default function AmbientLights() {
  return <><div className="ambient-lights" aria-hidden="true">
    {[0, 1, 2, 3].map(index => <span className={`ambient-orb orb-${index}`} key={`orb-${index}`} />)}
  </div><ParticleBackground /></>;
}
