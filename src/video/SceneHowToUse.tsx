import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { GlyphName } from '../zomotion/Glyph';
import { SpecCard } from '../zomotion/SpecCard';
import { tokens } from '../zomotion/tokens';

export const SceneHowToUse: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 3 sub-phases within 600 frames:
  // Phase 1: 0 - 190f (Step 1: Scaffolding)
  // Phase 2: 180 - 390f (Step 2: Shot Recipes)
  // Phase 3: 380 - 600f (Step 3: Studio & Render)

  // Step 1: Terminal typing simulation (0 - 180f)
  const codeCommand = 'node scripts/scaffold-zomotion.mjs my-promo';
  const charsShown = Math.min(
    codeCommand.length,
    Math.max(0, Math.floor((frame - 20) / 2.5)),
  );
  const terminalSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, mass: 0.9, stiffness: 120 },
  });

  // Step 2: Recipe Deck Fly-In (180 - 380f)
  const step2Start = 180;
  const cards = [
    {
      title: 'Kinetic Typography',
      desc: 'Words assemble and settle on their own momentum instead of sliding in on a fixed curve.',
      color: tokens.accent,
      icon: 'type' as GlyphName,
      chips: ['useCurrentFrame()', 'split-flap', 'zoom-assemble'],
    },
    {
      title: '2.5D PageCam',
      desc: 'A camera rig with real depth that keeps text pin-sharp while the page tilts beneath it.',
      color: tokens.accentDeep,
      icon: 'camera' as GlyphName,
      chips: ['zoom: 1.0 → 1.65', 'pitch', 'yaw'],
    },
    {
      title: 'Hero Cards',
      desc: 'Spotlight tracking follows the pointer, with a single clipped specular glint across the surface.',
      color: tokens.accentAlt,
      icon: 'grid' as GlyphName,
      chips: ['SpotlightHeroCard', 'clipped glint', '1 per card'],
    },
    {
      title: 'Sound Design',
      desc: 'Sixteen curated families, muxed against the frame clock so every hit lands on its mark.',
      color: tokens.accentInk,
      icon: 'wave' as GlyphName,
      chips: ['SoundTimeline', '-1.28f AAC', '16 families'],
    },
  ];

  // Step 3: Commands & Render (380 - 600f)
  const step3Start = 380;
  const step3Spring = spring({
    frame: frame - step3Start - 10,
    fps,
    config: { damping: 14, mass: 0.9, stiffness: 110 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: tokens.bg,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Background soft ambient radial */}
      <div
        style={{
          position: 'absolute',
          width: 1000,
          height: 700,
          borderRadius: '50%',
          background: tokens.glow,
          filter: 'blur(90px)',
        }}
      />

      {/* Top Workflow Header */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            padding: '6px 18px',
            borderRadius: 24,
            backgroundColor: tokens.accentSoft,
            border: `1px solid ${tokens.accent}55`,
            color: tokens.accentInk,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          Three Simple Steps
        </div>
        <h2 style={{ margin: 0, fontSize: 52, fontWeight: 800, color: tokens.text, letterSpacing: '-0.03em' }}>
          How to Use Zomotion
        </h2>
      </div>

      {/* PHASE 1: Scaffolding (0 - 190f) */}
      {frame < 200 && (
        <div
          style={{
            opacity: interpolate(terminalSpring, [0, 0.5], [0, 1]) * interpolate(frame, [170, 195], [1, 0], { extrapolateRight: 'clamp' }),
            transform: `translate3d(0, ${interpolate(terminalSpring, [0, 1], [60, 0])}px, 0)`,
            width: 900,
            backgroundColor: tokens.surface,
            border: `1px solid ${tokens.border}`,
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: tokens.cardLift(tokens.accent),
          }}
        >
          {/* Terminal Window Header */}
          <div
            style={{
              padding: '14px 20px',
              backgroundColor: tokens.surfaceAlt,
              borderBottom: `1px solid ${tokens.border}`,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ef4444' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#eab308' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#22c55e' }} />
            <span style={{ marginLeft: 12, fontSize: 13, color: tokens.textMuted, fontFamily: 'monospace' }}>
              Step 1: Scaffolding & Primitives
            </span>
          </div>

          {/* Terminal Body */}
          <div style={{ padding: '28px', fontFamily: 'monospace', fontSize: 18, color: tokens.text }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ color: tokens.accent }}>$</span>
              <span>{codeCommand.slice(0, charsShown)}</span>
              {frame % 16 < 8 && <span style={{ backgroundColor: tokens.accent, width: 9, height: 20, display: 'inline-block' }} />}
            </div>

            {frame > 80 && (
              <div style={{ color: tokens.accentInk, fontSize: 15, lineHeight: 1.7, marginTop: 12 }}>
                <div>✓ Injected PageCam.tsx (2.5D camera rig)</div>
                <div>✓ Injected SpotlightHeroCard.tsx (specular glints)</div>
                <div>✓ Injected KineticTypography.tsx (lead-word-zoom)</div>
                <div>✓ Injected SoundTimeline.tsx (-1.28f AAC compensation)</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PHASE 2: Recipe Deck Fly-In (180 - 390f) */}
      {frame >= 180 && frame < 390 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 26,
            width: 1360,
            opacity: interpolate(frame, [360, 385], [1, 0], { extrapolateRight: 'clamp' }),
          }}
        >
          {cards.map((c, i) => {
            // Accelerating stagger (Rule R2)
            const delay = step2Start + i * 14;
            const cardSpr = spring({
              frame: frame - delay,
              fps,
              config: { damping: 13, mass: 0.8, stiffness: 120 },
            });
            const transY = interpolate(cardSpr, [0, 1], [140, 0]);
            const cardOp = interpolate(cardSpr, [0, 0.4], [0, 1]);

            return (
              <div
                key={i}
                style={{
                  opacity: cardOp,
                  transform: `translate3d(0, ${transY}px, 0)`,
                  display: 'flex',
                }}
              >
                <SpecCard
                  index={i + 1}
                  icon={c.icon}
                  accent={c.color}
                  title={c.title}
                  desc={c.desc}
                  chips={c.chips}
                  label={`Recipe #${i + 1}`}
                  minHeight={392}
                  style={{ flex: 1 }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* PHASE 3: Commands & Render (380 - 600f) */}
      {frame >= 380 && (
        <div
          style={{
            opacity: interpolate(step3Spring, [0, 0.5], [0, 1]),
            transform: `translate3d(0, ${interpolate(step3Spring, [0, 1], [60, 0])}px, 0)`,
            width: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: 26,
          }}
        >
          {[
            {
              step: 'Step 3: Studio Fast Refresh',
              cmd: 'npm run dev',
              desc: 'Interactive timeline scrubber, property editor, and fast hot reloading.',
              accent: tokens.accent,
            },
            {
              step: 'Production Export',
              cmd: 'npm run render',
              desc: 'Deterministic parallel multi-worker rendering with lossless audio muxing.',
              accent: tokens.accentDeep,
            },
          ].map((s) => (
            <div
              key={s.cmd}
              style={{
                position: 'relative',
                backgroundColor: tokens.surface,
                border: `1px solid ${tokens.border}`,
                borderRadius: 20,
                padding: '34px 40px 36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 40,
                boxShadow: tokens.cardLift(s.accent),
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: `linear-gradient(90deg, ${s.accent} 0%, ${s.accent}00 100%)`,
                }}
              />
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 11.5,
                    textTransform: 'uppercase',
                    color: tokens.textMuted,
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: s.accent }}
                  />
                  {s.step}
                </div>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '10px 18px',
                    borderRadius: 12,
                    backgroundColor: tokens.surfaceAlt,
                    border: `1px solid ${tokens.border}`,
                    fontSize: 24,
                    fontWeight: 700,
                    color: tokens.text,
                    fontFamily: 'monospace',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {s.cmd}
                </div>
              </div>
              <div
                style={{
                  flexShrink: 0,
                  fontSize: 15,
                  color: tokens.textSecondary,
                  maxWidth: 300,
                  lineHeight: 1.6,
                }}
              >
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Persistent Bottom Narrative Caption (Rule Q11: >= 56px) */}
      <div
        style={{
          position: 'absolute',
          bottom: 70,
          padding: '12px 30px',
          backgroundColor: tokens.surface,
          borderRadius: 16,
          border: `1px solid ${tokens.border}`,
          boxShadow: tokens.shadowSm,
        }}
      >
        <span style={{ fontSize: 20, color: tokens.text, fontWeight: 600 }}>
          {frame < 190 && 'Step 1: Scaffold ready-to-render React components in seconds.'}
          {frame >= 190 && frame < 390 && 'Step 2: Choose from 157 battle-tested cinematic shot recipes.'}
          {frame >= 390 && 'Step 3: Preview live in Zomotion Studio, then render a pixel-exact MP4.'}
        </span>
      </div>
    </AbsoluteFill>
  );
};
