import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from 'remotion';

export type CamKey = {
  frame: number;
  cx: number; // CSS focal point X in page coordinates
  cy: number; // CSS focal point Y in page coordinates
  zoom: number; // 1 = 1 CSS px -> 1 output px (magnification)
  rotX?: number; // deg, pitch about horizontal axis (+ leans away)
  rotY?: number; // deg, yaw about vertical axis (+ recedes to the right)
  rotZ?: number; // deg, in-plane roll
  persp?: number; // px, perspective focal length (default: 1400px)
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export interface PageCamProps {
  src: string; // image path (e.g. staticFile or direct URL)
  pageH: number; // Full height of page layout in CSS px
  pageW?: number; // Page width in CSS px (default: 1920)
  keys: CamKey[];
  children?: React.ReactNode; // Page-space overlays (cards, annotations, cursors)
  blur?: number;
  saturate?: number;
  ease?: (t: number) => number;
  dof?: { focusY: number; strength: number };
  frame?: number; // Optional frame override when nested inside Sequence
  bgColor?: string;
}

/**
 * PageCam: 2.5D Cinematic Perspective Camera for Zomotion.
 *
 * Solves the critical Chromium 3D GPU downsampling issue:
 * Instead of `transform: scale(zoom)` (which causes Chromium to rasterize at 1920
 * layout size and GPU-upscale, blurring fine text), PageCam applies `zoom` via
 * CSS layout zoom and adjusts `translate(960 / zoom - cx, 540 / zoom - cy)`
 * so that all typography and UI elements rasterize natively at full device resolution.
 */
export const PageCam: React.FC<PageCamProps> = ({
  src,
  pageH,
  pageW = 1920,
  keys,
  children,
  blur = 0,
  saturate = 1,
  ease = Easing.bezier(0.33, 0, 0.15, 1),
  dof,
  frame: frameProp,
  bgColor = '#0a0a0f',
}) => {
  const ownFrame = useCurrentFrame();
  const currentFrame = frameProp ?? ownFrame;

  // Find active keyframe interval
  let a = keys[0];
  let b = keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (currentFrame >= keys[i].frame && currentFrame <= keys[i + 1].frame) {
      a = keys[i];
      b = keys[i + 1];
      break;
    }
  }

  const t =
    a.frame === b.frame
      ? 1
      : interpolate(currentFrame, [a.frame, b.frame], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: ease,
        });

  const cx = lerp(a.cx, b.cx, t);
  const cy = lerp(a.cy, b.cy, t);
  const zoom = lerp(a.zoom, b.zoom, t);

  const filters: string[] = [];
  if (blur > 0) filters.push(`blur(${blur}px)`);
  if (saturate !== 1) filters.push(`saturate(${saturate})`);

  const has3D = keys.some(
    (k) =>
      k.rotX !== undefined ||
      k.rotY !== undefined ||
      k.rotZ !== undefined ||
      k.persp !== undefined,
  );

  // Flat 2D rendering mode when no 3D rotation requested
  if (!has3D) {
    return (
      <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: bgColor }}>
        <div
          style={{
            position: 'absolute',
            width: pageW,
            height: pageH,
            transform: `translate(${960 - cx * zoom}px, ${540 - cy * zoom}px) scale(${zoom})`,
            transformOrigin: '0 0',
            filter: filters.length ? filters.join(' ') : undefined,
          }}
        >
          <Img
            src={src.startsWith('http') ? src : staticFile(src)}
            style={{ position: 'absolute', width: pageW, height: pageH }}
          />
          {children}
        </div>
      </AbsoluteFill>
    );
  }

  // 2.5D Perspective Mode:
  const rotX = lerp(a.rotX ?? 0, b.rotX ?? 0, t);
  const rotY = lerp(a.rotY ?? 0, b.rotY ?? 0, t);
  const rotZ = lerp(a.rotZ ?? 0, b.rotZ ?? 0, t);
  const persp = lerp(a.persp ?? 1400, b.persp ?? 1400, t);

  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: bgColor }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          perspective: `${persp * zoom}px`,
          perspectiveOrigin: '960px 540px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: pageW,
            height: pageH,
            zoom,
            transform: `translate(${960 / zoom - cx}px, ${540 / zoom - cy}px) rotateY(${rotY}deg) rotateX(${rotX}deg) rotateZ(${rotZ}deg)`,
            transformOrigin: `${cx}px ${cy}px`,
            transformStyle: 'preserve-3d',
            filter: filters.length ? filters.join(' ') : undefined,
          }}
        >
          <Img
            src={src.startsWith('http') ? src : staticFile(src)}
            style={{ position: 'absolute', width: pageW, height: pageH }}
          />
          {children}
        </div>
      </div>

      {/* Screen-space depth-of-field focal plane blur */}
      {dof && dof.strength > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: Math.max(0, dof.focusY),
            backdropFilter: `blur(${dof.strength}px)`,
            WebkitBackdropFilter: `blur(${dof.strength}px)`,
            maskImage:
              'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
            pointerEvents: 'none',
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
