import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { reel, GATE_INSET, GATE_W, GATE_H, timecode } from './reel-tokens';

/** One L-shaped corner mark. sx/sy pick the corner it grows away from. */
const corner = (x: number, y: number, sx: number, sy: number): React.ReactElement => (
  <>
    <div
      style={{
        position: 'absolute',
        left: GATE_INSET + x,
        top: GATE_INSET + y,
        width: 28,
        height: 1.5,
        background: reel.ink3,
        opacity: 0.5,
        transformOrigin: sx > 0 ? 'left' : 'right',
        transform: `scaleX(${sx})`,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: GATE_INSET + x,
        top: GATE_INSET + y,
        width: 1.5,
        height: 28,
        background: reel.ink3,
        opacity: 0.5,
        transformOrigin: sy > 0 ? 'top' : 'bottom',
        transform: `scaleY(${sy})`,
      }}
    />
  </>
);

/**
 * FrameGate — the device that holds the whole reel together.
 *
 * Everything here is staged as a frame inside a frame: corner crop marks, a
 * perforation strip along the top edge, a live timecode, a frame counter. The
 * numbers are not decoration — timecode, the frame counter and the playhead are
 * all derived from the real render clock, so the gate tells you where you are
 * in the file. `dark` flips it to a light gate for the reveal act.
 */
export const FrameGate: React.FC<{
  /** 0-1 progress through the composition; drives the playhead. */
  progress: number;
  /** Sentence-case label, bottom-left. Deliberately not a tracked caps eyebrow. */
  caption?: string;
  dark?: boolean;
  opacity?: number;
}> = ({ progress, caption, dark = false, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const mark = dark ? reel.voidInk2 : reel.ink3;
  const meta = dark ? reel.voidInk2 : reel.ink3;
  const label = dark ? reel.voidInk : reel.ink2;
  const ticks = 48;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity }}>
      {corner(0, 0, 1, 1)}
      {corner(GATE_W, 0, -1, 1)}
      {corner(0, GATE_H, 1, -1)}
      {corner(GATE_W, GATE_H, -1, -1)}

      {/* Perforation strip + playhead */}
      <div style={{ position: 'absolute', left: GATE_INSET, top: GATE_INSET - 14, width: GATE_W }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: 9 }}>
          {Array.from({ length: ticks }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 1.5,
                height: i % 6 === 0 ? 9 : 5,
                background: mark,
                opacity: i % 6 === 0 ? 0.45 : 0.24,
              }}
            />
          ))}
        </div>
        <div
          style={{
            position: 'absolute',
            top: -5,
            left: Math.min(Math.max(0, progress * GATE_W), GATE_W - 3),
            width: 3,
            height: 18,
            background: reel.flame,
            boxShadow: `0 0 12px ${reel.flame}`,
          }}
        />
      </div>

      {/* Bottom-left: caption + timecode */}
      <div
        style={{
          position: 'absolute',
          left: GATE_INSET,
          bottom: GATE_INSET - 4,
          display: 'flex',
          alignItems: 'baseline',
          gap: 20,
        }}
      >
        {caption && (
          <span style={{ fontFamily: reel.display, fontWeight: 600, fontSize: 15, color: label }}>
            {caption}
          </span>
        )}
        <span
          style={{
            fontFamily: reel.mono,
            fontSize: 13,
            letterSpacing: '0.1em',
            color: meta,
            opacity: 0.7,
          }}
        >
          {timecode(frame, fps)}
        </span>
      </div>

      {/* Bottom-right: frame counter */}
      <div
        style={{
          position: 'absolute',
          right: GATE_INSET,
          bottom: GATE_INSET - 4,
          fontFamily: reel.mono,
          fontSize: 13,
          letterSpacing: '0.1em',
          color: meta,
          opacity: 0.7,
        }}
      >
        f{String(frame).padStart(4, '0')} / {durationInFrames}
      </div>
    </div>
  );
};
