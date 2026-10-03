# Sound Design Matrix & Audio Architecture

Audio accounts for 50% of cinematic perception. In Zomotion, sound design is treated with the same mathematical precision as camera motion.

---

## 1. The 16 SFX Families

The Zomotion sound design library organizes curated, royalty-free SFX across 16 thematic categories:

| Category | Primary Use Case | Representative Samples | Character |
| :--- | :--- | :--- | :--- |
| **`impact`** | Card landings, stamp slams, modal drop | `sub-drop`, `hit-heavy`, `slam-reverb` | Deep sub-bass (40-90Hz), clean acoustic tail |
| **`riser`** | Pre-landing build-up, scene climax | `whoosh-rise`, `pitch-swell`, `glitch-rise` | Tension crescendo, white/pink noise sweep |
| **`transition`** | Camera whip, rapid pans, scene cut | `whoosh-fast`, `whip-heavy`, `air-pass` | Clean aerodynamic displacement |
| **`light`** | Sheen sweeps, glints, neon activations | `sparkle-sheen`, `shimmer-subtle`, `lens-flare` | High-frequency acoustic sparkle (2-8kHz) |
| **`camera`** | Shutter clicks, focus lens snaps | `shutter-single`, `lens-zoom-whir`, `aperture` | Mechanical tactile precision |
| **`ui`** | Switches, real physical clicks | `switch-light`, `switch-tap`, `click-quick` | Tactile hardware (no synthesizer bloops) |
| **`text`** | Typewriters, pen/marker friction | `keyboard-type`, `marker-stroke`, `paper-rub` | Textured friction Foley |
| **`data`** | Network pulses, digital odometers | `counter-tick`, `data-stream`, `charge-pulse` | Discrete micro-clicks, rhythmic pulses |
| **`paper`** | Card deal, page turns, document fold | `card-deal`, `sheet-slide`, `paper-flip` | Organic acoustic paper texture |
| **`mech`** | Gear ratchets, latch locks, slot snap | `latch-lock`, `ratchet-step`, `dock-snap` | Heavy mechanical locking |
| **`scifi`** | Holographic boot, warp pulse | `holo-hum`, `portal-charge`, `scan-beep` | Premium cinematic soundscapes |
| **`glass`** | Shards, crystalline accents | `glass-ting`, `crystal-ping`, `prism-break` | Pure harmonic resonance |
| **`film`** | Projector gate, film grain reel | `projector-click`, `leader-countdown` | Nostalgic analog cinema |
| **`fluid`** | Wave wash, droplet ping | `drop-clean`, `sub-bubble`, `tide-wash` | Organic fluidity |
| **`crowd`** | Subtle convention murmur, applause | `applause-warm`, `ambient-hall` | Live event presence |
| **`counter`** | Mechanical split-flap, slot reel | `flap-single`, `reel-stop`, `ticker-rapid` | High-precision tick |

---

## 2. The Core Audio Rules (S1 - S5)

### Rule S1: Authentic Cinematic Foley vs Synthesizer Bloops
- **Forbidden**: Video game plucks, cartoon spring bounces, 8-bit chiptune beeps, and generic notification bloops.
- **Allowed**: Tangible real-world materials (photographic shutters, mechanical toggles, brushed metal, dry-erase marker friction).
- **Rule of Thumb**: Does this sound like a real object in physical space or a mobile game UI?

### Rule S2: Stepped Volume Decay for Repeated Bursts
When multiple elements cascade into view (e.g. 5 cards in `deck-deal-flyin` or a series of bullet points):
- **Never repeat identical volume**: Consecutive identical sounds cause "machine gun fatigue".
- **Apply stepped decay**: e.g., Card 1: 0.40 $\rightarrow$ Card 2: 0.35 $\rightarrow$ Card 3: 0.30 $\rightarrow$ Card 4: 0.25.
- **Alternate samples**: Swap between two audio variations (e.g. `card-deal-A` and `card-deal-B`).

### Rule S3: Freeze Visual Timeline Before Final Audio Pinning
Sound design is pinned to exact visual frames. Always lock visual cut points and camera trajectories before finalizing SFX timestamps. Any change to visual duration requires auditing the audio cue table.

### Rule S4: Strict Sample Window Truncation
- Samples $>5\text{s}$ must have explicit `durationInFrames` in `<Sequence>` wrappers.
- Action Foley (like typing or a camera zoom) must terminate strictly when the visual action finishes.

### Rule S5: The AAC Priming Offset Compensation Formula
When rendering video and muxing audio through Chromium's AAC encoder, an inherent priming buffer of $\sim 2048$ audio samples ($\approx 1.28$ frames at 30fps / 48kHz) is injected into the audio stream.
Without compensation, impacts hit 1-2 frames late, making sharp edits feel sloppy.

**The Master Timing Formula**:
$$\text{from} = \max\left(0, \text{round}(\text{targetVisualFrame} - \Delta_{\text{priming}} - \Delta_{\text{attack}})\right)$$

Where:
- $\text{targetVisualFrame}$: The exact video frame of impact.
- $\Delta_{\text{priming}}$: 1.28 frames (for standard 30fps AAC export).
- $\Delta_{\text{attack}}$: Number of frames from audio file start to its acoustic peak.

---

## 3. The Classic Sentence: Riser $\rightarrow$ Impact $\rightarrow$ Sheen

Most high-energy product video moments follow this three-part audio sentence:
1. **Riser (`riser/`)**: Begins 12-24 frames before impact, building acoustic tension as the element scales in.
2. **Impact (`impact/`)**: Hits on the exact frame the element contacts the surface or snaps to 1.0 scale.
3. **Sheen / Sparkle (`light/`)**: 8-16 frames after impact, subtle high-frequency glimmer accompanies the specular glint sweep.
