import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { reel, GATE_INSET } from '../zomotion/reel-tokens';
import { seededRandom } from '../zomotion/motion-helpers';

/**
 * CSS perspective: `perspective: P` puts the eye P px in FRONT of the z=0 plane,
 * so a word starts deep in the tunnel at a NEGATIVE z (scaled down by
 * P/(P+z)) and rushes past the lens at a POSITIVE one. Getting this sign wrong
 * puts every word in front of the eye, where Chrome clips it — and the tunnel
 * renders as an empty page.
 */
const Z_FAR = -2000;
const Z_NEAR = 340;
const TRAVEL = 110;
const STAGGER = 26;
const TUNNEL_END = 250;

/**
 * Each word gets a fixed lateral offset. Without one, a pure translateZ moves
 * every word along the same line through the eye and they all project to the
 * same point on screen — a stack of type in the middle of the frame. The
 * offsets are what turn a line of receding words into a tunnel.
 */
const TUNNEL_WORDS = [
  { text: 'REACT', size: 168, x: -430, y: -170 },
  { text: 'FRAME', size: 124, x: 340, y: 95 },
  { text: 'TIMELINE', size: 172, x: -270, y: 205 },
  { text: 'PIXEL', size: 150, x: 480, y: -150 },
  { text: 'EXPORTS', size: 186, x: -470, y: 25 },
  { text: 'DETERMINISTIC', size: 116, x: 190, y: -240 },
];

/** The two things Zomotion is made of, as plain rows — no boxes around them. */
const PILLARS = [
  {
    name: 'Engine Core',
    role: 'the canvas',
    desc: 'Pure programmatic video architecture. Every component is a film; the render processes your component tree, one frame at a time.',
    api: ['useCurrentFrame()', 'Composition', 'interpolate'],
  },
  {
    name: 'Zomotion FX',
    role: 'the motion craft',
    desc: 'Cinema-grade camera rigs, kinetic typography, and frame-synced sound design. Production visual vocabulary ready to deploy.',
    api: ['PageCam', 'KineticTypography', 'SoundTimeline'],
  },
];

/**
 * Act 2 — typography tunnel, then a hard stop into plain type.
 *
 * The tunnel is the loudest thing in the reel: words are staged in Z-space on a
 * real CSS perspective and rushed past the lens, with a depth-of-field blur that
 * tracks |z| so the focal plane passes through the middle of the shot the way a
 * camera would rack focus.
 *
 * The cut out of the tunnel is the point. After six words of kinetic type, the
 * content lands as a single left-aligned statement with no card, no border and
 * no shadow — maximum motion, then maximum restraint. The only glass left on
 * screen is one plate, because the code snippet is the one thing that earns it.
 */
export const Act2Tunnel: React.FC = () => {
  const frame = useCurrentFrame();
  const left = GATE_INSET + 60;

  // Tunnel fades as the statement wipes over it.
  const tunnelOut = interpolate(frame, [TUNNEL_END - 26, TUNNEL_END + 6], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // The statement does not slide — it is revealed by a left-to-right clip wipe.
  const wipe = interpolate(frame, [TUNNEL_END - 18, TUNNEL_END + 22], [100, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const textIn = interpolate(frame, [TUNNEL_END - 18, TUNNEL_END + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rowsIn = interpolate(frame, [TUNNEL_END + 30, TUNNEL_END + 62], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const code = 'const frame = useCurrentFrame();';
  const codeChars = Math.max(0, Math.floor((frame - (TUNNEL_END + 34)) * 1.6));

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* ---- Tunnel ---- */}
      <AbsoluteFill
        style={{ alignItems: 'center', justifyContent: 'center', perspective: 1000, opacity: tunnelOut }}
      >
        {TUNNEL_WORDS.map((w, i) => {
          const delay = i * STAGGER;
          const t = (frame - delay) / TRAVEL;
          if (t < 0 || t > 1) return null;

          // Accelerating rush: slow in the far distance, violent past the lens.
          const e = t * t;
          const z = Z_FAR + (Z_NEAR - Z_FAR) * e;

          // Rack focus: sharpest at the focal plane, soft on either side.
          const blur = Math.min(9, Math.abs(z) / 150);
          const opacity = interpolate(t, [0, 0.14, 0.72, 1], [0, 0.95, 0.95, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          // A little vertical life so the pipe does not feel like a grid.
          const drift = Math.sin(t * 4 + i) * 26;
          // Words roll slightly as they rush — a pure Z push reads as a slideshow.
          const spin = (1 - e) * (i % 2 === 0 ? 7 : -7);

          return (
            <div
              key={w.text}
              style={{
                position: 'absolute',
                transform: `translate3d(${w.x}px, ${w.y + drift}px, ${z}px) rotate(${spin}deg)`,
                filter: `blur(${blur.toFixed(2)}px)`,
                opacity,
                fontFamily: reel.display,
                fontSize: w.size,
                fontWeight: 800,
                letterSpacing: '-0.05em',
                color: i % 3 === 1 ? reel.flameInk : reel.ink,
                whiteSpace: 'nowrap',
              }}
            >
              {w.text}
            </div>
          );
        })}
      </AbsoluteFill>

      {/* ---- Statement. Hierarchy comes from scale and weight, not from
          colouring half the sentence in the accent. ---- */}
      <div
        style={{
          position: 'absolute',
          left,
          top: 188,
          width: 1240,
          clipPath: `inset(0 ${wipe}% 0 0)`,
        }}
      >
        <div
          style={{
            fontFamily: reel.display,
            fontSize: 64,
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            color: reel.ink3,
            transform: `translate3d(0, ${interpolate(textIn, [0, 1], [18, 0])}px, 0)`,
            opacity: textIn,
          }}
        >
          You write React.
        </div>
        <div
          style={{
            marginTop: 14,
            fontFamily: reel.display,
            fontSize: 116,
            fontWeight: 800,
            lineHeight: 0.98,
            letterSpacing: '-0.04em',
            color: reel.ink,
            transform: `translate3d(0, ${interpolate(textIn, [0, 1], [24, 0])}px, 0)`,
            opacity: textIn,
          }}
        >
          It renders video.
        </div>
        <div
          style={{
            marginTop: 30,
            width: interpolate(frame, [TUNNEL_END + 6, TUNNEL_END + 44], [0, 560], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            height: 3,
            background: reel.flame,
          }}
        />
      </div>

      {/* ---- Pillars: ruled rows, not cards ---- */}
      <div
        style={{
          position: 'absolute',
          left,
          top: 512,
          width: 1680,
          display: 'flex',
          gap: 64,
          opacity: rowsIn,
        }}
      >
        {PILLARS.map((p, i) => {
          const shown = Math.min(p.api.length, Math.max(0, Math.ceil(rowsIn * p.api.length)));
          return (
            <div key={p.name} style={{ flex: 1, borderTop: `1px solid ${i === 0 ? reel.ink : reel.ruleStrong}`, paddingTop: 26 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 }}>
                <span style={{ fontFamily: reel.display, fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em', color: reel.ink }}>
                  {p.name}
                </span>
                <span style={{ fontFamily: reel.display, fontSize: 18, fontWeight: 500, color: reel.ink3 }}>{p.role}</span>
              </div>
              <div style={{ fontFamily: reel.display, fontSize: 20, lineHeight: 1.55, color: reel.ink2, maxWidth: 600 }}>
                {p.desc}
              </div>
              <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 11 }}>
                {p.api.slice(0, shown).map((a) => (
                  <div
                    key={a}
                    style={{
                      fontFamily: reel.mono,
                      fontSize: 16,
                      color: reel.ink2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 11,
                    }}
                  >
                    <span style={{ width: 5, height: 5, background: reel.flame, flexShrink: 0 }} />
                    {a}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ---- The one piece of glass on screen. The code is the only thing on
          the page that earns a surface, so it gets the only surface. ---- */}
      <div
        style={{
          position: 'absolute',
          left,
          top: 812,
          padding: '22px 30px',
          borderRadius: 14,
          background: 'linear-gradient(150deg, rgba(255,255,255,0.90) 0%, rgba(255,255,255,0.58) 100%)',
          border: '1px solid rgba(255,255,255,0.85)',
          boxShadow: `inset 0 1px 0 rgba(255,255,255,1), 0 30px 60px -34px rgba(10,10,10,0.4)`,
          backdropFilter: 'blur(22px) saturate(1.4)',
          opacity: rowsIn,
          transform: `translate3d(0, ${interpolate(rowsIn, [0, 1], [14, 0])}px, 0)`,
        }}
      >
        <div style={{ fontFamily: reel.mono, fontSize: 12, color: reel.ink3, marginBottom: 9 }}>src/Hero.tsx</div>
        <div style={{ fontFamily: reel.mono, fontSize: 18, color: reel.ink, whiteSpace: 'nowrap' }}>
          <span style={{ color: reel.flameInk }}>const</span> {code.slice(6, codeChars)}
          <span
            style={{
              display: 'inline-block',
              width: 2,
              height: 20,
              marginLeft: 3,
              background: reel.flame,
              opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
