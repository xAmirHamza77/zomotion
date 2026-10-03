# Musical Beat-Sync Methodology

In high-tempo product teasers and promo videos, synchronizing cuts, element entrances, and kinetic graphics to musical beats elevates professional perception.

---

## 1. Frame-to-Beat Mathematical Formula

Given musical tempo in **BPM** (Beats Per Minute) and video frame rate **fps**:

$$\text{Frames Per Beat} = \frac{60}{\text{BPM}} \times \text{fps}$$

$$\text{beatF}(n) = \text{round}\left(\text{downbeatOffset} + n \times \frac{60}{\text{BPM}} \times \text{fps}\right)$$

### Reference Table (at 30 fps):
| BPM | Frames Per Beat (1/4 Note) | Frames Per Half-Beat (1/8 Note) | Frames Per Bar (4 Beats) |
| :--- | :--- | :--- | :--- |
| **120** | 15.0 frames | 7.5 frames | 60 frames (2.0s) |
| **124** | 14.5 frames | 7.25 frames | 58 frames (~1.93s) |
| **128** | 14.06 frames | 7.03 frames | 56 frames (~1.87s) |
| **130** | 13.85 frames | 6.92 frames | 55 frames (~1.83s) |
| **140** | 12.86 frames | 6.43 frames | 51 frames (~1.71s) |

---

## 2. Rule R4: Camera Slam Budget ($\le 3$ Per Video)

### The Pitfall
A common mistake in beat-synced videos is triggering a whole-screen zoom pump, camera shake, or chromatic flash on *every single beat*. Because electronic music hits every 14 frames, whole-screen pulses induce motion sickness and make the video unwatchable.

### The Zomotion Law
- **Whole-Screen / Camera Slams**: **Maximum 3 times per video**.
  - Reserved exclusively for the intro drop, major mid-video climax, and final brand outro lockdown.
  - Spaced by at least 16 musical bars.
- **Ordinary Beats (Kicks, Snares, Claps)**:
  - Animate *only* the internal element layer (e.g. card border glow pulse, small icon bounce $+4\%$, bar chart step).
  - The camera frame remains perfectly rock-solid and stable.

---

## 3. Transient Matching vs Interpolated Grids

Music tracks often have slight human tempo drift or mastering shifts:
1. Identify true audio transients (kick drum waveforms) rather than relying solely on mathematical division.
2. Align cuts to the transient attack peak.
3. Validate that cut points are within $\le 2$ frames of true acoustic transients.

---

## 4. Dual-Track Delivery Pattern

Always structure your top-level composition props to export both:
1. **Full Mix**: Video with synchronized BGM + SFX.
2. **SFX-Only Clean Stem**: Video with all SFX intact but `enableBgm: false`.
This allows marketing teams to substitute localized or campaign-specific music tracks without losing sound design sync.
