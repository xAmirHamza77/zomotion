import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

export interface FlashCutProps {
  durationInFrames?: number; // Total flash duration (typical: 4-8 frames)
  flashColor?: string; // Flash tint (white, warm bloom, or accent)
  peakOpacity?: number; // Maximum flash alpha (default: 0.9)
  invertFrame?: number; // Optional frame index to trigger a 1-frame negative invert
}

/**
 * FlashCut: Cinematic Impact & Energy-Transfer Transition.
 *
 * Produces a razor-sharp, non-lingering flash burst at scene transitions.
 * Pairs with an impact or whoosh SFX.
 */
export const FlashCut: React.FC<FlashCutProps> = ({
  durationInFrames = 6,
  flashColor = '#ffffff',
  peakOpacity = 0.92,
  invertFrame = 1,
}) => {
  const frame = useCurrentFrame();

  if (frame >= durationInFrames) return null;

  // Single frame negative invert effect
  const isInvert = frame === invertFrame;

  // Sharp attack (frame 0 -> 1), exponential decay (frame 1 -> duration)
  const opacity = interpolate(
    frame,
    [0, 1, durationInFrames],
    [0, peakOpacity, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        zIndex: 999,
        backgroundColor: flashColor,
        opacity,
        mixBlendMode: isInvert ? 'difference' : 'screen',
      }}
    />
  );
};
