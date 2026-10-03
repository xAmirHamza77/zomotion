import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { KineticTypography } from '../zomotion/KineticTypography';
import { SpotlightHeroCard } from '../zomotion/SpotlightHeroCard';
import { DigitRoll } from '../zomotion/DigitRoll';
import { SpecTile } from '../zomotion/SpecCard';
import { tokens } from '../zomotion/tokens';

export const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Part 1: Kinetic Typography (0 - 150f)
  const typeOpacity = interpolate(frame, [130, 150], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const typeScale = interpolate(frame, [130, 150], [1, 0.95], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Part 2: Hero Intro Card Entrance (140 - 360f)
  const cardEntrance = spring({
    frame: frame - 145,
    fps,
    config: { damping: 14, mass: 0.9, stiffness: 110 },
  });

  const cardOpacity = interpolate(cardEntrance, [0, 0.6], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const cardTranslateY = interpolate(cardEntrance, [0, 1], [80, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: tokens.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient glow */}
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 600,
          borderRadius: '50%',
          background: tokens.glow,
          filter: 'blur(80px)',
          transform: `translate3d(${Math.sin(frame * 0.02) * 50}px, ${Math.cos(frame * 0.02) * 30}px, 0)`,
        }}
      />

      {/* Part 1: Kinetic Typography */}
      {frame < 160 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: typeOpacity,
            transform: `scale(${typeScale})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <KineticTypography
            leadWord="ZOMOTION"
            followingWords={['CINEMATIC', 'MOTION', 'ENGINE']}
            subtitle="The Ultimate Programmatic Motion Graphics Engine"
            leadHighlightColor={tokens.accent}
            textColor={tokens.text}
            subtitleColor={tokens.textSecondary}
            fontSize={72}
          />
        </div>
      )}

      {/* Part 2: Product Overview Card */}
      {frame >= 140 && (
        <div
          style={{
            position: 'absolute',
            opacity: cardOpacity,
            transform: `translate3d(0, ${cardTranslateY}px, 0)`,
          }}
        >
          <SpotlightHeroCard
            title="What is Zomotion?"
            subtitle="Transform programmatic code into cinematic motion graphics with professional physics effects."
            badge="Zomotion Core"
            accentColor={tokens.accent}
            width={880}
            height={480}
          >
            <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Feature pillars */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <SpecTile
                  icon="code"
                  accent={tokens.accent}
                  title="Engine Core"
                  desc="Deterministic frame clock, declarative React timeline, audio sync, and a fast studio dev server."
                  label="Pillar 01"
                />
                <SpecTile
                  icon="camera"
                  accent={tokens.accentDeep}
                  title="Cinematic FX"
                  desc="2.5D PageCam perspective, layout-scale zoom, 16-family sound design, and closed-form physics."
                  label="Pillar 02"
                />
              </div>

              {/* Live Metric Counters. No suffix: the label above already
                  names the unit, and "16 categories" under "CURATED SFX
                  FAMILIES" was both redundant and wide enough that the three
                  counters collided. */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  alignItems: 'start',
                  gap: 32,
                  paddingTop: 22,
                  borderTop: `1px solid ${tokens.border}`,
                }}
              >
                <div>
                  <div style={{ fontSize: 12, textTransform: 'uppercase', color: tokens.textMuted, letterSpacing: '0.1em', fontWeight: 700, marginBottom: 4 }}>
                    Verified Shot Recipes
                  </div>
                  <DigitRoll value={157} fontSize={46} color={tokens.accentInk} startFrame={160} />
                </div>

                <div>
                  <div style={{ fontSize: 12, textTransform: 'uppercase', color: tokens.textMuted, letterSpacing: '0.1em', fontWeight: 700, marginBottom: 4 }}>
                    Curated SFX Families
                  </div>
                  <DigitRoll value={16} fontSize={46} color={tokens.accentInk} startFrame={168} />
                </div>

                <div>
                  <div style={{ fontSize: 12, textTransform: 'uppercase', color: tokens.textMuted, letterSpacing: '0.1em', fontWeight: 700, marginBottom: 4 }}>
                    Reproducible Frames
                  </div>
                  <DigitRoll value={1800} fontSize={46} color={tokens.accentInk} startFrame={176} />
                </div>
              </div>
            </div>
          </SpotlightHeroCard>
        </div>
      )}
    </AbsoluteFill>
  );
};
