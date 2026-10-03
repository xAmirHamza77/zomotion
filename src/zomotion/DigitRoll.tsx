import React from 'react';
import { interpolate, useCurrentFrame, Easing } from 'remotion';
import { dampedSettle } from './motion-helpers';

export interface DigitRollProps {
  value: number; // Final target numeric value
  prefix?: string; // e.g. "$"
  suffix?: string; // e.g. "%" or "/mo"
  fontSize?: number;
  color?: string;
  startFrame?: number;
  durationPerDigit?: number; // Duration of digit spin
  stagger?: number; // Delay between adjacent digit columns
  decimals?: number;
}

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

interface ColumnProps {
  targetDigit: number;
  fontSize: number;
  color: string;
  startFrame: number;
  duration: number;
}

const DigitColumn: React.FC<ColumnProps> = ({
  targetDigit,
  fontSize,
  color,
  startFrame,
  duration,
}) => {
  const frame = useCurrentFrame();
  const digitHeight = fontSize * 1.25;

  // Spin through multiple rotations before landing on target digit
  const extraRotations = 2;
  const totalOffset = (extraRotations * 10 + targetDigit) * digitHeight;

  const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Physical recoil upon landing
  const framesAfterImpact = frame - (startFrame + duration);
  const recoil = dampedSettle(framesAfterImpact, 0.12, 0.18) * (fontSize * 0.15);

  const translateY = -(progress * totalOffset) + recoil;

  // Array of 30 digits (0-9 repeated 3 times)
  const digitList = [...DIGITS, ...DIGITS, ...DIGITS];

  return (
    <div
      style={{
        height: digitHeight,
        overflow: 'hidden',
        position: 'relative',
        display: 'inline-block',
        lineHeight: `${digitHeight}px`,
      }}
    >
      <div
        style={{
          transform: `translate3d(0, ${translateY}px, 0)`,
          color,
        }}
      >
        {digitList.map((d, idx) => (
          <div
            key={idx}
            style={{
              height: digitHeight,
              textAlign: 'center',
              fontWeight: 800,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * DigitRoll: Mechanical Odometer & Counter Metric Component.
 * Animates numerical transitions with staggered vertical column wheels and physical recoil.
 */
export const DigitRoll: React.FC<DigitRollProps> = ({
  value,
  prefix = '',
  suffix = '',
  fontSize = 72,
  color = '#ffffff',
  startFrame = 5,
  durationPerDigit = 28,
  stagger = 4,
  decimals = 0,
}) => {
  const formatted = value.toFixed(decimals);
  const characters = formatted.split('');

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        fontSize,
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        fontWeight: 800,
        color,
      }}
    >
      {prefix && (
        <span style={{ marginRight: '0.15em', opacity: 0.85 }}>{prefix}</span>
      )}

      {characters.map((char, index) => {
        if (char >= '0' && char <= '9') {
          const digit = parseInt(char, 10);
          return (
            <DigitColumn
              key={index}
              targetDigit={digit}
              fontSize={fontSize}
              color={color}
              startFrame={startFrame + index * stagger}
              duration={durationPerDigit}
            />
          );
        }

        // Non-digit characters (commas, decimals, dots)
        return (
          <span
            key={index}
            style={{
              padding: '0 0.05em',
              fontWeight: 700,
              opacity: 0.9,
            }}
          >
            {char}
          </span>
        );
      })}

      {suffix && (
        <span style={{ marginLeft: '0.15em', opacity: 0.85 }}>{suffix}</span>
      )}
    </div>
  );
};
