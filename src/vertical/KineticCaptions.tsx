import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { WordTiming } from './types';

interface KineticCaptionsProps {
  subtitles: WordTiming[];
  accentColor?: string;
  startFrameOffset?: number;
}

export const KineticCaptions: React.FC<KineticCaptionsProps> = ({
  subtitles,
  accentColor = '#38bdf8',
  startFrameOffset = 0,
}) => {
  const currentFrame = useCurrentFrame();
  const relFrame = currentFrame - startFrameOffset;

  if (!subtitles || subtitles.length === 0) return null;

  // Find currently active word
  const activeIndex = subtitles.findIndex(
    (w) => relFrame >= w.startFrame && relFrame <= w.endFrame + 4,
  );

  // If no word is currently active, find if we are within the general spoken window
  const firstWord = subtitles[0];
  const lastWord = subtitles[subtitles.length - 1];

  if (relFrame < firstWord.startFrame - 4 || relFrame > lastWord.endFrame + 12) {
    return null;
  }

  // Smooth opacity for sentence
  const opacity = interpolate(
    relFrame,
    [firstWord.startFrame - 4, firstWord.startFrame, lastWord.endFrame, lastWord.endFrame + 10],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Group into display chunks (e.g. show ~5 words at a time or the full phrase cleanly)
  // For high retention shorts, showing 3-6 words centered with the active one highlighted is optimal.
  const targetIndex = activeIndex >= 0 ? activeIndex : 0;
  const chunkStart = Math.max(0, targetIndex - 2);
  const chunkEnd = Math.min(subtitles.length, chunkStart + 5);
  const visibleWords = subtitles.slice(chunkStart, chunkEnd);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 230,
        left: 60,
        right: 60,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity,
        zIndex: 50,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px 36px',
          background: 'rgba(8, 10, 16, 0.78)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 24,
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.45)',
          gap: '14px',
        }}
      >
        {visibleWords.map((item, idx) => {
          const actualIndex = chunkStart + idx;
          const isCurrent = actualIndex === activeIndex;

          return (
            <span
              key={actualIndex}
              style={{
                fontSize: 48,
                fontWeight: isCurrent ? 800 : 600,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                color: isCurrent ? accentColor : 'rgba(255, 255, 255, 0.85)',
                textShadow: isCurrent
                  ? `0 0 24px ${accentColor}aa, 0 2px 4px rgba(0,0,0,0.8)`
                  : '0 2px 4px rgba(0,0,0,0.6)',
                transform: isCurrent ? 'scale(1.08)' : 'scale(1.0)',
                transition: 'transform 0.1s ease-out, color 0.1s ease-out',
                display: 'inline-block',
              }}
            >
              {item.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
