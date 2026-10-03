import React from 'react';
import { Composition } from 'remotion';
import { ZomotionVideo, ZOMOTION_TOTAL_FRAMES } from './video/ZomotionVideo';
import { ZomotionReel, ZOMOTION_REEL_TOTAL } from './reel/ZomotionReel';
import { VerticalAiShort } from './vertical/VerticalAiShort';
import {
  GEMINI_4_PRO_TEASER_PROPS,
  GEMINI_4_PRO_FULL_PROPS,
} from './vertical/gemini4ProData';

export const Root: React.FC = () => {
  return (
    <>
      {/* The Reel: Five acts on the frame-gate system */}
      <Composition
        id="ZomotionReel"
        component={ZomotionReel}
        durationInFrames={ZOMOTION_REEL_TOTAL}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 1-Minute Zomotion Explainer */}
      <Composition
        id="ZomotionExplainer"
        component={ZomotionVideo}
        durationInFrames={ZOMOTION_TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          enableBgm: true,
        }}
      />

      {/* 9:16 Vertical: Gemini 4 Pro 10-Second Teaser Clip */}
      <Composition
        id="Gemini4ProTeaser"
        component={VerticalAiShort}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={GEMINI_4_PRO_TEASER_PROPS}
      />

      {/* 9:16 Vertical: Gemini 4 Pro Full 30-Second Short Video */}
      <Composition
        id="Gemini4ProFull"
        component={VerticalAiShort}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={GEMINI_4_PRO_FULL_PROPS}
      />

      {/* 9:16 Vertical: Dynamic Trending AI Short */}
      <Composition
        id="TrendingAIShort"
        component={VerticalAiShort}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={GEMINI_4_PRO_FULL_PROPS}
      />
    </>
  );
};
