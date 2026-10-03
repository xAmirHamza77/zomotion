import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { SceneData } from './types';
import { KineticCaptions } from './KineticCaptions';

interface SceneHeroCoreProps {
  scene: SceneData;
  brandPill?: string;
}

export const SceneHeroCore: React.FC<SceneHeroCoreProps> = ({
  scene,
  brandPill = '✦ GOOGLE DEEPMIND • NEXT GEN AI',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.9, stiffness: 110 },
  });

  const titleScale = interpolate(entrance, [0, 1], [0.82, 1]);
  const titleY = interpolate(entrance, [0, 1], [40, 0]);
  const titleOpacity = interpolate(entrance, [0, 0.7], [0, 1]);

  // Core rotation and pulsing
  const rot = (frame * 0.9) % 360;
  const pulse = 1 + Math.sin(frame * 0.1) * 0.05;
  const coreGlow = 0.5 + Math.sin(frame * 0.08) * 0.3;

  // Split headline
  const words = scene.headline.split(' ');
  const highlight = scene.highlightWord || words[words.length - 1];

  // Floating tags entrance
  const tagSpring = spring({
    frame: frame - 18,
    fps,
    config: { damping: 12, mass: 0.8, stiffness: 120 },
  });
  const tagY = interpolate(tagSpring, [0, 1], [30, 0]);
  const tagOpacity = interpolate(tagSpring, [0, 0.6], [0, 1]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '110px 48px 0 48px',
        boxSizing: 'border-box',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Top Floating Pill Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 26px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 999,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: `0 4px 20px ${scene.accentColor}25`,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: scene.accentColor,
            boxShadow: `0 0 10px ${scene.accentColor}`,
          }}
        />
        <span
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          {scene.tag || brandPill}
        </span>
      </div>

      {/* Main Kinetic Headline */}
      <div
        style={{
          marginTop: 48,
          textAlign: 'center',
          opacity: titleOpacity,
          transform: `translateY(${titleY}px) scale(${titleScale})`,
          maxWidth: 960,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 88,
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            color: '#FFFFFF',
          }}
        >
          {words.map((w, idx) => {
            const isHighlight = w.toLowerCase() === highlight.toLowerCase();
            return (
              <span
                key={idx}
                style={{
                  display: 'inline-block',
                  marginRight: '0.22em',
                  color: isHighlight ? scene.accentColor : '#FFFFFF',
                  textShadow: isHighlight
                    ? `0 0 35px ${scene.accentColor}99, 0 0 70px ${scene.accentColor}44`
                    : 'none',
                }}
              >
                {w}
              </span>
            );
          })}
        </h1>

        {/* Subtitle */}
        {scene.subhead && (
          <p
            style={{
              margin: '24px auto 0 auto',
              fontSize: 34,
              fontWeight: 500,
              lineHeight: 1.35,
              color: 'rgba(255, 255, 255, 0.72)',
              letterSpacing: '-0.01em',
              maxWidth: 820,
            }}
          >
            {scene.subhead}
          </p>
        )}
      </div>

      {/* Center 3D Neural Ring / Hologram Core */}
      <div
        style={{
          position: 'relative',
          width: 580,
          height: 580,
          marginTop: 65,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Outer Ring with Ticks */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: `2px dashed rgba(255, 255, 255, 0.16)`,
            transform: `rotate(${rot}deg)`,
            boxShadow: `0 0 50px ${scene.accentColor}20`,
          }}
        />

        {/* Middle Glowing Ring */}
        <div
          style={{
            position: 'absolute',
            inset: 38,
            borderRadius: '50%',
            border: `2px solid ${scene.accentColor}55`,
            transform: `rotate(${-rot * 1.4}deg) scale(${pulse})`,
            boxShadow: `inset 0 0 30px ${scene.accentColor}33`,
          }}
        />

        {/* Inner Solid Glass Disc */}
        <div
          style={{
            width: 380,
            height: 380,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${scene.accentColor}35 0%, rgba(13, 16, 28, 0.85) 65%, rgba(6, 8, 14, 0.95) 100%)`,
            border: '1px solid rgba(255, 255, 255, 0.18)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 80px ${scene.accentColor}${Math.round(coreGlow * 100).toString(16).padStart(2, '0')}`,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {/* Logo / Core Glyph */}
          <div
            style={{
              fontSize: 68,
              fontWeight: 900,
              letterSpacing: '-0.03em',
              background: `linear-gradient(135deg, #FFFFFF 30%, ${scene.accentColor} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            4 PRO
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.65)',
              marginTop: 6,
            }}
          >
            NEURAL ENGINE
          </div>
        </div>

        {/* Floating Feature Tags around the core */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            right: -20,
            padding: '12px 22px',
            background: 'rgba(15, 18, 30, 0.85)',
            border: `1px solid ${scene.accentColor}55`,
            borderRadius: 16,
            backdropFilter: 'blur(16px)',
            opacity: tagOpacity,
            transform: `translateY(${tagY}px)`,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 700, color: '#FFFFFF' }}>
            ⚡ 10M Token Context
          </span>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 25,
            left: -20,
            padding: '12px 22px',
            background: 'rgba(15, 18, 30, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 16,
            backdropFilter: 'blur(16px)',
            opacity: tagOpacity,
            transform: `translateY(${-tagY}px)`,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 700, color: scene.accentColor }}>
            ● Autonomous Coding
          </span>
        </div>
      </div>

      {/* Spoken Subtitles at bottom */}
      <KineticCaptions subtitles={scene.subtitles} accentColor={scene.accentColor} />
    </div>
  );
};
