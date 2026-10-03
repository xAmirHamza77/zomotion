import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { reel } from '../zomotion/reel-tokens';
import { seededRandom, dampedSettle } from '../zomotion/motion-helpers';

const WORD = 'ZOMOTION';
const LETTERS = WORD.split('');
const LANDING = 26; // frames after a letter's spring starts before it reaches rest

/**
 * Act 1 — kinetic type cold open.
 *
 * Letters do not fade in. Each is thrown from its own scattered position and
 * rotation, springs to rest, and then *stretches and snaps* on arrival: a
 * damped oscillation drives scaleX above 1 and scaleY below it for about half
 * a second. The stretch is what makes it read as a physical object landing
 * rather than a slide tween, and it is the one moment in the reel where motion
 * carries all the weight — everything after this is deliberately calmer.
 *
 * The exit is a zoom straight through the wordmark: the lockup scales past the
 * camera and is gone by the cut.
 */
export const Act1Type: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fly-through: the whole lockup accelerates toward and past the lens.
  const fly = interpolate(frame, [206, 270], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const flyScale = interpolate(fly, [0, 1], [1, 11]);
  const flyOpacity = interpolate(fly, [0, 0.45, 1], [1, 1, 0]);

  // Subtitle tracks in under the word, then dims as the fly-through starts.
  const subIn = interpolate(frame, [46, 74], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const subOut = interpolate(frame, [196, 220], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const subY = interpolate(frame, [46, 74], [22, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${flyScale})`,
          opacity: flyOpacity,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          {LETTERS.map((ch, i) => {
            const delay = i * 3.4;
            const spr = spring({
              frame: frame - delay,
              fps,
              config: { damping: 9, mass: 0.6, stiffness: 170 },
            });

            // Deterministic throw: each letter gets its own bearing and spin.
            const sx = seededRandom(1000 + i, -1, 1) * 1500;
            const sy = seededRandom(2000 + i, -1, 1) * 620;
            const srot = seededRandom(3000 + i, -1, 1) * 130;
            const sscale = 0.35 + seededRandom(4000 + i, 0, 1) * 0.9;

            const x = sx * (1 - spr);
            const y = sy * (1 - spr);
            const rot = srot * (1 - spr);
            const scale = sscale + (1 - sscale) * spr;

            // Stretch and snap on arrival.
            const since = frame - delay - LANDING;
            const settle = since < 0 ? 0 : dampedSettle(since, 0.15, 0.1);
            const stretchX = 1 + settle * 0.24;
            const stretchY = 1 - settle * 0.15;

            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  fontFamily: reel.display,
                  fontSize: 150,
                  fontWeight: 800,
                  letterSpacing: '-0.045em',
                  lineHeight: 1,
                  color: reel.ink,
                  opacity: interpolate(spr, [0, 0.35], [0, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  }),
                  transform: `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg) scale(${scale * stretchX}, ${
                    scale * stretchY
                  })`,
                  transformOrigin: 'center bottom',
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>

        {/* A rule that wipes out from the centre, then the subtitle. */}
        <div
          style={{
            marginTop: 34,
            width: interpolate(frame, [40, 92], [0, 460], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            height: 2,
            background: reel.flame,
            opacity: subOut,
          }}
        />
        <div
          style={{
            marginTop: 22,
            opacity: subIn * subOut,
            transform: `translate3d(0, ${subY}px, 0)`,
            fontFamily: reel.display,
            fontSize: 25,
            fontWeight: 500,
            color: reel.ink2,
            letterSpacing: '-0.01em',
          }}
        >
          Cinematic motion graphics, rendered from React
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
