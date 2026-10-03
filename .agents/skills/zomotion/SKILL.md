---
name: zomotion
description: >-
  Create cinematic programmatic motion graphics, product promo videos, and animated UI
  components with cinematic effects. Combines programmatic React video composition
  with 157 verified shot recipes, 2.5D PageCam camera moves, layout-scale zoom,
  beat-synced rhythm grid, closed-form physics, and 16-family sound design. Use when
  creating high-end programmatic video animations, kinetic typography, hero product cards,
  dashboard flythroughs, or promo videos.
---

# Zomotion: Cinematic Programmatic Motion Graphics Engine

This skill provides a unified motion engine for high-end programmatic video composition, combining declarative React video architecture with cinematic camera movement, physics-driven animation dynamics, and a 16-family sound design system.

---

## 1. Architectural Philosophy

Standard code-generated videos often suffer from three telltale defects:
1. **Linear Velocity & Rigid Timing**: Elements move at constant speeds without physical acceleration or rest breathing room.
2. **Chromium Downsample Blur**: Applying standard 3D scale transforms (`scale(zoom)`) causes Chromium to rasterize UI layers at 1920px layout dimensions before scaling them on the GPU, blurring fine typography and micro-details.
3. **Cheesy Audio & Video Game Bloops**: Soundtracks populated with cartoon plucks and notifications rather than authentic acoustic textures (shutter clicks, tactile switches, sub-bass impacts).

`zomotion` resolves these defects by implementing:
- **Layout-Scale CSS Zoom**: Keeps typography pin-sharp at any camera magnification factor.
- **Physical Spring & Damped Recoil**: Closed-form mathematical oscillators (`dampedSettle`, `velocityAt`, `lagged`).
- **Deterministic 32-Bit Pseudo-Randomness (`mulberry32`)**: Eliminates non-deterministic render tearing across parallel render workers.
- **Acoustic Hierarchy & Priming Compensation**: Automatic $-1.28\text{f}$ AAC priming offset compensation, stepped volume decay, and authentic Foley.

---

## 2. Quickstart: Building a Scene with Zomotion

### Step 1: Scaffold or Import Zomotion Primitives
Copy the verified primitives from `templates/` into your project (`src/zomotion/`):
- `PageCam.tsx`: 2.5D perspective camera with layout-scale zoom and DoF masking.
- `SpotlightHeroCard.tsx`: Product card with dynamic spotlight and clipped specular sheen.
- `KineticTypography.tsx`: `lead-word-zoom-assemble` signature text reveal.
- `DigitRoll.tsx`: Mechanical odometer counter with physics-based recoil.
- `FlashCut.tsx`: Chromatic energy-transfer transition.
- `SoundTimeline.tsx`: Frame-pinned audio engine with AAC priming offset compensation.
- `motion-helpers.ts`: Closed-form physics formulas (`dampedSettle`, `mulberry32`, `velocityAt`).

Or run the bundled scaffolding utility:
```bash
node scripts/scaffold-zomotion.mjs [target-project-path]
```

### Step 2: Compose Scenes Declaratively
```tsx
import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { KineticTypography } from './zomotion/KineticTypography';
import { SpotlightHeroCard } from './zomotion/SpotlightHeroCard';
import { FlashCut } from './zomotion/FlashCut';

export const MyCinematicPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#07070a' }}>
      {/* 0 - 84f: Kinetic Typography Entrance */}
      <Sequence from={0} durationInFrames={84}>
        <KineticTypography
          leadWord="VELOCITY"
          followingWords={['AT', 'SCALE']}
          subtitle="Engineered for high-retention cinematic delivery"
          leadHighlightColor="#6366f1"
        />
      </Sequence>

      {/* 84 - 90f: Impact Flash Cut */}
      <Sequence from={84} durationInFrames={6}>
        <FlashCut flashColor="#6366f1" peakOpacity={0.9} />
      </Sequence>

      {/* 84 - 180f: Protagonist Hero Card */}
      <Sequence from={84} durationInFrames={96}>
        <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SpotlightHeroCard
            title="Next-Gen Architecture"
            subtitle="Physics-driven 2.5D camera moves with deterministic frame rendering."
            badge="v2.0"
            accentColor="#6366f1"
          />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
```

---

## 3. The 10 Verified Recipe Families

The skill incorporates 157 proven shot formulas across 10 functional families. See [`references/shot-recipes.md`](./references/shot-recipes.md) for full parameters:

1. **`typography`**:
   - `lead-word-zoom-assemble`: Hero word appears at 2.3x scale, holds with +6% push, retracts to 1.0x while sliding into place as following words stagger in.
   - `split-flap-title`: Departure board mechanical flap cycling through characters before locking.
   - `marker-underline-title`: Organic SVG stroke drawing with dynamic taper.
2. **`ui-entrance`**:
   - `deck-deal-flyin`: Cards fly in progressively faster with physical spring recoil.
   - `spotlight-hero-card`: Single hero card with 3D elevation, ambient lighting drift, and single sheen sweep.
   - `cascade-drop`: Vertical cascade of list rows with damped bottom bounce.
3. **`camera`**:
   - `orbit-pile`: Oblique 3D orbit around stacked documents with pullout.
   - `snap-zoom-focus`: Rapid 6-frame snap zoom to inspect specific metric.
   - `dutch-angle-glide`: Subtle in-plane roll during horizontal pan.
4. **`data`**:
   - `digit-roll`: Mechanical odometer counter with independent column deceleration.
   - `radial-ring-progress`: Glowing SVG circular progress gauge.
5. **`effects`**:
   - `spotlight-beam`: Conical volumetric lighting.
   - `glint-sheen`: Single specular sheen strictly masked to element `borderRadius` (**Rule Q4**).
6. **`transition`**:
   - `flash-cut`: 1-2 frame chromatic burst.
   - `whip-pan`: Directional motion blur across scene boundaries.
7. **`rhythm`**:
   - `beat-slam`: Element-level transient punch on kick drum (**Rule R4** limits full-screen slams to $\le 3$ per video).
8. **`interaction`**:
   - Simulated cursor hovering, realistic typing delays, and physical button presses.
9. **`opening`**:
   - `hero-macro-opening`: Focused single-element 3.0s action arc.
10. **`outro`**:
    - `showcase-assembly`: Climax assembly bringing all featured elements around the brand mark.

---

## 4. The 2.5D Perspective Camera (`PageCam`)

See [`references/camera-25d.md`](./references/camera-25d.md).

### The Layout-Scale Zoom Innovation
Standard GPU transforms downsample layers before scaling. `PageCam` applies magnification directly via the CSS `zoom` property, calculating offset coordinates to keep the focal center `(cx, cy)` locked:

$$T_x = \frac{960}{\text{zoom}} - \text{cx}, \quad T_y = \frac{540}{\text{zoom}} - \text{cy}$$

```tsx
<PageCam
  src="textures/dashboard_2x.png"
  pageH={2400}
  keys={[
    { frame: 0, cx: 960, cy: 300, zoom: 1.0, rotX: 0, rotY: 0 },
    { frame: 45, cx: 420, cy: 780, zoom: 1.6, rotX: 14, rotY: -8 },
  ]}
  dof={{ focusY: 600, strength: 8 }}
/>
```

---

## 5. Sound Design & Audio Synchronization

See [`references/sound-design-matrix.md`](./references/sound-design-matrix.md).

### Declarative Cue Table & Priming Compensation
AAC encoders introduce $\approx 1.28$ frames of priming latency. `SoundTimeline` compensates automatically:

```tsx
import { SoundTimeline, SoundCue } from './zomotion/SoundTimeline';

const AUDIO_CUES: SoundCue[] = [
  { frame: 24, src: 'audio/sfx/impact/sub-drop.mp3', volume: 0.7, label: 'hero-impact' },
  { frame: 38, src: 'audio/sfx/light/sparkle-sheen.mp3', volume: 0.35, label: 'card-sheen' },
];

<SoundTimeline cues={AUDIO_CUES} bgmSrc="audio/bgm/cyber-drive.mp3" enableBgm={true} />
```

### The Three Golden Audio Rules:
1. **Rule S1**: Authentic Foley (shutters, switches, cards) over synthetic game bloops.
2. **Rule S2**: Stepped volume decay ($0.40 \rightarrow 0.35 \rightarrow 0.30$) for rapid repeated events.
3. **Rule S4**: Truncate long audio files ($>5\text{s}$) to match visual action duration.

---

## 6. Pre-Flight Aesthetic Audit Checklist

Before delivering or rendering, run through [`references/aesthetic-checklist.md`](./references/aesthetic-checklist.md):
- [ ] **R1**: Brand logos hold stationary for $\ge 1.0\text{s}$ (30 frames); cards hold $\ge 0.5\text{s}$.
- [ ] **R2**: Acceleration over constant velocity; group entrances speed up progressively.
- [ ] **R4**: Full-screen camera slams limited to $\le 3$ per entire video.
- [ ] **Q1**: Real product UI textures captured at 2x resolution; no cheap hand-crafted mockups.
- [ ] **Q2**: Typography in 3D uses layout-scale CSS zoom for pin-sharp glyph edges.
- [ ] **Q4**: Specular glints appear maximum 1 time per shot, strictly masked within `borderRadius`.
- [ ] **Q11**: Narrative captions measure $\ge 56\text{px}$; secondary labels $\ge 32\text{px}$.
- [ ] **S5**: Audio cues compensate for $-1.28\text{f}$ AAC priming latency.
- [ ] **P2**: All pseudo-random motion uses deterministic `mulberry32` with integer seeds.

---

## 7. Previewing & Rendering

```bash
# Launch Zomotion Studio with fast refresh
npm run dev

# Export still frame for visual quality inspection (P1)
npm run still -- --frame=45 out/still-f45.png

# Render final production video
npm run render
```
