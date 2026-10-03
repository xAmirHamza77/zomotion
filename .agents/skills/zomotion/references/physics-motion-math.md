# Physics & Deterministic Motion Math

Videos render frame-by-frame across multiple concurrent worker threads. To achieve cinematic weight while maintaining 100% frame determinism, the Zomotion engine relies on closed-form physics and seedable random generators.

---

## 1. Frame Determinism: The Mulberry32 Generator

### The Rule
**Never use `Math.random()` or `Date.now()` inside video components.**
Because rendering frames occurs out-of-order across parallel worker processes, non-deterministic generators cause visual jitter, tearing, and flickering between adjacent frames.

### Implementation
```typescript
export const mulberry32 = (seed: number): (() => number) => {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
```
Derived properties (e.g. card rotation, particle positions, stagger delays) must always be keyed to the item's index or a fixed integer seed:
```typescript
const rotation = seededRandom(itemIndex * 997, -3.5, 3.5);
```

---

## 2. Velocity Extraction (`velocityAt`)

When animating an object along an arbitrary path $P(t) = (x(t), y(t))$, visual effects like motion blur, directional smear, or squash-and-stretch require the object's instantaneous velocity vector and heading direction.

Instead of maintaining mutable state across frames, we evaluate central difference:
$$\mathbf{v}(t) \approx \frac{P(t + \Delta t) - P(t - \Delta t)}{2 \Delta t}$$

```typescript
export const velocityAt = (
  posAt: (f: number) => { x: number; y: number },
  frame: number,
  dt = 0.5,
) => {
  const before = posAt(frame - dt);
  const after = posAt(frame + dt);
  const vx = (after.x - before.x) / (2 * dt);
  const vy = (after.y - before.y) / (2 * dt);
  return { vx, vy, speed: Math.hypot(vx, vy), direction: Math.atan2(vy, vx) };
};
```

---

## 3. Lagged Follow-Through Drag Hierarchy (`lagged`)

In classic animation (Disney's 12 Principles), appendages, hair, drop shadows, and badge attachments drag behind the primary body.

In Zomotion, this is achieved purely functionally:
```typescript
export const lagged = <T>(
  stateAt: (f: number) => T,
  frame: number,
  delayFrames: number,
): T => stateAt(frame - delayFrames);
```

### Hierarchy Recipe:
1. **Primary Card**: Evaluated at current `frame`.
2. **Ambient Drop Shadow**: Evaluated at `frame - 2` with reduced amplitude.
3. **Trailing Badge / Floating Chip**: Evaluated at `frame - 4` with subtle spring overshoot.

---

## 4. Closed-Form Damped Oscillation (`dampedSettle`)

When a card lands, a counter snaps, or an element stops, linear easing feels synthetic. Standard springs can be difficult to blend with prior interpolation curves. The closed-form damped harmonic oscillator solves this:

$$f(t) = e^{-\gamma t} \sin(2\pi \omega t) \quad (t > 0)$$

Where:
- $t$: Elapsed frames since collision/arrival ($t \le 0 \implies 0$).
- $\omega$: Frequency in cycles per frame ($\sim 0.08 - 0.15$).
- $\gamma$: Damping coefficient per frame ($\sim 0.12 - 0.25$).

```typescript
export const dampedSettle = (t: number, freq = 0.1, damping = 0.15): number =>
  t <= 0 ? 0 : Math.exp(-damping * t) * Math.sin(2 * Math.PI * freq * t);
```
Simply scale this factor by the desired recoil distance (e.g. `dampedSettle(t) * 12px`).

---

## 5. Organic Handheld Micro-Camera Noise (`handheld`)

For documentary, technical, or dark-mode scenes requiring visceral realism, camera motion should exhibit subtle human hand tremor without jarring jitter:

```typescript
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
  const x = (Math.sin(t * r1) * 0.6 + Math.sin(t * 2.3 * r2) * 0.3) * amplitude;
  const y = (Math.cos(t * 1.1 * r2) * 0.6 + Math.cos(t * 2.7 * r1) * 0.3) * amplitude;
  const rot = (Math.sin(t * 0.9 * r3) * 0.7 + Math.cos(t * 1.8) * 0.3) * (amplitude * 0.2);

  return { x, y, rot };
};
```
*Note*: Per **Aesthetic Rule Q3**, product UI promo videos should default to stable cameras without handheld shake. Use only in moody dark-mode teasers.
