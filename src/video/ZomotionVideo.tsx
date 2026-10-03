import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { SceneIntro } from './SceneIntro';
import { SceneWhatIs } from './SceneWhatIs';
import { SceneHowToUse } from './SceneHowToUse';
import { SceneOutro } from './SceneOutro';
import { FlashCut } from '../zomotion/FlashCut';
import { SoundTimeline, SoundCue } from '../zomotion/SoundTimeline';
import { tokens } from '../zomotion/tokens';

export const ZOMOTION_TOTAL_FRAMES = 1800; // Exactly 60 seconds @ 30fps

const AUDIO_CUES: SoundCue[] = [
  // Scene 1 Cues
  { frame: 2, src: 'audio/riser-cine.mp3', volume: 0.5, label: 'intro-riser' },
  { frame: 32, src: 'audio/impact-cine.mp3', volume: 0.7, label: 'title-impact' },
  { frame: 54, src: 'audio/sparkle.mp3', volume: 0.35, label: 'intro-sparkle' },
  { frame: 145, src: 'audio/whoosh-fast.mp3', volume: 0.4, label: 'card-flyin' },
  { frame: 160, src: 'audio/pop.mp3', volume: 0.4, label: 'metric-1' },
  { frame: 168, src: 'audio/pop.mp3', volume: 0.35, label: 'metric-2' },
  { frame: 176, src: 'audio/pop.mp3', volume: 0.3, label: 'metric-3' },

  // Transition 1 -> Scene 2
  { frame: 356, src: 'audio/transition-snap.mp3', volume: 0.65, label: 'cut-1' },
  { frame: 410, src: 'audio/click-camera.mp3', volume: 0.6, label: 'camera-shutter' },
  { frame: 435, src: 'audio/whoosh-big.mp3', volume: 0.45, label: 'orbit-whoosh' },

  // Transition 2 -> Scene 3
  { frame: 776, src: 'audio/transition-soft.mp3', volume: 0.55, label: 'cut-2' },
  { frame: 805, src: 'audio/keyboard.mp3', volume: 0.5, durationInFrames: 70, label: 'typing-foley' },
  { frame: 960, src: 'audio/pop.mp3', volume: 0.4, label: 'deck-card-1' },
  { frame: 974, src: 'audio/pop.mp3', volume: 0.35, label: 'deck-card-2' },
  { frame: 988, src: 'audio/pop.mp3', volume: 0.3, label: 'deck-card-3' },
  { frame: 1002, src: 'audio/pop.mp3', volume: 0.25, label: 'deck-card-4' },

  // Transition 3 -> Scene 4 (Outro)
  { frame: 1376, src: 'audio/whoosh-big.mp3', volume: 0.65, label: 'climax-whoosh' },
  { frame: 1420, src: 'audio/impact-cine.mp3', volume: 0.8, label: 'lockdown-impact' },
  { frame: 1465, src: 'audio/sparkle.mp3', volume: 0.45, label: 'lockdown-sparkle' },
];

export const ZomotionVideo: React.FC<{ enableBgm?: boolean }> = ({ enableBgm = true }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: tokens.bg, fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Declarative Audio Engine with AAC Priming Offset Compensation (-1.28f) */}
      <SoundTimeline
        cues={AUDIO_CUES}
        bgmSrc="audio/bgm.mp3"
        bgmVolume={0.25}
        enableBgm={enableBgm}
      />

      {/* SCENE 1: Introduction & The Synthesis (0 - 360f / 12.0s) */}
      <Sequence from={0} durationInFrames={360} name="Scene: Intro & Title">
        <SceneIntro />
      </Sequence>

      {/* TRANSITION 1: Flash Cut (356 - 364f) */}
      <Sequence from={356} durationInFrames={8} name="Transition: Cut 1">
        <FlashCut flashColor={tokens.accent} peakOpacity={0.5} blendMode="normal" />
      </Sequence>

      {/* SCENE 2: What is Zomotion? 2.5D Cam & Physics (360 - 780f / 14.0s) */}
      <Sequence from={360} durationInFrames={420} name="Scene: What is Zomotion">
        <SceneWhatIs />
      </Sequence>

      {/* TRANSITION 2: Flash Cut (776 - 784f) */}
      <Sequence from={776} durationInFrames={8} name="Transition: Cut 2">
        <FlashCut flashColor={tokens.accentAlt} peakOpacity={0.45} blendMode="normal" />
      </Sequence>

      {/* SCENE 3: How to Use Zomotion: 3 Steps (780 - 1380f / 20.0s) */}
      <Sequence from={780} durationInFrames={600} name="Scene: How to Use">
        <SceneHowToUse />
      </Sequence>

      {/* TRANSITION 3: Flash Cut (1376 - 1384f) */}
      <Sequence from={1376} durationInFrames={8} name="Transition: Cut 3">
        <FlashCut flashColor={tokens.accentDeep} peakOpacity={0.55} blendMode="normal" />
      </Sequence>

      {/* SCENE 4: Climax Assembly & Brand Lockdown (1380 - 1800f / 14.0s) */}
      <Sequence from={1380} durationInFrames={420} name="Scene: Outro & Lockdown">
        <SceneOutro />
      </Sequence>
    </AbsoluteFill>
  );
};
