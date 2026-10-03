import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { tokens } from '../zomotion/tokens';

export const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Part 1: Showcase Assembly fly-in (0 - 120f)
  // 4 floating chips orbit inward to surround the central wordmark (Rule Q8)
  const assemblyProgress = interpolate(frame, [0, 80], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Part 2: Central Brand Wordmark Spring (40 - 160f)
  const brandSpring = spring({
    frame: frame - 40,
    fps,
    config: { damping: 13, mass: 0.9, stiffness: 120 },
  });

  const brandScale = interpolate(brandSpring, [0, 1], [0.8, 1]);
  const brandOpacity = interpolate(brandSpring, [0, 0.5], [0, 1]);

  // Single specular glint sweep across ZOMOTION wordmark (Rule Q4, frame 90 - 130)
  const glint = interpolate(frame, [90, 130], [-100, 250], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Subtitle and CTA fade in
  const ctaOpacity = interpolate(frame, [80, 110], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ctaY = interpolate(frame, [80, 110], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Stationary hold for >60 frames (Rule R1: >= 1.0s breath)
  // From frame 140 to 420 (280 frames = 9.3 seconds of rock-solid hold and subtle pulse)
  // Alpha runs lower than the dark-theme cut: a 0.2 wash of orange over a
  // near-white page reads as a stain, not a glow.
  const subtleGlow = 0.13 + Math.sin(frame * 0.05) * 0.03;

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
      {/* Background Volumetric Stage Light */}
      <div
        style={{
          position: 'absolute',
          width: 1100,
          height: 700,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255, 107, 26, ${subtleGlow}) 0%, transparent 70%)`,
          filter: 'blur(100px)',
        }}
      />

      {/* Assembly Satellite Chips (Rule Q8: Showcase Assembly) */}
      {frame < 180 && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {[
            { label: '2.5D PageCam', x: -380, y: -160, color: tokens.accent },
            { label: '157 Shot Recipes', x: 380, y: -160, color: tokens.accentDeep },
            { label: 'Closed-Form Physics', x: -380, y: 160, color: tokens.accentAlt },
            { label: '16 SFX Families', x: 380, y: 160, color: tokens.accentInk },
          ].map((chip, idx) => {
            const startDist = 180;
            const currentDist = (1 - assemblyProgress) * startDist;
            const curX = chip.x + (chip.x > 0 ? currentDist : -currentDist);
            const curY = chip.y + (chip.y > 0 ? currentDist : -currentDist);
            const op = interpolate(frame, [10 + idx * 8, 40 + idx * 8], [0, 0.85]);

            return (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: `translate3d(calc(-50% + ${curX}px), calc(-50% + ${curY}px), 0)`,
                  opacity: op * (1 - interpolate(frame, [120, 160], [0, 1], { extrapolateRight: 'clamp' })),
                  padding: '10px 22px',
                  borderRadius: 20,
                  backgroundColor: tokens.surface,
                  border: `1px solid ${chip.color}55`,
                  color: tokens.text,
                  fontSize: 14,
                  fontWeight: 600,
                  boxShadow: `0 10px 30px ${chip.color}22`,
                }}
              >
                {chip.label}
              </div>
            );
          })}
        </div>
      )}

      {/* Central Brand Lockup (Rule R1: Holds stationary >= 1.0s) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `scale(${brandScale})`,
          opacity: brandOpacity,
          zIndex: 10,
        }}
      >
        {/* Top Tagline Badge */}
        <div
          style={{
            padding: '8px 24px',
            borderRadius: 30,
            backgroundColor: tokens.accentSoft,
            border: `1px solid ${tokens.accent}66`,
            color: tokens.accentInk,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}
        >
          React Video Composition
        </div>

        {/* Master Brand Wordmark.
            The negative margins give the 40px-blur drop-shadow vertical room;
            without them overflow:hidden slices it at the content box and leaves
            a hard-edged pale band across the lockup. Horizontal clip — which is
            what keeps the glint from streaking past the word — is unchanged. */}
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            padding: '24px 40px',
            margin: '-24px -40px',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 110,
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              // Dark ink holding long into the wordmark, then breaking to brand
              // orange over the last few letters. The gradient is angled to
              // ~100deg so the transition falls on the same diagonal as the
              // letterforms; a 135deg ramp spent too long in muddy brown.
              // A white-to-indigo ramp would vanish against a near-white page.
              background: 'linear-gradient(100deg, #0A0A0A 0%, #141414 46%, #C2410C 80%, #FF6B1A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 20px 40px rgba(255, 107, 26, 0.22))',
            }}
          >
            ZOMOTION
          </h1>

          {/* Single Specular Sheen (Rule Q4) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: 80,
              left: `${glint}%`,
              transform: 'skewX(-25deg)',
              // Near-white sheen: reads on both the ink and the orange tail
              // of the wordmark, where an orange glint would vanish.
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Subtitle Statement */}
        <p
          style={{
            marginTop: 20,
            marginBottom: 36,
            fontSize: 26,
            fontWeight: 500,
            color: tokens.textSecondary,
            letterSpacing: '-0.02em',
            textAlign: 'center',
            opacity: ctaOpacity,
            transform: `translate3d(0, ${ctaY}px, 0)`,
          }}
        >
          Cinematic Programmatic Motion Graphics Engine
        </p>

        {/* Action Callout Button */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translate3d(0, ${ctaY}px, 0)`,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              padding: '16px 36px',
              borderRadius: 16,
              background: `linear-gradient(135deg, ${tokens.accent} 0%, ${tokens.accentDeep} 100%)`,
              color: tokens.onAccent,
              fontSize: 18,
              fontWeight: 700,
              boxShadow: '0 16px 35px -8px rgba(255, 107, 26, 0.45)',
              letterSpacing: '-0.01em',
            }}
          >
            Available in Antigravity Skills
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div
          style={{
            marginTop: 48,
            display: 'flex',
            alignItems: 'center',
            gap: 32,
            opacity: ctaOpacity,
            color: tokens.textMuted,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          <span>157 Shot Recipes</span>
          <span>•</span>
          <span>2.5D PageCam</span>
          <span>•</span>
          <span>16 Audio Families</span>
          <span>•</span>
          <span>100% Deterministic</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
