# 2.5D Cinematic Camera Engine (`PageCam`)

The `PageCam` architecture provides a virtual 2.5D camera rig over high-resolution screenshots, UI graphics, and mockups in Zomotion. It bridges the gap between flat 2D screen recordings and high-end 3D motion design.

---

## 1. The Chromium GPU Downsampling Problem & The Fix

### The Problem
When standard 3D transforms with scale are applied to a DOM container:
```css
/* ❌ Flawed Approach: Causes blurry text */
transform: perspective(1400px) rotateX(15deg) scale(2.0);
```
Chromium rasterizes the 3D-composited layer at the standard layout size (e.g. 1920×1080) into an off-screen texture buffer, and *then* relies on the GPU to scale and project it. When the camera zooms in (`scale > 1.0`), the UI texture is already downsampled, resulting in pixelated, blurry text and jagged card borders.

### The Zomotion Solution: Layout-Scale CSS Zoom
Instead of applying zoom via `transform: scale(zoom)`, `PageCam` applies magnification directly via the CSS `zoom` property:
```css
/* ✅ Zomotion PageCam Approach: Pin-sharp typography at any zoom level */
zoom: zoom;
transform: translate3d(Tx px, Ty px, 0) rotateY(rotY deg) rotateX(rotX deg) rotateZ(rotZ deg);
transform-origin: cx px cy px;
transform-style: preserve-3d;
```
Because CSS `zoom` resizes the layout box itself before compositing, Chromium rasterizes text, SVG icons, and high-resolution 2x/4x screenshot textures at native output device resolution. Text edges remain razor-sharp.

---

## 2. Coordinate Transformation Mathematics

When CSS `zoom` is active, the coordinate space is multiplied by `zoom`. To maintain the focal point `(cx, cy)` precisely centered in the viewport `(960, 540)`:

$$\text{cx} \cdot \text{zoom} + T_x \cdot \text{zoom} = 960 \implies T_x = \frac{960}{\text{zoom}} - \text{cx}$$

$$\text{cy} \cdot \text{zoom} + T_y \cdot \text{zoom} = 540 \implies T_y = \frac{540}{\text{zoom}} - \text{cy}$$

Rotations (`rotX`, `rotY`, `rotZ`) pivot around `transform-origin: cx px cy px`, ensuring the focal point remains stationary during 3D tilts and pans.

---

## 3. Keyframe Parameters (`CamKey`)

```typescript
export type CamKey = {
  frame: number;   // Video frame timestamp
  cx: number;      // Horizontal focal point in page coordinates (px)
  cy: number;      // Vertical focal point in page coordinates (px)
  zoom: number;    // Magnification (1.0 = 100%, 1.8 = 180% close-up)
  rotX?: number;   // Pitch tilt about horizontal axis (deg, + leans top away)
  rotY?: number;   // Yaw tilt about vertical axis (deg, + recedes to right)
  rotZ?: number;   // Roll in-plane (deg, dutch angle)
  persp?: number;  // Perspective focal length (px, default: 1400)
};
```

### Camera Angles Guide:
- **Hero Inspection**: `rotX: 12deg`, `rotY: -8deg`, `rotZ: 0deg`, `zoom: 1.35`
  - Creates depth without sacrificing text readability.
- **Oblique Low Angle**: `rotX: 18deg`, `rotY: 14deg`, `zoom: 1.5`
  - High cinematic drama; best for cards, piles, and isometric layouts.
- **Flat Orthographic Read**: `rotX: 0deg`, `rotY: 0deg`, `rotZ: 0deg`, `zoom: 1.0`
  - For data-dense dashboards, tables, and multi-row lists (Aesthetic Rule Q6).

---

## 4. Screen-Space Depth-of-Field (DoF) Masking

In physical cinema, tilted planes produce shallow depth-of-field where the distant upper region falls out of focus. `PageCam` approximates this using a hardware-accelerated screen-space gradient backdrop filter:

```tsx
<div
  style={{
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: dof.focusY,
    backdropFilter: `blur(${dof.strength}px)`,
    WebkitBackdropFilter: `blur(${dof.strength}px)`,
    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
    pointerEvents: 'none',
  }}
/>
```

---

## 5. Seamless 2D-to-3D Degradation

When no keyframe in `keys` specifies 3D properties (`rotX`, `rotY`, `rotZ`, `persp`), `PageCam` automatically branches to an optimized 2D layout engine (`translate(960 - cx*zoom, 540 - cy*zoom) scale(zoom)`). This guarantees zero overhead and exact backward compatibility for flat sequences.
