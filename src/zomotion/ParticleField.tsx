import React from 'react';
import { mulberry32 } from './motion-helpers';

export interface Particle {
  /** Where it starts — flung out past the frame edge. */
  sx: number;
  sy: number;
  /** Where it locks to. */
  tx: number;
  ty: number;
  r: number;
  /** Per-particle delay so the swarm arrives ragged, not in lockstep. */
  delay: number;
  /** Per-particle drift once locked, so the lockup is never perfectly static. */
  drift: number;
  a: number;
}

/**
 * Builds a deterministic particle swarm whose targets spell out `glyphs` as a
 * ring-and-arc pattern. Real text rasterisation isn't reachable from here, so
 * the lockup is a lissajous-shaped halo that the wordmark then resolves inside
 * of — the particles converge on the *silhouette region*, not on glyph
 * outlines, and the type lands on top of them once they have settled.
 *
 * Seeded, so every render of every frame is identical.
 */
export const buildParticles = (count: number, seed = 7): Particle[] => {
  const rnd = mulberry32(seed);
  const out: Particle[] = [];
  for (let i = 0; i < count; i++) {
    // Target: an elliptical halo, but heavily jittered in angle and radius —
    // an even ring reads as a stock orbit graphic rather than a swarm.
    const t = rnd() * Math.PI * 2;
    const band = 0.6 + rnd() * 0.7;
    const jitter = 1 + (rnd() - 0.5) * 0.34;
    const tx = Math.cos(t) * 780 * band * jitter;
    const ty = Math.sin(t) * 215 * band * jitter;

    // Start: far outside the frame, biased outward along its own bearing.
    const dir = Math.atan2(ty, tx) + (rnd() - 0.5) * 1.5;
    const dist = 900 + rnd() * 1100;
    out.push({
      sx: Math.cos(dir) * dist,
      sy: Math.sin(dir) * dist,
      tx,
      ty,
      r: 1 + rnd() * 2.4,
      delay: rnd() * 26,
      drift: rnd() * Math.PI * 2,
      a: 0.25 + rnd() * 0.6,
    });
  }
  return out;
};

export const ParticleField: React.FC<{
  particles: Particle[];
  /** Global frame, already offset by the parent Sequence. */
  frame: number;
  /** Frames over which the swarm travels from its start to its target. */
  travel: number;
  color: string;
  glow?: boolean;
}> = ({ particles, frame, travel, color, glow = true }) => (
  <>
    {particles.map((p, i) => {
      const local = frame - p.delay;
      if (local < 0) return null;
      const t = Math.min(1, local / travel);
      // Ease-out-quart: the swarm decelerates hard into the lockup, which is
      // what sells the convergence as physical rather than linear.
      const e = 1 - Math.pow(1 - t, 4);
      const x = p.sx + (p.tx - p.sx) * e;
      const y = p.sy + (p.ty - p.sy) * e;
      // After locking, a slow orbital drift so the field is never frozen.
      const settle = t >= 1 ? (frame - p.delay - travel) * 0.006 : 0;
      const ox = Math.cos(p.drift + settle) * settle * 22;
      const oy = Math.sin(p.drift + settle) * settle * 10;
      const opacity = p.a * (0.35 + 0.65 * e) * (t >= 1 ? 0.85 : 1);
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 960 + x + ox - p.r,
            top: 540 + y + oy - p.r,
            width: p.r * 2,
            height: p.r * 2,
            borderRadius: '50%',
            background: color,
            opacity,
            boxShadow: glow ? `0 0 ${p.r * 5}px ${color}` : undefined,
          }}
        />
      );
    })}
  </>
);
