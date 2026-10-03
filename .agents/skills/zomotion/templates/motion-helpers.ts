/**
 * Zomotion motion physics & deterministic math helpers
 * Deterministic frame clock physics and cinematic animation principles.
 */

/**
 * 32-bit deterministic pseudo-random number generator (Mulberry32).
 * Guarantees frame-by-frame rendering determinism without Date.now() or Math.random().
 */
export const mulberry32 = (seed: number): (() => number) => {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/**
 * Creates a deterministic random number in [min, max] based on a numeric seed or index.
 */
export const seededRandom = (seed: number, min = 0, max = 1): number => {
  const rng = mulberry32(seed);
  return min + rng() * (max - min);
};

/**
 * Motion-derived velocity signal: samples a pure trajectory function at frame ± dt
 * using central difference to obtain velocity vector, instantaneous speed, and heading.
 * Useful for driving stretch, motion blur, smear, or impact intensity.
 */
export const velocityAt = (
  posAt: (f: number) => { x: number; y: number },
  frame: number,
  dt = 0.5,
): { vx: number; vy: number; speed: number; direction: number } => {
  const before = posAt(frame - dt);
  const after = posAt(frame + dt);
  const vx = (after.x - before.x) / (2 * dt);
  const vy = (after.y - before.y) / (2 * dt);
  return { vx, vy, speed: Math.hypot(vx, vy), direction: Math.atan2(vy, vx) };
};

/**
 * Pure follow-through drag hierarchy without mutable state:
 * Evaluates primary trajectory at `frame - delayFrames`.
 * Trailing elements (shadows, badges, ghosts) achieve cinematic drag by simply sampling
 * upstream state with higher delay frames and attenuated amplitude.
 */
export const lagged = <T>(
  stateAt: (f: number) => T,
  frame: number,
  delayFrames: number,
): T => stateAt(frame - delayFrames);

/**
 * Closed-form damped oscillation for recoil/settling tails:
 * t: frames elapsed since impact (t <= 0 yields 0)
 * freq: oscillation frequency in cycles/frame (typically ~0.08 to 0.15)
 * damping: decay coefficient per frame (typically ~0.12 to 0.25)
 * Formula: e^(-damping * t) * sin(2 * PI * freq * t)
 */
export const dampedSettle = (t: number, freq = 0.1, damping = 0.15): number => {
  if (t <= 0) return 0;
  return Math.exp(-damping * t) * Math.sin(2 * Math.PI * freq * t);
};

/**
 * Deterministic camera micro-shake / handheld noise.
 * Generates continuous smooth pseudo-random displacement using sine harmonic superposition.
 */
export const handheld = (
  frame: number,
  seed = 42,
  freq = 0.08,
  amplitude = 1.0,
): { x: number; y: number; rot: number } => {
  const r1 = seededRandom(seed, 0.7, 1.3);
  const r2 = seededRandom(seed + 1, 0.7, 1.3);
  const r3 = seededRandom(seed + 2, 0.7, 1.3);

  const t = frame * freq;
  const x =
    (Math.sin(t * r1) * 0.6 + Math.sin(t * 2.3 * r2) * 0.3 + Math.sin(t * 4.7) * 0.1) *
    amplitude;
  const y =
    (Math.cos(t * 1.1 * r2) * 0.6 + Math.cos(t * 2.7 * r1) * 0.3 + Math.sin(t * 5.1) * 0.1) *
    amplitude;
  const rot = (Math.sin(t * 0.9 * r3) * 0.7 + Math.cos(t * 1.8) * 0.3) * (amplitude * 0.2);

  return { x, y, rot };
};

/**
 * Calculates exact video frame corresponding to musical beat number.
 * beat: 0-indexed beat count
 * bpm: musical tempo
 * fps: video frame rate (e.g. 30 or 60)
 * offsetFrames: initial delay until musical downbeat
 */
export const beatToFrame = (
  beat: number,
  bpm: number,
  fps = 30,
  offsetFrames = 0,
): number => {
  const framesPerBeat = (60 / bpm) * fps;
  return Math.round(offsetFrames + beat * framesPerBeat);
};
