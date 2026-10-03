import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';

export interface SoundCue {
  frame: number;
  src: string;
  volume?: number;
  label?: string;
  durationInFrames?: number;
}

interface VerticalSoundTimelineProps {
  cues: SoundCue[];
  bgmSrc?: string;
  bgmVolume?: number;
  voiceoverSrc?: string;
  voiceoverVolume?: number;
}

/** Priming latency offset (-1.28 frames) for AAC encoder synchronization */
const PRIMING_OFFSET_FRAMES = 1.28;

export const VerticalSoundTimeline: React.FC<VerticalSoundTimelineProps> = ({
  cues,
  bgmSrc = 'audio/bgm.mp3',
  bgmVolume = 0.16,
  voiceoverSrc,
  voiceoverVolume = 1.0,
}) => {
  return (
    <>
      {/* Background Music */}
      {bgmSrc && (
        <Audio
          src={staticFile(bgmSrc)}
          volume={bgmVolume}
          loop
        />
      )}

      {/* Voiceover Speech Track */}
      {voiceoverSrc && (
        <Audio
          src={staticFile(voiceoverSrc)}
          volume={voiceoverVolume}
        />
      )}

      {/* Synchronized Foley / Sound Effects */}
      {cues.map((cue, idx) => {
        const startFrame = Math.max(0, Math.round(cue.frame - PRIMING_OFFSET_FRAMES));
        return (
          <Sequence
            key={idx}
            from={startFrame}
            durationInFrames={cue.durationInFrames || 90}
          >
            <Audio
              src={staticFile(cue.src)}
              volume={cue.volume ?? 0.45}
            />
          </Sequence>
        );
      })}
    </>
  );
};
