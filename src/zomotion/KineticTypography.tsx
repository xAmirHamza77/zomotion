import React from 'react';
import { interpolate, useCurrentFrame, Easing } from 'remotion';

export interface KineticTypographyProps {
  leadWord: string;
  followingWords: string[];
  subtitle?: string;
  leadHighlightColor?: string;
  textColor?: string;
  subtitleColor?: string;
  fontSize?: number;
}

const PUSH_EASE = Easing.bezier(0.25, 1, 0.5, 1);
const ZOOM_EASE = Easing.bezier(0.5, 0, 0.05, 1);
const WORD_PUSH_EASE = Easing.bezier(0.22, 0.8, 0.36, 1);

/**
 * KineticTypography: Implementation of Zomotion's "lead-word-zoom-assemble" recipe.
 *
 * Sequence:
 * - Frames 0-12: Lead word appears at initialScale (2.3x) and pushes forward by +6%.
 * - Frames 12-36: Lead word retracts to 1.0x while simultaneously sliding into sentence slot.
 * - Frames 18+: Subsequent words are pushed into their slots with 4-frame stagger.
 * - Frames 34-50: Full sentence elevates by -28px while subtitle fades in beneath it.
 * - Frames 50+: Held stationary for breathability (Aesthetic Rule R1).
 */
export const KineticTypography: React.FC<KineticTypographyProps> = ({
  leadWord,
  followingWords,
  subtitle,
  leadHighlightColor = '#6366f1',
  textColor = '#ffffff',
  subtitleColor = 'rgba(255, 255, 255, 0.65)',
  fontSize = 68,
}) => {
  const frame = useCurrentFrame();

  // Phase 1: Lead word scale
  // Two-segment scale added smoothly to prevent velocity discontinuities
  const scalePush = interpolate(frame, [0, 12], [2.3, 2.3 * 1.06], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: PUSH_EASE,
  });

  const scaleRetract = interpolate(frame, [12, 28], [0, 1 - 2.3 * 1.06], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ZOOM_EASE,
  });

  const leadScale = frame < 12 ? scalePush : scalePush + scaleRetract;

  // Slide sentence into center alignment
  // Estimate lead word ratio in the sentence (~0.35)
  const slideOffset = interpolate(frame, [12, 36], [160, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ZOOM_EASE,
  });

  // Scene elevation after words assemble
  const titleLift = interpolate(frame, [34, 50], [0, -24], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.25, 1, 0.5, 1),
  });

  // Subtitle fade and slide in
  const subOpacity = interpolate(frame, [36, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const subTranslateY = interpolate(frame, [36, 50], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Main Title Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          fontSize,
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          color: textColor,
          transform: `translate3d(${slideOffset}px, ${titleLift}px, 0)`,
        }}
      >
        {/* Lead Word */}
        <span
          style={{
            display: 'inline-block',
            color: leadHighlightColor,
            transform: `scale(${leadScale})`,
            transformOrigin: '50% 80%',
            filter:
              frame < 12
                ? `drop-shadow(0 0 30px ${leadHighlightColor}88)`
                : undefined,
          }}
        >
          {leadWord}
        </span>

        {/* Space explicitly outside inline-blocks to prevent glyph collapse */}
        <span style={{ display: 'inline-block', width: '0.3em' }} />

        {/* Following Words */}
        {followingWords.map((word, i) => {
          const pushStart = 18 + i * 4;
          const wordPushX = interpolate(
            frame,
            [pushStart, pushStart + 12],
            [35, 0],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: WORD_PUSH_EASE,
            },
          );
          const wordOpacity = interpolate(
            frame,
            [pushStart, pushStart + 3],
            [0, 1],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            },
          );

          return (
            <React.Fragment key={i}>
              <span
                style={{
                  display: 'inline-block',
                  opacity: wordOpacity,
                  transform: `translate3d(${wordPushX}px, 0, 0)`,
                }}
              >
                {word}
              </span>
              {i < followingWords.length - 1 && (
                <span style={{ display: 'inline-block', width: '0.3em' }} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Subtitle Caption */}
      {subtitle && (
        <div
          style={{
            marginTop: '28px',
            fontSize: Math.round(fontSize * 0.42),
            fontWeight: 500,
            letterSpacing: '-0.01em',
            color: subtitleColor,
            opacity: subOpacity,
            transform: `translate3d(0, ${titleLift + subTranslateY}px, 0)`,
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
};
