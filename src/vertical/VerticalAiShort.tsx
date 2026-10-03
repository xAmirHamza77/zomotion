import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { VerticalVideoData, SceneData } from './types';
import { VerticalBackground } from './VerticalBackground';
import { SceneHeroCore } from './SceneHeroCore';
import { SceneSpecsTerminal } from './SceneSpecsTerminal';
import { SceneBenchmarkMatrix } from './SceneBenchmarkMatrix';
import { SceneCtaLaunch } from './SceneCtaLaunch';
import { FlashCut } from '../zomotion/FlashCut';
import { VerticalSoundTimeline, SoundCue } from './VerticalSoundTimeline';

export const VerticalAiShort: React.FC<VerticalVideoData> = ({
  topic,
  brandPill,
  totalDurationFrames,
  scenes,
  voiceoverAudio = 'audio/voiceover.mp3',
  bgmAudio = 'audio/bgm.mp3',
  bgmVolume = 0.16,
  voiceoverVolume = 1.0,
}) => {
  const currentFrame = useCurrentFrame();

  // Calculate cumulative start frames for each scene
  let accumulatedFrames = 0;
  const scenesWithOffsets = scenes.map((scene) => {
    const start = accumulatedFrames;
    accumulatedFrames += scene.durationInFrames;
    return { ...scene, startFrame: start };
  });

  // Find active scene for dynamic background accent wash
  const activeScene =
    scenesWithOffsets.find(
      (s) => currentFrame >= s.startFrame && currentFrame < s.startFrame + s.durationInFrames,
    ) || scenesWithOffsets[0];

  // Build audio cue sheet based on scene boundaries
  const audioCues: SoundCue[] = [
    { frame: 0, src: 'audio/riser-cine.mp3', volume: 0.45, label: 'intro-riser' },
    { frame: 2, src: 'audio/impact-cine.mp3', volume: 0.75, label: 'hero-impact' },
  ];

  scenesWithOffsets.forEach((scene, idx) => {
    if (idx > 0) {
      audioCues.push({
        frame: scene.startFrame,
        src: 'audio/whoosh-fast.mp3',
        volume: 0.45,
        label: `scene-${idx + 1}-transition`,
      });
      audioCues.push({
        frame: scene.startFrame + 4,
        src: 'audio/impact-cine.mp3',
        volume: 0.5,
        label: `scene-${idx + 1}-hit`,
      });
    }

    if (scene.sceneType === 'specs') {
      audioCues.push({
        frame: scene.startFrame + 14,
        src: 'audio/keyboard.mp3',
        volume: 0.45,
        durationInFrames: 60,
        label: 'typing-code',
      });
    } else if (scene.sceneType === 'benchmark') {
      audioCues.push({
        frame: scene.startFrame + 25,
        src: 'audio/sparkle.mp3',
        volume: 0.35,
        label: 'benchmark-sparkle',
      });
    } else if (scene.sceneType === 'cta') {
      audioCues.push({
        frame: scene.startFrame + 18,
        src: 'audio/sparkle.mp3',
        volume: 0.4,
        label: 'cta-glow',
      });
    }
  });

  const renderSceneComponent = (scene: SceneData) => {
    switch (scene.sceneType) {
      case 'core':
        return <SceneHeroCore scene={scene} brandPill={brandPill} />;
      case 'specs':
        return <SceneSpecsTerminal scene={scene} />;
      case 'benchmark':
        return <SceneBenchmarkMatrix scene={scene} />;
      case 'cta':
        return <SceneCtaLaunch scene={scene} />;
      default:
        return <SceneHeroCore scene={scene} brandPill={brandPill} />;
    }
  };

  return (
    <AbsoluteFill style={{ width: 1080, height: 1920, backgroundColor: '#07080d' }}>
      {/* Dynamic Ambient Background */}
      <VerticalBackground accentColor={activeScene?.accentColor || '#38bdf8'} />

      {/* Sequenced Scenes */}
      {scenesWithOffsets.map((scene, idx) => {
        return (
          <Sequence
            key={scene.id}
            from={scene.startFrame}
            durationInFrames={scene.durationInFrames}
          >
            {renderSceneComponent(scene)}
          </Sequence>
        );
      })}

      {/* Flash Cuts at scene transitions */}
      {scenesWithOffsets.slice(1).map((scene, idx) => {
        return (
          <Sequence key={idx} from={scene.startFrame} durationInFrames={6}>
            <FlashCut flashColor={scene.accentColor} peakOpacity={0.7} />
          </Sequence>
        );
      })}

      {/* Frame-Accurate Audio & Voiceover Timeline */}
      <VerticalSoundTimeline
        cues={audioCues}
        bgmSrc={bgmAudio}
        bgmVolume={bgmVolume}
        voiceoverSrc={voiceoverAudio}
        voiceoverVolume={voiceoverVolume}
      />
    </AbsoluteFill>
  );
};
