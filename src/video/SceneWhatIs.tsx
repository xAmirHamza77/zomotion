import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { dampedSettle } from '../zomotion/motion-helpers';
import { Glyph } from '../zomotion/Glyph';
import { SpecCard, CodePlate } from '../zomotion/SpecCard';
import { tokens } from '../zomotion/tokens';

export const SceneWhatIs: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera perspective movement across the scene (0 - 420f)
  const camProgress = interpolate(frame, [0, 420], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const rotX = interpolate(camProgress, [0, 0.5, 1], [14, 8, 12]);
  const rotY = interpolate(camProgress, [0, 0.5, 1], [-16, 12, -8]);
  const zoom = interpolate(camProgress, [0, 0.5, 1], [1.05, 1.15, 1.08]);

  // Pillar 1: 2.5D Camera Rig visual card
  const card1Spring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14, mass: 0.9, stiffness: 100 },
  });

  // Pillar 2: Closed-form physics card
  const card2Spring = spring({
    frame: frame - 45,
    fps,
    config: { damping: 14, mass: 0.9, stiffness: 100 },
  });

  // Physical damped recoil on landing (around frame 70-130)
  const recoil1 = dampedSettle(frame - 55, 0.1, 0.14) * 16;
  const recoil2 = dampedSettle(frame - 85, 0.1, 0.14) * 16;

  // Single specular glint sweep on card 1 (Rule Q4)
  const glint1 = interpolate(frame, [80, 110], [-150, 250], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: tokens.bg,
        overflow: 'hidden',
        perspective: '1400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Dynamic 3D Grid Stage */}
      <div
        style={{
          position: 'absolute',
          width: '200%',
          height: '200%',
          backgroundImage: `
            linear-gradient(rgba(255, 107, 26, 0.14) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 107, 26, 0.14) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          transform: `rotateX(65deg) translate3d(0, 400px, -200px)`,
          transformOrigin: '50% 100%',
        }}
      />

      {/* Main 3D Container with PageCam perspective */}
      <div
        style={{
          width: 1400,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `scale(${zoom}) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'none',
        }}
      >
        {/* Top Header Badge */}
        <div
          style={{
            marginBottom: 36,
            textAlign: 'center',
            transform: 'translateZ(40px)',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: '8px 20px',
              borderRadius: 30,
              backgroundColor: tokens.accentSoft,
              border: `1px solid ${tokens.accent}55`,
              color: tokens.accentInk,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            Core Technology
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: 58,
              fontWeight: 800,
              color: tokens.text,
              letterSpacing: '-0.03em',
            }}
          >
            How Zomotion Works
          </h2>
        </div>

        {/* Two Feature Panels */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 36,
            width: '100%',
          }}
        >
          {/* Card 1: 2.5D PageCam Engine */}
          <div
            style={{
              opacity: interpolate(card1Spring, [0, 0.4], [0, 1]),
              transform: `translate3d(0, ${interpolate(card1Spring, [0, 1], [100, 0]) + recoil1}px, 60px)`,
              display: 'flex',
            }}
          >
            <SpecCard
              index={1}
              icon="camera"
              accent={tokens.accent}
              title="2.5D PageCam Rig"
              desc="Chromium blurs text when a page is GPU-scaled, so the camera zooms at layout scale instead — keeping code and UI pin-sharp while the page tilts."
              chips={['Tx = 960 / zoom - cx']}
              style={{ flex: 1, borderRadius: 24 }}
            >
              {/* Single specular glint (Rule Q4) */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  width: 60,
                  left: `${glint1}%`,
                  transform: 'skewX(-25deg)',
                  background: `linear-gradient(90deg, transparent, ${tokens.accent}2E, transparent)`,
                  pointerEvents: 'none',
                  zIndex: 2,
                }}
              />
              <CodePlate
                accent={tokens.accent}
                label="Camera rig"
                lines={[
                  'zoom: 1.65;',
                  'rotateX(14deg) rotateY(-8deg);',
                  'dof: blur(6px) at plane;',
                ]}
                colors={[tokens.code.fg, tokens.code.keyword, tokens.code.rule]}
              />
            </SpecCard>
          </div>

          {/* Card 2: Closed-Form Physics */}
          <div
            style={{
              opacity: interpolate(card2Spring, [0, 0.4], [0, 1]),
              transform: `translate3d(0, ${interpolate(card2Spring, [0, 1], [100, 0]) + recoil2}px, 60px)`,
              display: 'flex',
            }}
          >
            <SpecCard
              index={2}
              icon="orbit"
              accent={tokens.accentDeep}
              title="Closed-Form Physics"
              desc="Say goodbye to robotic linear moves. Pure math oscillators drive momentum, central-difference velocity, and organic recoil on landing."
              chips={['dampedSettle(t, γ, f)']}
              style={{ flex: 1, borderRadius: 24 }}
            >
              <CodePlate
                accent={tokens.accentDeep}
                label="Motion helpers"
                lines={[
                  'dampedSettle(t) = e^(-γt)·sin(2πft);',
                  'velocityAt(posAt, frame, dt);',
                  'mulberry32(seed) seeded RNG;',
                ]}
                colors={[tokens.code.keyword, tokens.code.value, tokens.code.rule]}
              />
            </SpecCard>
          </div>
        </div>

        {/* Narrative Subtitle Bar (Rule Q11: >= 56px height) */}
        <div
          style={{
            marginTop: 40,
            transform: 'translateZ(80px)',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '14px 32px',
            backgroundColor: tokens.accentSoft,
            borderRadius: 18,
            border: `1px solid ${tokens.accent}44`,
          }}
        >
          <Glyph name="spark" color={tokens.accent} size={22} />
          <span
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: tokens.text,
              letterSpacing: '-0.01em',
            }}
          >
            Zero linear PPT animations. Real cinema-grade physics and camera depth.
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
