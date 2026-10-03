import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { SceneData, ComparisonItem } from './types';
import { KineticCaptions } from './KineticCaptions';

interface SceneBenchmarkMatrixProps {
  scene: SceneData;
}

export const SceneBenchmarkMatrix: React.FC<SceneBenchmarkMatrixProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const entrance = spring({
    frame,
    fps,
    config: { damping: 15, mass: 0.9, stiffness: 120 },
  });

  const cardScale = interpolate(entrance, [0, 1], [0.86, 1]);
  const cardY = interpolate(entrance, [0, 1], [50, 0]);
  const cardOpacity = interpolate(entrance, [0, 0.7], [0, 1]);

  // Default comparison bars if not provided
  const items: ComparisonItem[] = scene.comparisonItems || [
    { label: 'Gemini 4 Pro', score: 98.4, displayValue: '98.4%', isHighlight: true, color: scene.accentColor },
    { label: 'OpenAI o3-mini', score: 86.2, displayValue: '86.2%', isHighlight: false, color: '#64748b' },
    { label: 'Claude 3.5 Sonnet', score: 82.0, displayValue: '82.0%', isHighlight: false, color: '#64748b' },
    { label: 'GPT-4.5 Preview', score: 78.5, displayValue: '78.5%', isHighlight: false, color: '#64748b' },
  ];

  const words = scene.headline.split(' ');
  const highlight = scene.highlightWord || words[words.length - 1];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '110px 48px 0 48px',
        boxSizing: 'border-box',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Top Floating Pill Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 26px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 999,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: `0 4px 20px ${scene.accentColor}25`,
          opacity: cardOpacity,
          transform: `translateY(${cardY}px)`,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: scene.accentColor,
            boxShadow: `0 0 10px ${scene.accentColor}`,
          }}
        />
        <span
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          {scene.tag || '✦ WORLD RECORDS • BENCHMARKS'}
        </span>
      </div>

      {/* Main Kinetic Headline */}
      <div
        style={{
          marginTop: 48,
          textAlign: 'center',
          opacity: cardOpacity,
          transform: `translateY(${cardY}px)`,
          maxWidth: 960,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 84,
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            color: '#FFFFFF',
          }}
        >
          {words.map((w, idx) => {
            const isHighlight = w.toLowerCase() === highlight.toLowerCase();
            return (
              <span
                key={idx}
                style={{
                  display: 'inline-block',
                  marginRight: '0.22em',
                  color: isHighlight ? scene.accentColor : '#FFFFFF',
                  textShadow: isHighlight
                    ? `0 0 35px ${scene.accentColor}99, 0 0 70px ${scene.accentColor}44`
                    : 'none',
                }}
              >
                {w}
              </span>
            );
          })}
        </h1>

        {scene.subhead && (
          <p
            style={{
              margin: '22px auto 0 auto',
              fontSize: 34,
              fontWeight: 500,
              lineHeight: 1.35,
              color: 'rgba(255, 255, 255, 0.72)',
              letterSpacing: '-0.01em',
              maxWidth: 820,
            }}
          >
            {scene.subhead}
          </p>
        )}
      </div>

      {/* Center Benchmark Comparison Card */}
      <div
        style={{
          position: 'relative',
          width: 900,
          marginTop: 50,
          borderRadius: 28,
          background: 'rgba(12, 15, 24, 0.88)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: `0 30px 70px rgba(0, 0, 0, 0.65), 0 0 40px ${scene.accentColor}20`,
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          padding: '40px 48px',
          boxSizing: 'border-box',
          opacity: cardOpacity,
          transform: `translateY(${cardY}px) scale(${cardScale})`,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 32,
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: 20,
          }}
        >
          <span style={{ fontSize: 24, fontWeight: 700, color: 'rgba(255, 255, 255, 0.9)' }}>
            MMLU-Pro & ARC-AGI Hard Reasoning
          </span>
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: 8,
              background: `${scene.accentColor}25`,
              color: scene.accentColor,
            }}
          >
            VERIFIED SCORE
          </span>
        </div>

        {/* Comparison Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          {items.map((item, idx) => {
            const barSpring = spring({
              frame: frame - 15 - idx * 6,
              fps,
              config: { damping: 18, mass: 1.0, stiffness: 90 },
            });
            const progress = interpolate(barSpring, [0, 1], [0, item.score]);

            return (
              <div key={idx}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 22,
                    fontWeight: item.isHighlight ? 800 : 500,
                    color: item.isHighlight ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)',
                    marginBottom: 8,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {item.isHighlight && <span style={{ color: scene.accentColor }}>★</span>}
                    {item.label}
                  </span>
                  <span
                    style={{
                      fontWeight: 800,
                      color: item.isHighlight ? scene.accentColor : 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    {item.displayValue}
                  </span>
                </div>

                {/* Progress Bar Track */}
                <div
                  style={{
                    width: '100%',
                    height: 18,
                    background: 'rgba(255, 255, 255, 0.06)',
                    borderRadius: 999,
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${progress}%`,
                      background: item.isHighlight
                        ? `linear-gradient(90deg, ${scene.accentColor}88 0%, ${scene.accentColor} 100%)`
                        : '#475569',
                      borderRadius: 999,
                      boxShadow: item.isHighlight ? `0 0 20px ${scene.accentColor}` : 'none',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Metrics */}
        <div
          style={{
            marginTop: 36,
            paddingTop: 24,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: scene.accentColor }}>10x</div>
            <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>Execution Velocity</div>
          </div>
          <div style={{ width: 1, height: 48, background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#38bdf8' }}>-80%</div>
            <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>Inference Latency</div>
          </div>
        </div>
      </div>

      {/* Spoken Subtitles at bottom */}
      <KineticCaptions subtitles={scene.subtitles} accentColor={scene.accentColor} />
    </div>
  );
};
