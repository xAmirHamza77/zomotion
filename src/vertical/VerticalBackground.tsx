import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

interface VerticalBackgroundProps {
  accentColor?: string;
}

export const VerticalBackground: React.FC<VerticalBackgroundProps> = ({
  accentColor = '#38bdf8',
}) => {
  const frame = useCurrentFrame();

  // Slow orbital drift for energy blooms
  const bloomX = Math.sin(frame * 0.02) * 80;
  const bloomY = Math.cos(frame * 0.015) * 60;
  const pulse = 0.85 + Math.sin(frame * 0.04) * 0.15;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#07080d',
        overflow: 'hidden',
      }}
    >
      {/* Primary Accent Radial Bloom */}
      <div
        style={{
          position: 'absolute',
          top: `calc(28% + ${bloomY}px)`,
          left: `calc(50% + ${bloomX}px - 450px)`,
          width: '900px',
          height: '900px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor}28 0%, ${accentColor}08 45%, transparent 70%)`,
          filter: 'blur(90px)',
          opacity: pulse,
          pointerEvents: 'none',
        }}
      />

      {/* Secondary Deep Indigo Anchor Bloom */}
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1000px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.04) 50%, transparent 75%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
      />

      {/* Modern High-End Grid Matrix */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse 90% 75% at 50% 45%, black 40%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 75% at 50% 45%, black 40%, transparent 85%)',
          pointerEvents: 'none',
        }}
      />

      {/* Subtle Noise / Grain Overlay for Physical Texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, transparent 60%, rgba(0,0,0,0.55) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
