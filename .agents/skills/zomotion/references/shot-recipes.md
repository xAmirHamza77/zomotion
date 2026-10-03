# Zomotion 157 Shot Recipes: Motion Graphics Reference

The Zomotion motion library categorizes 157 verified cinematic motion recipes across 10 functional families. Below is the specification, easing dynamics, and audio pairing for high-frequency motion graphics cards implemented in Zomotion.

---

## 1. Typography Family (`typography`)

| Shot Card | Purpose / Visual Motion | Frame Budget | Key Curves & Dynamics | SFX Pairing |
| :--- | :--- | :--- | :--- | :--- |
| **`lead-word-zoom-assemble`** | First word appears at 2.3x scale center screen, holds with +6% push, then retracts to 1.0x while sliding left as subsequent words stagger into place (+0.5em push). | 84f (~2.8s) | `PUSH_EASE` = `cubic-bezier(.25,1,.5,1)`, `ZOOM_EASE` = `cubic-bezier(.5,0,.05,1)`, word stagger = 4f | Riser build → Subtle impact on word snap → gentle swoosh on subtitle |
| **`split-flap-title`** | Departure board mechanical letter flip. Characters cycle rapidly through alphabet before locking left-to-right. | 60f (~2.0s) | Non-linear cycle delay: `cycleCount = 6 + i*2`, lock interval = 3f | `ui/switch-click-quick` (stepped volume 0.40 → 0.25) |
| **`marker-underline-title`** | Hand-drawn marker stroke draws beneath key title or keyword, with organic taper and slight thickness pulsation. | 45f (~1.5s) | SVG `strokeDashoffset` interpolation via `Easing.out(Easing.cubic)` | `text/paper-marker-stroke` or `ui/light-switch` |
| **`glitch-cycle`** | Kinetic typography cycling through 3 synonyms or values with RGB channel displacement and 1-frame chromatic shear. | 36f (~1.2s) | Shear: `[-8px, 12px, 0]`, step timing every 12f | `scifi/glitch-digital` or `mech/click-sharp` |
| **`document-typewriter-reveal`** | Monospace or prose text typing out character-by-character with blinking caret and line feeds. | 60-90f | 1 character per 2 frames, variable pause at commas/periods (+4f) | `ui/keyboard-type` (truncated sequence) |

---

## 2. UI Entrance Family (`ui-entrance`)

| Shot Card | Purpose / Visual Motion | Frame Budget | Key Curves & Dynamics | SFX Pairing |
| :--- | :--- | :--- | :--- | :--- |
| **`deck-deal-flyin`** | Multiple cards fly into position from bottom-right like a dealer throwing playing cards, accelerating progressively. | 72f (~2.4s) | Acceleration curve: `t_i = totalFrames * (1 - (1 - i/N)^2)`, damped spring settle | `paper/card-deal` or `transition/whoosh-fast` |
| **`spotlight-hero-card`** | Single product card zooms forward, lifts in 3D, ambient spotlight drifts across face, single sheen sweeps across surface. | 90f (~3.0s) | Spring entrance (mass 0.9, damping 14), 1 glint sweep (f24-48) clipped to border-radius | `impact/sub-drop` → `light/sparkle-sheen` |
| **`cascade-drop`** | Grid or list rows drop into place vertically with physics-based stagger and elastic bottom bounce. | 54f (~1.8s) | Row stagger = 3f, overshoot bounce via `dampedSettle(t, 0.14, 0.2)` | `ui/pop-soft` with stepped volume decay |
| **`accordion-unfold`** | Collapsed panel unfolds downward with 3D perspective fold (`rotateX -90deg -> 0deg`). | 40f (~1.3s) | Perspective = 1200px, `Easing.bezier(0.2, 0.8, 0.2, 1)` | `mech/panel-snap` |

---

## 3. 2.5D Camera Family (`camera`)

| Shot Card | Purpose / Visual Motion | Frame Budget | Key Curves & Dynamics | SFX Pairing |
| :--- | :--- | :--- | :--- | :--- |
| **`orbit-pile`** | Camera circles 3D stacked cards/documents from an oblique low angle while slowly pulling out. | 90-120f | `rotY: [-18deg -> +8deg]`, `rotX: [12deg -> 6deg]`, `zoom: [1.4 -> 1.05]` | Deep cinematic rumble / riser |
| **`dolly-zoom-vertigo`** | Camera pushes forward in Z while focal length widens (or vice-versa), background shifts dramatically while hero stays constant. | 75f (~2.5s) | `zoom * distance = constant`, exponential ease | Riser crescendo |
| **`snap-zoom-focus`** | Quick 6-frame snap zoom into a specific UI button or metric, followed by micro-settling. | 30f (~1.0s) | Snap interval = 6f (`Easing.bezier(0.8, 0, 0.2, 1)`), damped settle = 12f | `camera/shutter-click` or `whoosh-short` |
| **`dutch-angle-glide`** | Subtle tilt roll (`rotZ: 4deg -> -2deg`) during horizontal pan across wide dashboard layout. | 90f (~3.0s) | Linear slow glide + harmonic wave | Ambient tech drone |

---

## 4. Data & Metrics Family (`data`)

| Shot Card | Purpose / Visual Motion | Frame Budget | Key Curves & Dynamics | SFX Pairing |
| :--- | :--- | :--- | :--- | :--- |
| **`digit-roll`** | Mechanical counter odometer; columns spin vertically with independent deceleration and recoil. | 60f (~2.0s) | `Easing.bezier(0.16, 1, 0.3, 1)`, column stagger = 4f, recoil via `dampedSettle` | `counter/tick-roll` or `ui/switch-tap` |
| **`radial-ring-progress`** | Circular SVG gauge fills smoothly from 0% to target with glowing tip particle. | 50f (~1.7s) | `strokeDashoffset` from circumference to `(1-p)*circ`, ease-out-cubic | `data/charge-pulse` |
| **`metric-race-bar`** | Horizontal comparative bars expand rapidly, overshoot slightly, then settle in rank order. | 60f (~2.0s) | Spring damping = 12, stiffness = 100, stagger = 6f | `impact/hit-subtle` |

---

## 5. Effects & Atmosphere Family (`effects`)

| Shot Card | Purpose / Visual Motion | Frame Budget | Key Rules |
| :--- | :--- | :--- | :--- |
| **`spotlight-beam`** | Volumetric conical gradient casting dynamic illumination on dark hero surfaces. | Continuous | Centered on active focal element; opacity clamped to ≤0.35. |
| **`glint-sheen`** | 45-degree specular light band sweeping across card or logo. | 24f sweep | **Rule Q4**: Maximum 1 glint per shot; MUST be masked inside `overflow: hidden` and `borderRadius`. |
| **`hologram-grid`** | Perspective wireframe floor with subtle scanline pulse and vanishing horizon. | Background | 3D plane rotated X: 75deg; grid translation driven by frame clock. |
| **`ambient-particles`** | Floating micro-dust flecks with depth-based parallax. | Continuous | Deterministic positions via `mulberry32`; `lagged` speed hierarchy. |

---

## 6. Transitions Family (`transition`)

| Shot Card | Purpose / Visual Motion | Frame Budget | Key Curves & Dynamics | SFX Pairing |
| :--- | :--- | :--- | :--- | :--- |
| **`flash-cut`** | 1-2 frame chromatic or white flash burst with energy transfer to incoming scene. | 6f | Attack = 1f, decay = 5f; optional 1-frame difference blend | `impact/flash-boom` or `transition/whip` |
| **`whip-pan`** | Rapid horizontal camera blur across scene boundary simulating high-speed whip pan. | 10f | Directional motion blur (angle 0deg, length 40px), ease-in-out | `transition/whoosh-heavy` |
| **`push-through-portal`** | Camera pushes straight through a frame or doorway into next shot. | 24f | Scale: `1.0 -> 3.5`, opacity cross-fade at frame 16 | `transition/portal-deep` |

---

## 7. Rhythm & Beat Sync Family (`rhythm`)

| Shot Card | Purpose / Visual Motion | Frame Budget | Constraint |
| :--- | :--- | :--- | :--- |
| **`beat-slam`** | High-energy transient hit on kick drum; subtle element scale punch (1.0 -> 1.05 -> 1.0). | 6-8f | **Rule R4**: Full-screen/camera slams limited to **≤ 3 per entire video**. Normal beats only punch element layer. |
| **`micro-freeze`** | 2-frame complete hold at peak apex of an animation before snapping into final rest. | 2f freeze | Creates tactile physical weight. |
| **`strobe-cut`** | Staccato rhythmic flashes on hi-hat or rapid drum fill. | 2-4 beats | Single application limit per video. |

---

## 8. Opening & Outro Families (`opening` & `outro`)

| Shot Card | Purpose / Visual Motion | Frame Budget | Rule Reference |
| :--- | :--- | :--- | :--- |
| **`hero-macro-opening`** | Slow, elegant focus on a single protagonist UI card or element; 3D hover elevation before returning to context. | 90f (≥3.0s) | **Rule Q5 & R3**: Give single hero full 3s action arc. |
| **`wordmark-lockdown`** | Brand name / logo resolves with crisp letter spacing expansion and holds stationary. | Hold ≥30f | **Rule R1**: Brand wordmark must hold stationary for ≥ 1 full second (30 frames). |
| **`showcase-assembly`** | Climax sequence where representative UI cards from all previous scenes fly in to surround the brand mark. | 90-120f | **Rule Q8**: Highest energy peak of the video; crane camera pull + stage illumination. |
