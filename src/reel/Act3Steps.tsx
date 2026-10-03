import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { reel, GATE_INSET } from '../zomotion/reel-tokens';

const LEFT = GATE_INSET + 60;
const HEAD_W = 420;
const BODY_W = 960;
const WIPE = 18; // frames — the chapter transition is always the same wipe

const THUMBS: { name: string; kind: 'type' | 'cam' | 'glint' | 'wave' }[] = [
  { name: 'Kinetic type', kind: 'type' },
  { name: '2.5D camera', kind: 'cam' },
  { name: 'Specular cards', kind: 'glint' },
  { name: 'Sound design', kind: 'wave' },
];

const THUMB_W = 228;
const THUMB_H = 128;

/** Each recipe thumbnail is a tiny real scene, not a picture of one. */
const Thumb: React.FC<{ kind: string }> = ({ kind }) => {
  const s = {
    position: 'absolute' as const,
    inset: 0,
    background: reel.sunk,
    overflow: 'hidden',
  };
  if (kind === 'type') {
    return (
      <div style={s}>
        <div style={{ position: 'absolute', left: 26, top: 46, fontFamily: reel.display, fontSize: 40, fontWeight: 800, color: reel.ink }}>
          SPL
        </div>
        <div style={{ position: 'absolute', left: 26, top: 66, fontFamily: reel.display, fontSize: 40, fontWeight: 800, color: reel.flame }}>
          IT
        </div>
        <div style={{ position: 'absolute', right: 22, top: 46, fontFamily: reel.display, fontSize: 40, fontWeight: 800, color: reel.ink }}>
          FLA
        </div>
        <div style={{ position: 'absolute', right: 22, top: 66, fontFamily: reel.display, fontSize: 40, fontWeight: 800, color: reel.flame }}>
          P
        </div>
        <div style={{ position: 'absolute', left: 26, right: 26, bottom: 20, height: 1, background: reel.ruleStrong }} />
      </div>
    );
  }
  if (kind === 'cam') {
    return (
      <div style={{ ...s, perspective: 420 }}>
        <div
          style={{
            position: 'absolute',
            left: -40,
            right: -40,
            top: 52,
            height: 110,
            background: `repeating-linear-gradient(90deg, ${reel.ink}2E 0 1px, transparent 1px 22px),
                         repeating-linear-gradient(0deg, ${reel.ink}2E 0 1px, transparent 1px 16px)`,
            transform: 'rotateX(56deg)',
          }}
        />
        <div style={{ position: 'absolute', left: 84, top: 34, width: 62, height: 42, border: `2px solid ${reel.flame}` }} />
        <div style={{ position: 'absolute', left: 84, top: 52, width: 20, height: 2, background: reel.flame, opacity: 0.6 }} />
      </div>
    );
  }
  return kind === 'glint' ? (
    // A darker stage: a white card on the light `sunk` fill is invisible, and
    // the glint it exists to show needs a dark field to read against anyway.
    <div style={{ ...s, background: '#2A2A2E' }}>
      <div style={{ position: 'absolute', left: 34, top: 32, width: 160, height: 64, background: reel.surface, boxShadow: '0 10px 22px -6px rgba(0,0,0,0.6)' }} />
      <div
        style={{
          position: 'absolute',
          left: 34,
          top: 32,
          width: 160,
          height: 64,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: -40,
            top: -20,
            width: 44,
            height: 120,
            background: `linear-gradient(90deg, transparent, ${reel.flame}66, transparent)`,
            transform: 'rotate(22deg)',
          }}
        />
      </div>
    </div>
  ) : (
    <div style={{ ...s, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, paddingBottom: 14 }}>
      {[16, 34, 22, 48, 30, 58, 20, 38, 26, 44, 18, 30, 24, 14].map((h, i) => (
        <div
          key={i}
          style={{
            width: 4,
            height: Math.min(h * 1.5, 92),
            background: i % 3 === 0 ? reel.flame : reel.ink,
            opacity: i % 3 === 0 ? 1 : 0.6,
          }}
        />
      ))}
    </div>
  );
};

/**
 * Act 3 — the how-to, in three numbered steps.
 *
 * Numbering is used here and nowhere else in the reel, because this is the one
 * place the content genuinely is a sequence: you scaffold, then you pick a shot,
 * then you render. Each step wipes in from the left on the same 18-frame move,
 * so the three read as chapters of one document rather than as three screens.
 *
 * The recipe deck is a contact sheet, not a card grid — four real miniature
 * scenes at contact-sheet scale, the way a photographer pages through a roll of
 * options. Every step is vertically centred on the same axis, because three
 * layouts stacked at the top of a 1080 frame would read as a template.
 */
export const Act3Steps: React.FC = () => {
  const frame = useCurrentFrame();

  const wipeAt = (start: number) =>
    interpolate(frame, [start, start + WIPE], [100, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // ---- Step 1: scaffold ------------------------------------------------
  const cmd = 'npx create-zomotion@latest promo';
  const typed = Math.min(cmd.length, Math.max(0, Math.floor((frame - 14) * 1.7)));

  // ---- Step 2: pick a recipe -------------------------------------------
  const s2 = 178;

  // ---- Step 3: render --------------------------------------------------
  const s3 = 366;
  const barStart = s3 + 56;
  const progress = interpolate(frame, [barStart, barStart + 84], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const Row: React.FC<{ start: number; fade?: boolean; children: React.ReactNode }> = ({ start, fade, children }) => (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        clipPath: `inset(0 ${wipeAt(start)}% 0 0)`,
        opacity: fade ? interpolate(frame, [start, start + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 1,
      }}
    >
      <div style={{ marginLeft: LEFT, display: 'flex', gap: 64, alignItems: 'flex-start', width: HEAD_W + 64 + BODY_W }}>
        {children}
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* ---- 01 Scaffold ---- */}
      {frame < s2 + WIPE && (
        <Row start={0} fade>
          <StepHead
            n="01"
            title="Scaffold"
            line="One command. Four primitives, already wired to the render clock."
          />
          <div style={{ width: BODY_W, background: reel.void, borderRadius: 14, overflow: 'hidden', boxShadow: '0 50px 100px -55px rgba(0,0,0,0.75)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '15px 24px', borderBottom: `1px solid ${reel.voidRaised}` }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: i === 0 ? reel.flame : reel.voidInk2, opacity: i === 0 ? 1 : 0.3 }} />
              ))}
              <span style={{ marginLeft: 12, fontFamily: reel.mono, fontSize: 13, color: reel.voidInk2 }}>~/promo</span>
            </div>
            <div style={{ padding: '34px 36px 40px', fontFamily: reel.mono, fontSize: 22, color: reel.voidInk, lineHeight: 1.7 }}>
              <div>
                <span style={{ color: reel.flame }}>$</span> {cmd.slice(0, typed)}
                {frame > 14 && frame < 14 + cmd.length + 30 && (
                  <span style={{ display: 'inline-block', width: 10, height: 24, marginLeft: 4, background: reel.flame, opacity: Math.floor(frame / 9) % 2 === 0 ? 1 : 0 }} />
                )}
              </div>
              <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 13 }}>
                {['PageCam.tsx', 'SpotlightHeroCard.tsx', 'KineticTypography.tsx', 'SoundTimeline.tsx'].map((f, i) => (
                  <div
                    key={f}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      opacity: interpolate(frame, [92 + i * 13, 104 + i * 13], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                    }}
                  >
                    <span style={{ color: reel.flame }}>✓</span>
                    <span>{f}</span>
                    <span style={{ color: reel.voidInk2, opacity: 0.5 }}>injected</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Row>
      )}

      {/* ---- 02 Pick a shot ---- */}
      {frame < s3 + WIPE && (
        <Row start={s2}>
          <StepHead n="02" title="Pick a shot" line="157 verified recipes across 16 categories. Each one is a React component with typed props — swap the numbers, keep the motion." />
          <div>
            <div style={{ display: 'flex', gap: 12 }}>
              {THUMBS.map((t, i) => {
                const p = interpolate(frame, [s2 + 16 + i * 9, s2 + 38 + i * 9], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                return (
                  <div key={t.name} style={{ width: THUMB_W, opacity: p, transform: `translate3d(0, ${interpolate(p, [0, 1], [24, 0])}px, 0)` }}>
                    <div style={{ width: THUMB_W, height: THUMB_H, position: 'relative', background: reel.surface, boxShadow: '0 8px 20px -10px rgba(0,0,0,0.22)' }}>
                      <Thumb kind={t.kind} />
                      <div style={{ position: 'absolute', top: 0, left: 0, background: reel.ink, color: reel.page, fontFamily: reel.mono, fontSize: 11, padding: '3px 6px' }}>
                        {String(i + 1).padStart(2, '0')}
                      </div>
                    </div>
                    <div style={{ marginTop: 12, fontFamily: reel.display, fontSize: 16, fontWeight: 600, color: reel.ink }}>{t.name}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 34, paddingTop: 22, borderTop: `1px solid ${reel.ruleStrong}`, display: 'flex', gap: 34 }}>
              {['Kinetic typography', 'Camera rigs', 'Particles', 'Transitions', 'Sound design'].map((c, i) => {
                const p = interpolate(frame, [s2 + 52 + i * 7, s2 + 70 + i * 7], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                return (
                  <div key={c} style={{ opacity: p, fontFamily: reel.mono, fontSize: 15, color: reel.ink2, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 5, height: 5, background: reel.flame }} />
                    {c}
                  </div>
                );
              })}
            </div>
          </div>
        </Row>
      )}

      {/* ---- 03 Render ---- */}
      <Row start={s3}>
        <StepHead n="03" title="Render" line="Scrub it live, then render the file. Same pixels on every machine." />
        <div>
          {[
            { c: 'npm run dev', d: 'Scrub the timeline live, edit props, watch it update on save.' },
            { c: 'npm run render', d: 'Deterministic, multi-worker render with sound design already muxed in.' },
          ].map((r, i) => {
            const p = interpolate(frame, [s3 + 10 + i * 14, s3 + 32 + i * 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return (
              <div key={r.c} style={{ opacity: p, transform: `translate3d(0, ${interpolate(p, [0, 1], [18, 0])}px, 0)`, marginBottom: 40 }}>
                <div style={{ fontFamily: reel.mono, fontSize: 27, fontWeight: 600, color: reel.ink }}>{r.c}</div>
                <div style={{ marginTop: 10, fontFamily: reel.display, fontSize: 19, color: reel.ink2 }}>{r.d}</div>
              </div>
            );
          })}
          {/* The render actually runs: the bar is the frame clock, not a graphic. */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <div style={{ width: 700, height: 7, background: reel.rule, overflow: 'hidden' }}>
              <div style={{ width: `${(progress * 100).toFixed(1)}%`, height: '100%', background: progress >= 1 ? reel.ink : reel.flame }} />
            </div>
            <span style={{ fontFamily: reel.mono, fontSize: 15, color: progress >= 1 ? reel.ink : reel.ink3, minWidth: 200 }}>
              {progress >= 1 ? 'promo.mp4' : `${Math.round(progress * 100)}% · ${(progress * 1800).toFixed(0)} of 1800 frames`}
            </span>
          </div>
        </div>
      </Row>
    </AbsoluteFill>
  );
};

const StepHead: React.FC<{ n: string; title: string; line: string }> = ({ n, title, line }) => (
  <div style={{ width: HEAD_W, flexShrink: 0 }}>
    <div style={{ fontFamily: reel.mono, fontSize: 16, color: reel.flameInk, letterSpacing: '0.12em', marginBottom: 16 }}>{n}</div>
    <div style={{ fontFamily: reel.display, fontSize: 62, fontWeight: 800, letterSpacing: '-0.035em', color: reel.ink, lineHeight: 1 }}>{title}</div>
    <div style={{ marginTop: 22, fontFamily: reel.display, fontSize: 19, lineHeight: 1.55, color: reel.ink2 }}>{line}</div>
  </div>
);
