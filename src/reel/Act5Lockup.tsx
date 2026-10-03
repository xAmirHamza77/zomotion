import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { reel, timecode, REEL_TOTAL_FRAMES } from '../zomotion/reel-tokens';

const THUMB_W = 128;
const THUMB_H = 72;
const THUMB_GAP = 6;
const STRIP_W = 12 * THUMB_W + 11 * THUMB_GAP;

/**
 * One miniature per act, coloured from the reel's own arc: light for the
 * explainer, void for the reveal, light again for the close. The last shot of
 * the film is a contact sheet of the film — the thing it has been describing
 * all along, now holding its own strip.
 */
const ARC: { bg: string; dark: boolean; mark: 'bars' | 'tunnel' | 'lines' | 'term' | 'dots' | 'word' | 'strip' | 'flame' }[] = [
  { bg: 'linear-gradient(140deg, #FFFFFF, #E6E4E0)', dark: false, mark: 'bars' },
  { bg: 'linear-gradient(140deg, #FFFFFF, #FFC49E)', dark: false, mark: 'bars' },
  { bg: 'linear-gradient(140deg, #FFFFFF, #E6E4E0)', dark: false, mark: 'tunnel' },
  { bg: 'linear-gradient(140deg, #FFFFFF, #E6E4E0)', dark: false, mark: 'lines' },
  { bg: 'linear-gradient(140deg, #FFFFFF, #E6E4E0)', dark: false, mark: 'lines' },
  { bg: 'linear-gradient(160deg, #1E1E22, #08080A)', dark: true, mark: 'term' },
  { bg: 'linear-gradient(140deg, #FFFFFF, #E6E4E0)', dark: false, mark: 'strip' },
  { bg: 'linear-gradient(160deg, #141417, #08080A)', dark: true, mark: 'dots' },
  { bg: 'linear-gradient(160deg, #2A1409, #08080A)', dark: true, mark: 'word' },
  { bg: 'linear-gradient(140deg, #FFFFFF, #FFC49E)', dark: false, mark: 'lines' },
  { bg: 'linear-gradient(140deg, #FFFFFF, #E6E4E0)', dark: false, mark: 'strip' },
  { bg: 'linear-gradient(140deg, #FFFFFF, #FFC49E)', dark: false, mark: 'flame' },
];

const mark = (m: string, dark: boolean) => {
  const fg = dark ? '#FFFFFF' : reel.ink;
  if (m === 'bars')
    return (
      <>
        <div style={{ position: 'absolute', left: 20, top: 26, width: 52, height: 8, background: fg }} />
        <div style={{ position: 'absolute', left: 20, top: 40, width: 30, height: 8, background: reel.flame }} />
      </>
    );
  if (m === 'tunnel')
    return (
      <>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 34 + i * 12,
              top: 20 + i * 6,
              width: 60 - i * 14,
              height: 30 - i * 7,
              border: `1.5px solid ${fg}`,
              opacity: 1 - i * 0.28,
            }}
          />
        ))}
      </>
    );
  if (m === 'lines')
    return (
      <>
        <div style={{ position: 'absolute', left: 20, top: 18, width: 44, height: 7, background: fg }} />
        <div style={{ position: 'absolute', left: 20, top: 32, width: 62, height: 4, background: fg, opacity: 0.4 }} />
        <div style={{ position: 'absolute', left: 20, top: 42, width: 62, height: 4, background: fg, opacity: 0.4 }} />
        <div style={{ position: 'absolute', left: 20, top: 54, width: 34, height: 4, background: reel.flame }} />
      </>
    );
  if (m === 'term')
    return (
      <>
        <div style={{ position: 'absolute', left: 16, top: 18, width: 5, height: 5, background: reel.flame }} />
        <div style={{ position: 'absolute', left: 28, top: 17, width: 46, height: 7, background: '#FFFFFF', opacity: 0.85 }} />
        <div style={{ position: 'absolute', left: 16, top: 34, width: 74, height: 3, background: '#FFFFFF', opacity: 0.35 }} />
        <div style={{ position: 'absolute', left: 16, top: 44, width: 56, height: 3, background: '#FFFFFF', opacity: 0.35 }} />
        <div style={{ position: 'absolute', left: 16, top: 54, width: 34, height: 3, background: reel.flame, opacity: 0.9 }} />
      </>
    );
  if (m === 'dots')
    return (
      <>
        {[[26, 22], [46, 30], [70, 20], [34, 48], [58, 50], [88, 34], [96, 22]].map(([x, y], i) => (
          <div key={i} style={{ position: 'absolute', left: x, top: y, width: 4, height: 4, borderRadius: '50%', background: i % 2 ? '#FFFFFF' : reel.flame, opacity: 0.9 }} />
        ))}
      </>
    );
  if (m === 'word')
    return (
      <div style={{ position: 'absolute', left: 0, right: 0, top: 24, textAlign: 'center', fontFamily: reel.display, fontSize: 13, fontWeight: 800, letterSpacing: '-0.04em', color: '#FFFFFF', textShadow: '0 0 8px rgba(255,90,0,0.9)' }}>
        ZOMOTION
      </div>
    );
  if (m === 'strip')
    return (
      <div style={{ position: 'absolute', left: 20, top: 26, width: 88, height: 20, display: 'flex', gap: 3 }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ flex: 1, background: i === 4 ? '#0A0A0A' : reel.ruleStrong }} />
        ))}
      </div>
    );
  return <div style={{ position: 'absolute', left: 20, right: 20, bottom: 22, height: 4, background: reel.flame }} />;
};

/**
 * Act 5 — close.
 *
 * The lights come back up, the wordmark returns as flat ink on the page, and the
 * film ends on a contact sheet of itself. The CTA is the same command the film
 * opened on, so the argument is a loop: what you just watched is what that one
 * line gives you.
 */
export const Act5Lockup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const up = interpolate(frame, [0, 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cmdIn = interpolate(frame, [26, 56], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const stripIn = interpolate(frame, [44, 104], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const cmd = 'npx create-zomotion@latest promo';
  const typed = Math.min(cmd.length, Math.max(0, Math.floor((frame - 26) * 1.5)));
  const shown = ARC.length * stripIn;

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ opacity: up, transform: `translate3d(0, ${interpolate(up, [0, 1], [20, 0])}px, 0)` }}>
          <div
            style={{
              fontFamily: reel.display,
              fontSize: 132,
              fontWeight: 800,
              letterSpacing: '-0.045em',
              lineHeight: 1,
              color: reel.ink,
            }}
          >
            Zomotion
          </div>
          <div
            style={{
              marginTop: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 44,
              fontFamily: reel.display,
              fontSize: 27,
              fontWeight: 500,
              color: reel.ink2,
            }}
          >
            <span>Motion design that ships as code.</span>
            <span style={{ fontFamily: reel.mono, fontSize: 24, color: reel.ink }}>{cmd.slice(0, typed)}</span>
            {frame > 26 && frame < 26 + cmd.length + 24 && (
              <span style={{ display: 'inline-block', width: 2, height: 26, background: reel.flame, opacity: Math.floor(frame / 9) % 2 === 0 ? 1 : 0 }} />
            )}
          </div>
        </div>

        {/* The film, as a strip of its own frames. */}
        <div style={{ marginTop: 104, opacity: stripIn }}>
          <div style={{ position: 'relative', display: 'flex', gap: THUMB_GAP }}>
            {ARC.map((a, i) => {
              const on = i / ARC.length <= shown + 0.0001;
              return (
                <div
                  key={i}
                  style={{
                    position: 'relative',
                    width: THUMB_W,
                    height: THUMB_H,
                    background: on ? a.bg : reel.sunk,
                    border: `1px solid ${on ? 'rgba(10,10,10,0.12)' : reel.rule}`,
                    overflow: 'hidden',
                  }}
                >
                  {on && mark(a.mark, a.dark)}
                </div>
              );
            })}
            {/* Playhead parked at the end of the strip. */}
            <div
              style={{
                position: 'absolute',
                left: `${stripIn * 100}%`,
                top: -14,
                width: 2,
                height: THUMB_H + 28,
                background: reel.flame,
                transform: 'translateX(-2px)',
                boxShadow: `0 0 10px ${reel.flame}`,
              }}
            />
          </div>
          <div
            style={{
              marginTop: 22,
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: reel.mono,
              fontSize: 14,
              letterSpacing: '0.1em',
              color: reel.ink3,
              width: STRIP_W,
            }}
          >
            <span>00:00:00</span>
            <span>
              {timecode(REEL_TOTAL_FRAMES - 1, fps)} · {REEL_TOTAL_FRAMES} frames
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
