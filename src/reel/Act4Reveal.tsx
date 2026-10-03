import React, { useMemo } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { reel } from '../zomotion/reel-tokens';
import { buildParticles, ParticleField } from '../zomotion/ParticleField';
import { dampedSettle } from '../zomotion/motion-helpers';

const WORD = 'ZOMOTION';
const FONT = 168;
const BASE_Y = 604; // baseline of the lockup
const COUNT = 190;

/**
 * Act 4 — the reveal.
 *
 * The lights go out, a swarm converges out of frame and hard onto a lockup, and
 * then a single light traces the outline of the word before the metal resolves
 * behind it. The order matters: particles first (they establish that something
 * is arriving), then the trace (it establishes the shape), then the fill (it
 * establishes the material). Reverse it and it reads as a logo animation; in
 * this order it reads as an object arriving under a light.
 *
 * Everything here is emissive, which is why this act gets true near-black and
 * a metal ramp rather than a flat accent — on the light page a glow has
 * nothing to glow against.
 */
export const Act4Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const particles = useMemo(() => buildParticles(COUNT, 7), []);
  const sparks = useMemo(() => buildParticles(90, 23), []);

  // Camera push: slow and continuous, with a settle recoil at the moment of lock.
  const push = interpolate(frame, [0, 330], [1, 1.13], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const settle = frame < 132 ? 0 : dampedSettle(frame - 132, 0.1, 0.09) * 0.03;

  // Edge light traces the outline: a dash sliding onto a fixed-length path.
  const trace = interpolate(frame, [58, 150], [1200, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const traceGlow = interpolate(frame, [58, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Metal resolves behind the trace, slightly behind it in time.
  const fill = interpolate(frame, [78, 164], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // A single key light behind the lockup, rising with the metal.
  const key = interpolate(frame, [70, 200], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const payoff = interpolate(frame, [196, 226], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const exit = interpolate(frame, [300, 330], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const chromeFill = `url(#chromeRamp)`;
  const svg = { position: 'absolute' as const, left: 0, top: 0 };

  return (
    <AbsoluteFill style={{ backgroundColor: reel.void, overflow: 'hidden' }}>
      {/* Key light behind the lockup */}
      <div
        style={{
          position: 'absolute',
          left: 960 - 640,
          top: 540 - 300,
          width: 1280,
          height: 600,
          background: `radial-gradient(ellipse at 50% 50%, rgba(255,90,0,0.20) 0%, rgba(255,90,0,0.05) 42%, transparent 70%)`,
          opacity: key,
          transform: `scale(${interpolate(key, [0, 1], [0.55, 1])})`,
        }}
      />

      <ParticleField particles={particles} frame={frame} travel={74} color={reel.flame} />
      <ParticleField particles={sparks} frame={frame} travel={86} color="#FFFFFF" glow={false} />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${push + settle})`,
          opacity: exit,
        }}
      >
        {/* Ground reflection: the lockup mirrored about a floor line at y=760,
            which puts the reflected baseline at 916, faded hard downward. Kept
            very faint — at any real strength it reads as a second word. */}
        <div style={{ ...svg, opacity: fill * 0.1, filter: 'blur(6px)' }}>
          <svg width={1920} height={1080}>
            <defs>
              <linearGradient id="reflFade" x1="0" y1="760" x2="0" y2="960" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
              <mask id="reflMask">
                <rect x="0" y="760" width="1920" height="200" fill="url(#reflFade)" />
              </mask>
            </defs>
            <text
              x={960}
              y={916}
              textAnchor="middle"
              fontFamily={reel.display}
              fontSize={FONT}
              fontWeight={800}
              letterSpacing={-8}
              fill="#FFFFFF"
              mask="url(#reflMask)"
            >
              {WORD}
            </text>
          </svg>
        </div>

        {/* Rim light: a flame ghost offset behind the metal. */}
        <div
          style={{
            ...svg,
            filter: 'blur(22px)',
            opacity: key * 0.55,
          }}
        >
          <svg width={1920} height={1080}>
            <text
              x={960}
              y={BASE_Y}
              textAnchor="middle"
              fontFamily={reel.display}
              fontSize={FONT}
              fontWeight={800}
              letterSpacing={-8}
              fill={reel.flame}
            >
              {WORD}
            </text>
          </svg>
        </div>

        {/* The metal. */}
        <svg width={1920} height={1080} style={{ ...svg, opacity: fill }}>
          <defs>
            <linearGradient id="chromeRamp" x1="0" y1="0" x2="0" y2="1">
              {reel.chrome.map((c, i) => (
                <stop key={i} offset={`${(i / (reel.chrome.length - 1)) * 100}%`} stopColor={c} />
              ))}
            </linearGradient>
          </defs>
          <text
            x={960}
            y={BASE_Y}
            textAnchor="middle"
            fontFamily={reel.display}
            fontSize={FONT}
            fontWeight={800}
            letterSpacing={-8}
            fill={chromeFill}
          >
            {WORD}
          </text>
        </svg>

        {/* The edge light: stroke only, drawn on with a sliding dash. */}
        <svg width={1920} height={1080} style={{ ...svg }}>
          <text
            x={960}
            y={BASE_Y}
            textAnchor="middle"
            fontFamily={reel.display}
            fontSize={FONT}
            fontWeight={800}
            letterSpacing={-8}
            fill="none"
            stroke={reel.flame}
            strokeWidth={2.5}
            strokeDasharray="1200 1200"
            strokeDashoffset={trace}
            opacity={traceGlow}
            style={{ filter: 'drop-shadow(0 0 10px rgba(255,90,0,0.9))' }}
          >
            {WORD}
          </text>
        </svg>
      </AbsoluteFill>

      {/* Payoff line, on the axis, above the lockup — so the frame reads as
          three planes: the line, the object, its reflection in the floor. */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 262,
          textAlign: 'center',
          opacity: payoff * exit,
          fontFamily: reel.display,
          fontSize: 26,
          fontWeight: 500,
          color: reel.voidInk2,
          letterSpacing: '-0.01em',
        }}
      >
        1800 frames. One React tree.
      </div>
    </AbsoluteFill>
  );
};
