import React from 'react';
import { Audio, Sequence, staticFile, useVideoConfig } from 'remotion';

export interface SoundCue {
  frame: number; // Video frame when the sound PEAK should hit
  src: string; // File path or staticFile relative path
  volume?: number; // Base volume multiplier (0.0 to 1.0)
  durationInFrames?: number; // Window truncation (required for >5s samples)
  peakLagFrames?: number; // File's attack offset until peak (default: 0)
  label?: string; // Descriptive tag (e.g. "hero-card-impact")
}

export interface SoundTimelineProps {
  cues: SoundCue[];
  bgmSrc?: string;
  bgmVolume?: number;
  enableBgm?: boolean; // Prop for dual delivery (with/without BGM)
  aacPrimingOffset?: number; // Pipeline priming compensation (typical: 1.28 frames @ 30fps)
}

/**
 * SoundTimeline: Declarative Frame-Pinned Audio Engine for Zomotion.
 *
 * Implements:
 * - Rule S2: Frame-pinned audio cue table with exact visual synchronization.
 * - Rule S5: AAC priming compensation formula:
 *     from = Math.max(0, Math.round(targetFrame - aacPrimingOffset - peakLag))
 * - Rule S4: Automatic sample duration truncation preventing audio overhangs.
 * - Dual delivery support (clean SFX track vs full mix with BGM).
 */
export const SoundTimeline: React.FC<SoundTimelineProps> = ({
  cues,
  bgmSrc,
  bgmVolume = 0.35,
  enableBgm = true,
  aacPrimingOffset = 1.28,
}) => {
  const { fps } = useVideoConfig();

  return (
    <>
      {/* Background Music Track */}
      {enableBgm && bgmSrc && (
        <Audio
          src={bgmSrc.startsWith('http') ? bgmSrc : staticFile(bgmSrc)}
          volume={bgmVolume}
        />
      )}

      {/* Frame-pinned SFX cues */}
      {cues.map((cue, idx) => {
        const peakLag = cue.peakLagFrames ?? 0;
        // Apply AAC encoder priming latency compensation
        const startFrame = Math.max(
          0,
          Math.round(cue.frame - aacPrimingOffset - peakLag),
        );
        const resolvedSrc = cue.src.startsWith('http')
          ? cue.src
          : staticFile(cue.src);

        return (
          <Sequence
            key={`${idx}-${cue.src}`}
            from={startFrame}
            durationInFrames={cue.durationInFrames ?? 90}
            name={`sfx:${cue.label ?? cue.src}`}
          >
            <Audio src={resolvedSrc} volume={cue.volume ?? 0.5} />
          </Sequence>
        );
      })}
    </>
  );
};
