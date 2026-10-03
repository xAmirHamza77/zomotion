# Aesthetic Pre-Flight Quality Checklist

Before completing or rendering any Zomotion video, audit the composition against these case-tested quality laws.

---

## 1. Rhythm & Timing (R)

- [ ] **R1: Hold for Breathing Space**: Key informative elements (cards, summary metrics, diagrams) must rest stationary for $\ge 0.5\text{s}$ (15f). Brand logos and primary wordmarks must hold stationary for **$\ge 1.0\text{s}$ (30 frames)**.
- [ ] **R2: Acceleration Over Constant Velocity**: Never use linear uniform speed for entrances or scrolling. Elements enter with crisp acceleration and non-uniform stagger; card sequences accelerate progressively.
- [ ] **R3: Default to Deliberate Pacing**: When in doubt, slow down by one notch. Protagonist hero action arcs should span $\ge 3.0\text{s}$ (90 frames). Simulated typing and mouse interactions must follow human operating speeds.
- [ ] **R4: Strict Screen-Slam Budget**: Full-screen camera slams, strobe cuts, or viewport scale punches are limited to **$\le 3$ occurrences per entire video**. Normal beats animate element-level properties only.

---

## 2. Quality, Camera & Framing (Q)

- [ ] **Q1: Authentic UI Textures**: Real product screens must be captured via headless browser at 2x resolution (`deviceScaleFactor: 2`). Hand-crafted mock UI is reserved only for abstract or non-existent components.
- [ ] **Q2: Pin-Sharp Text in 3D Perspective**: In 3D perspective scenes, ensure magnification uses layout-scale CSS `zoom` and `PageCam` math rather than GPU-upscaled `transform: scale()`.
- [ ] **Q3: Camera Stability**: Product showcase videos must NOT include random handheld camera shake unless explicitly creating a gritty dark-mode teaser.
- [ ] **Q4: Controlled Specular Sheen**: Never broadcast full-screen glints or flash every card. Maximum 1 sheen sweep on the protagonist element per shot, strictly masked within `borderRadius` via `overflow: hidden`.
- [ ] **Q5: Single Protagonist Focus**: Opening scenes must focus on a single protagonist card or element with a complete action arc (illuminate $\rightarrow$ float $\rightarrow$ settle), not multiple competing dancers.
- [ ] **Q6: Functional Camera Angles**: Text-heavy lists and tabular data require straight-on orthographic viewing (`rotX: 0, rotY: 0`). Perspective tilts are reserved for hero cards, floating piles, and transitions.
- [ ] **Q7: Oblique Close-Up Setup**: Feature close-ups should leverage low oblique angle, visible 3D layer elevation, subtle orbit rotation, and deep contrasting background.
- [ ] **Q8: Climactic Outro Assembly**: Product promos should conclude with an assembly shot bringing together key assets into a unified "family portrait" around the brand mark.
- [ ] **Q9: Grounded Slot Destinations**: Flying UI elements must land into genuine grid or layout slots; elements should not float permanently without structural context.
- [ ] **Q10: High-Fidelity Mock Typography**: Mock documents must feature realistic paragraph layout, authentic line lengths, and complete sidebars.
- [ ] **Q11: Minimum Legible Text Height**:
  - Narrative subtitles and captions must measure **$\ge 56\text{px}$** (effective height in 1080p).
  - Secondary badges, URLs, and metrics must measure **$\ge 32\text{px}$**.

---

## 3. Sound Design (S)

- [ ] **S1: Authentic Foley Over Cartoonish Bloops**: Audio palette consists of real physical textures (`whoosh`, `impact`, `shutter`, `switch`, `sheen`). Avoid synthesizer bleeps, 8-bit blips, and cartoon spring noises.
- [ ] **S2: Stepped Volume Decay on Repetitions**: Cascading elements or repeated clicks must use alternating samples and decreasing volume steps ($0.40 \rightarrow 0.35 \rightarrow 0.30 \dots$).
- [ ] **S3: Freeze Timeline Before Final Audio Pinning**: SFX cue timestamps are locked only after visual frames are finalized.
- [ ] **S4: Sample Window Truncation**: Action Foley (typing, zooming) is truncated to match visual action duration. Long samples ($>5\text{s}$) have explicit `durationInFrames`.
- [ ] **S5: AAC Priming Offset Compensation**: Audio cues apply $\approx 1.28$ frame priming delay compensation formula: `from = Math.max(0, targetFrame - 1.28f - peakLag)`.

---

## 4. Copywriting (C)

- [ ] **C1: Matched Commentary**: Every scene is accompanied by concise, synchronized narrative captions; no silent visual voids.
- [ ] **C2: Concrete Feature Benefits**: Copy highlights explicit functionality and value rather than vague abstractions.
- [ ] **C3: Integrated 3D Space**: Annotations inside 3D scenes live inside the 3D plane with matching tilt and perspective.

---

## 5. Engineering & Review Process (P)

- [ ] **P1: Self-Inspection via Rendered Stills**: Use `npm run still` to inspect still frames at critical inflection points before presenting to users.
- [ ] **P2: Frame-by-Frame Determinism**: No `Math.random()` or `Date.now()`. All pseudo-randomness derives deterministically from index or seed via `mulberry32`.
- [ ] **P3: Non-Redundant Motion Techniques**: Each motion technique (card fan, split-flap, 3D orbit) serves as the primary protagonist only once in the video.
