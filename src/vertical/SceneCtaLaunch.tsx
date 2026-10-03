import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { SceneData } from './types';
import { KineticCaptions } from './KineticCaptions';

interface SceneCtaLaunchProps {
  scene: SceneData;
}

export const SceneCtaLaunch: React.FC<SceneCtaLaunchProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.9, stiffness: 120 },
  });

  const cardScale = interpolate(entrance, [0, 1], [0.86, 1]);
  const cardY = interpolate(entrance, [0, 1], [50, 0]);
  const cardOpacity = interpolate(entrance, [0, 0.7], [0, 1]);

  // Button pulse
  const btnPulse = 1 + Math.sin(frame * 0.12) * 0.03;

  // Specular sheen glint
  const glint = interpolate(frame, [18, 55], [-180, 250], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const words = scene.headline.split(' ');
  const highlight = scene.highlightWord || words[words.length - 1];

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
          opacity: cardOpacity,
          transform: `translateY(${cardY}px)`,
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
          {scene.tag || '✦ IMMEDIATE ACCESS'}
        </span>
      </div>

      {/* Main Kinetic Headline */}
      <div
        style={{
          marginTop: 48,
          textAlign: 'center',
          opacity: cardOpacity,
          transform: `translateY(${cardY}px)`,
          maxWidth: 960,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 84,
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

        {scene.subhead && (
          <p
            style={{
              margin: '22px auto 0 auto',
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

      {/* Centerpiece Hero Launch Lockup Card */}
      <div
        style={{
          position: 'relative',
          width: 900,
          marginTop: 60,
          borderRadius: 28,
          background: 'rgba(12, 15, 24, 0.88)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: `0 30px 70px rgba(0, 0, 0, 0.65), 0 0 45px ${scene.accentColor}25`,
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          padding: '50px 48px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          overflow: 'hidden',
          opacity: cardOpacity,
          transform: `translateY(${cardY}px) scale(${cardScale})`,
        }}
      >
        {/* Specular Glint */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '45%',
            left: `${glint}%`,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)',
            transform: 'skewX(-24deg)',
            pointerEvents: 'none',
          }}
        />

        {/* Brand Icon Halo */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: 24,
            background: `linear-gradient(135deg, ${scene.accentColor}44 0%, rgba(255,255,255,0.05) 100%)`,
            border: `1px solid ${scene.accentColor}66`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
            boxShadow: `0 0 35px ${scene.accentColor}40`,
            marginBottom: 24,
          }}
        >
          ✦
        </div>

        <div style={{ fontSize: 44, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
          Google AI Studio
        </div>
        <div style={{ fontSize: 24, color: 'rgba(255, 255, 255, 0.65)', marginTop: 8 }}>
          Developer Preview & Production API Available Today
        </div>

        {/* High-Impact CTA Button */}
        <div
          style={{
            marginTop: 40,
            padding: '22px 64px',
            background: `linear-gradient(135deg, ${scene.accentColor} 0%, #2563eb 100%)`,
            borderRadius: 999,
            color: '#FFFFFF',
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: '0.02em',
            boxShadow: `0 15px 40px ${scene.accentColor}55`,
            transform: `scale(${btnPulse})`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span>{scene.ctaButtonText || 'Launch Gemini 4 Pro'}</span>
          <span>→</span>
        </div>

        {/* URL Pill */}
        <div
          style={{
            marginTop: 32,
            padding: '10px 24px',
            borderRadius: 999,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: 20,
            fontFamily: 'monospace',
            color: 'rgba(255, 255, 255, 0.75)',
          }}
        >
          {scene.ctaUrl || 'ai.google.dev/gemini-4'}
        </div>
      </div>

      {/* Spoken Subtitles at bottom */}
      <KineticCaptions subtitles={scene.subtitles} accentColor={scene.accentColor} />
    </div>
  );
};
