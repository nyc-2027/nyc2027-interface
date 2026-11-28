import type { CSSProperties } from 'react';
export default function AmbientLights() {
  return <div className="ambient-lights" aria-hidden="true">
    {[0, 1, 2, 3].map(index => <span className={`ambient-orb orb-${index}`} key={`orb-${index}`} />)}
    {Array.from({ length: 72 }, (_, index) => <span className={`ambient-spark ${index % 5 === 0 ? 'ambient-star' : 'ambient-dust'}`} key={index} style={{
      left: `${2 + (index * 37) % 96}%`, top: `${3 + index * 1.3}%`,
      '--spark-size': `${index % 5 === 0 ? 5 + index % 4 : 2 + index % 3}px`,
      '--spark-delay': `${-(index * 7 % 29)}s`, '--spark-duration': `${12 + index % 15}s`,
      '--spark-drift-x': `${(index % 2 ? -1 : 1) * (12 + index % 22)}px`,
      '--spark-drift-y': `${-18 - index % 32}px`,
    } as CSSProperties} />)}
  </div>;
}
