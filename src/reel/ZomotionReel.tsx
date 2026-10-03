import React from 'react';
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from 'remotion';
import { reel } from '../zomotion/reel-tokens';
import { FrameGate } from '../zomotion/FrameGate';
import { SoundTimeline, SoundCue } from '../zomotion/SoundTimeline';
import { Act1Type } from './Act1Type';
import { Act2Tunnel } from './Act2Tunnel';
import { Act3Steps } from './Act3Steps';
import { Act4Reveal } from './Act4Reveal';
import { Act5Lockup } from './Act5Lockup';

/** Act boundaries, in frames. Summed: 1800. */
const A1 = 0;
const A2 = 270;
const A3 = 750;
const A4 = 1290;
const A5 = 1620;
const TOTAL = 1800;

const CAPTION = (frame: number): string => {
  if (frame < A2) return 'title';
  if (frame < A3) return 'what it is';
  if (frame < A4) return 'how to use it';
  if (frame < A5) return '';
  return 'start here';
};

/**
 * The cue sheet is written against the act boundaries, not against the old
 * cut's scene times, so every hit lands on the frame that actually causes it:
 * the tunnel's first word, the step-1 command, the lockup's metal.
 */
const AUDIO_CUES: SoundCue[] = [
  // Act 1 — letters land, rule wipes, then the fly-through
  { frame: 0, src: 'audio/riser-cine.mp3', volume: 0.45, label: 'open-riser' },
  { frame: 10, src: 'audio/impact-cine.mp3', volume: 0.7, label: 'first-letter' },
  { frame: 24, src: 'audio/pop.mp3', volume: 0.3, label: 'letter-2' },
  { frame: 36, src: 'audio/pop.mp3', volume: 0.28, label: 'letter-3' },
  { frame: 48, src: 'audio/pop.mp3', volume: 0.26, label: 'letter-4' },
  { frame: 60, src: 'audio/pop.mp3', volume: 0.24, label: 'letter-5' },
  { frame: 72, src: 'audio/pop.mp3', volume: 0.22, label: 'letter-6' },
  { frame: 46, src: 'audio/swoosh-quick.mp3', volume: 0.3, label: 'rule-wipe' },
  { frame: 206, src: 'audio/whoosh-big.mp3', volume: 0.5, label: 'act-1-flythrough' },

  // Act 2 — tunnel rushes
  { frame: 272, src: 'audio/whoosh-fast.mp3', volume: 0.35, label: 'tunnel-in' },
  { frame: 296, src: 'audio/swoosh-quick.mp3', volume: 0.3, label: 'word-1' },
  { frame: 348, src: 'audio/swoosh-quick.mp3', volume: 0.3, label: 'word-2' },
  { frame: 400, src: 'audio/swoosh-quick.mp3', volume: 0.32, label: 'word-3' },
  { frame: 452, src: 'audio/swoosh-quick.mp3', volume: 0.32, label: 'word-4' },
  { frame: 504, src: 'audio/transition-soft.mp3', volume: 0.4, label: 'statement-wipe' },
  { frame: 560, src: 'audio/click-camera.mp3', volume: 0.4, label: 'glass-plate' },

  // Act 3 — the three steps
  { frame: 752, src: 'audio/transition-snap.mp3', volume: 0.5, label: 'act-3-cut' },
  { frame: 764, src: 'audio/keyboard.mp3', volume: 0.5, durationInFrames: 70, label: 'typing' },
  { frame: 928, src: 'audio/transition-soft.mp3', volume: 0.45, label: 'step-2' },
  { frame: 962, src: 'audio/pop.mp3', volume: 0.32, label: 'thumb-1' },
  { frame: 976, src: 'audio/pop.mp3', volume: 0.3, label: 'thumb-2' },
  { frame: 990, src: 'audio/pop.mp3', volume: 0.28, label: 'thumb-3' },
  { frame: 1004, src: 'audio/pop.mp3', volume: 0.26, label: 'thumb-4' },
  { frame: 1116, src: 'audio/transition-soft.mp3', volume: 0.45, label: 'step-3' },
  { frame: 1410, src: 'audio/click-camera.mp3', volume: 0.45, label: 'render-done' },

  // Act 4 — the lights go out, then the metal
  { frame: 1284, src: 'audio/whoosh-big.mp3', volume: 0.55, label: 'lights-out' },
  { frame: 1290, src: 'audio/sparkle.mp3', volume: 0.4, label: 'particle-swarm' },
  { frame: 1360, src: 'audio/impact-cine.mp3', volume: 0.75, label: 'edge-light' },
  { frame: 1420, src: 'audio/sparkle.mp3', volume: 0.45, label: 'metal-resolves' },

  // Act 5 — lights up
  { frame: 1616, src: 'audio/transition-soft.mp3', volume: 0.4, label: 'lights-up' },
  { frame: 1660, src: 'audio/impact-cine.mp3', volume: 0.5, label: 'close-lockup' },
  { frame: 1704, src: 'audio/click-camera.mp3', volume: 0.3, label: 'strip-in' },
];

/**
 * Zomotion — Reel.
 *
 * 60 seconds, five acts, one layout device. The page is light for the whole
 * explainer, cuts to true void for the reveal, and comes back up for the close.
 * A slow-drifting bloom sits above the page and behind everything else — it is
 * the only thing the glass in act 2 has to refract, and it is what stops the
 * light acts from reading as flat white.
 */
export const ZomotionReel: React.FC<{ enableBgm?: boolean }> = ({ enableBgm = true }) => {
  const frame = useCurrentFrame();

  // A four-frame cut, not a fade: the lights go out and come back.
  const dark = Math.min(
    interpolate(frame, [A4 - 4, A4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    interpolate(frame, [A5 - 4, A5], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
  );

  // The bloom drifts on a long, irrational period so it never appears to loop.
  // Kept deliberately faint: at higher strength it stops being an environment
  // the glass can refract and becomes a peach wash over half the page.
  const bx = Math.sin(frame / 260) * 70;
  const by = Math.cos(frame / 340) * 50;
  const bloomOpacity = (1 - dark) * interpolate(frame, [0, 90], [0.5, 0.8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: reel.page }}>
      <SoundTimeline cues={AUDIO_CUES} bgmSrc="audio/bgm.mp3" bgmVolume={0.22} enableBgm={enableBgm} />

      <AbsoluteFill style={{ backgroundColor: reel.void, opacity: dark }} />

      {/* The environment. The only soft thing on an otherwise flat page. */}
      <div
        style={{
          position: 'absolute',
          left: 960 - 1000 + bx,
          top: 540 - 560 + by,
          width: 2000,
          height: 1120,
          opacity: bloomOpacity,
          background: `radial-gradient(ellipse at 22% 14%, ${reel.flameSoft} 0%, transparent 44%),
                       radial-gradient(ellipse at 80% 86%, rgba(120,120,132,0.10) 0%, transparent 48%)`,
        }}
      />

      <Sequence from={A1} durationInFrames={A2 - A1} name="Act 1 — kinetic type">
        <Act1Type />
      </Sequence>
      <Sequence from={A2} durationInFrames={A3 - A2} name="Act 2 — typography tunnel">
        <Act2Tunnel />
      </Sequence>
      <Sequence from={A3} durationInFrames={A4 - A3} name="Act 3 — how to use it">
        <Act3Steps />
      </Sequence>
      <Sequence from={A4} durationInFrames={A5 - A4} name="Act 4 — reveal">
        <Act4Reveal />
      </Sequence>
      <Sequence from={A5} durationInFrames={TOTAL - A5} name="Act 5 — lockup">
        <Act5Lockup />
      </Sequence>

      {/* The gate sits above everything, including the bloom. */}
      <FrameGate progress={frame / TOTAL} caption={CAPTION(frame)} dark={dark > 0.5} />
    </AbsoluteFill>
  );
};

export const ZOMOTION_REEL_TOTAL = TOTAL;
