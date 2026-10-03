import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { tokens } from './tokens';

export interface SpotlightHeroCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: React.ReactNode;
  width?: number;
  height?: number;
  borderRadius?: number;
  accentColor?: string;
  bgColor?: string;
  borderColor?: string;
  children?: React.ReactNode;
  entranceDelay?: number;
}

/**
 * SpotlightHeroCard: Product Card with Zomotion Cinematic Polish.
 *
 * Implements:
 * - Single hero action arc: spring entrance, 3D hover elevation, settled hold.
 * - Dynamic spotlight tracking across card surface.
 * - Single specular glint sweep strictly clipped to card borderRadius (Aesthetic Rule Q4).
 * - Layered glassmorphism elevation with deep ambient shadow.
 */
export const SpotlightHeroCard: React.FC<SpotlightHeroCardProps> = ({
  title,
  subtitle,
  badge,
  icon,
  width = 640,
  height = 400,
  borderRadius = 24,
  accentColor = tokens.accent,
  bgColor = tokens.surface,
  borderColor = tokens.border,
  children,
  entranceDelay = 5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring animation
  const entrance = spring({
    frame: frame - entranceDelay,
    fps,
    config: {
      damping: 14,
      mass: 0.9,
      stiffness: 120,
    },
  });

  const scale = interpolate(entrance, [0, 1], [0.88, 1]);
  const opacity = interpolate(entrance, [0, 0.6], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const translateY = interpolate(entrance, [0, 1], [60, 0]);

  // Subtle hovering / breathing elevation after entrance
  const floatTime = Math.max(0, frame - entranceDelay - 20) * 0.05;
  const floatY = Math.sin(floatTime) * 4;
  const tiltX = Math.sin(floatTime * 0.8) * 1.5;
  const tiltY = Math.cos(floatTime * 0.7) * 2;

  // Single specular glint sweep across the card (occurs once around frame 28-50)
  const glintProgress = interpolate(
    frame - entranceDelay,
    [24, 48],
    [-150, 250],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );

  // Dynamic spotlight gradient center
  const spotX = 50 + Math.sin(floatTime * 0.6) * 20;
  const spotY = 40 + Math.cos(floatTime * 0.5) * 15;

  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        transform: `translate3d(0, ${translateY + floatY}px, 0) scale(${scale}) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        opacity,
        position: 'relative',
        overflow: 'hidden', // Strictly clips glint to border radius (Rule Q4)
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: `
          0 24px 60px -12px rgba(0, 0, 0, 0.10),
          0 0 40px -14px ${accentColor}40
        `,
        display: 'flex',
        flexDirection: 'column',
        padding: '36px',
        boxSizing: 'border-box',
        color: tokens.text,
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Dynamic ambient spotlight */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle 320px at ${spotX}% ${spotY}%, ${accentColor}1A, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Single specular sheen glint (Rule Q4) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: '60px',
          left: `${glintProgress}%`,
          transform: 'skewX(-25deg)',
          // A white sheen is invisible on a white card — the light-theme
          // glint is a warm orange bloom instead.
          background: `linear-gradient(90deg, transparent, ${accentColor}2E, transparent)`,
          pointerEvents: 'none',
        }}
      />

      {/* Top Header Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {icon && (
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: tokens.accentSoft,
                border: `1px solid ${accentColor}55`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: accentColor,
              }}
            >
              {icon}
            </div>
          )}
          <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }}>
            {title}
          </span>
        </div>

        {badge && (
          <span
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              backgroundColor: tokens.accentSoft,
              // Small caps need the darker orange to clear 4.5:1 on white.
              color: tokens.accentInk,
              border: `1px solid ${accentColor}44`,
            }}
          >
            {badge}
          </span>
        )}
      </div>

      {subtitle && (
        <p
          style={{
            margin: '0 0 24px 0',
            fontSize: 16,
            lineHeight: 1.5,
            color: tokens.textSecondary,
            zIndex: 2,
          }}
        >
          {subtitle}
        </p>
      )}

      {/* Card Content Slot */}
      <div style={{ flex: 1, zIndex: 2, position: 'relative' }}>{children}</div>
    </div>
  );
};
