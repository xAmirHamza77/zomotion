import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { SceneData } from './types';
import { KineticCaptions } from './KineticCaptions';

interface SceneSpecsTerminalProps {
  scene: SceneData;
}

export const SceneSpecsTerminal: React.FC<SceneSpecsTerminalProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for card
  const entrance = spring({
    frame,
    fps,
    config: { damping: 15, mass: 0.9, stiffness: 120 },
  });

  const cardScale = interpolate(entrance, [0, 1], [0.86, 1]);
  const cardY = interpolate(entrance, [0, 1], [50, 0]);
  const cardOpacity = interpolate(entrance, [0, 0.7], [0, 1]);

  // Specular glint sweep across terminal card
  const glint = interpolate(frame, [20, 55], [-180, 250], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Animated token counter from 0 to 10,000,000
  const countProgress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 20, mass: 1.2, stiffness: 80 },
  });
  const currentTokens = Math.floor(interpolate(countProgress, [0, 1], [0, 10000000]));
  const formattedTokens = currentTokens.toLocaleString('en-US');

  // Typing code lines
  const codeLines = [
    'import { Gemini4Pro } from "@google/genai";',
    'const agent = new Gemini4Pro({',
    '  model: "gemini-4-pro-reasoning",',
    '  contextWindow: 10_000_000,',
    '  autonomousDeploy: true,',
    '});',
    'await agent.orchestrateEntireProject();',
  ];

  const totalChars = codeLines.join('\n').length;
  const typedCount = Math.floor(interpolate(frame, [15, 110], [0, totalChars], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }));

  let accumulated = 0;
  const renderedCode = codeLines.map((line) => {
    const lineLen = line.length + 1; // plus newline
    const remaining = typedCount - accumulated;
    accumulated += lineLen;

    if (remaining <= 0) return '';
    return line.slice(0, remaining);
  });

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
          {scene.tag || '✦ ARCHITECTURE • REASONING SCALE'}
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

      {/* Floating Glassmorphic Terminal Card */}
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
          overflow: 'hidden',
          opacity: cardOpacity,
          transform: `translateY(${cardY}px) scale(${cardScale})`,
        }}
      >
        {/* Specular Glint Sheen (Strictly masked inside card) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '45%',
            left: `${glint}%`,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)',
            transform: 'skewX(-24deg)',
            pointerEvents: 'none',
          }}
        />

        {/* Terminal Header Bar */}
        <div
          style={{
            height: 64,
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            background: 'rgba(255, 255, 255, 0.03)',
          }}
        >
          {/* macOS traffic light dots */}
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#ff5f56' }} />
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#ffbd2e' }} />
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#27c93f' }} />
          </div>

          <span
            style={{
              fontSize: 20,
              fontFamily: 'monospace',
              color: 'rgba(255, 255, 255, 0.65)',
              letterSpacing: '0.04em',
            }}
          >
            gemini-4-pro-agent.ts
          </span>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 999,
              background: `${scene.accentColor}20`,
              border: `1px solid ${scene.accentColor}40`,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: scene.accentColor,
                boxShadow: `0 0 8px ${scene.accentColor}`,
              }}
            />
            <span style={{ fontSize: 16, fontWeight: 700, color: scene.accentColor }}>
              ACTIVE
            </span>
          </div>
        </div>

        {/* Code Content */}
        <div
          style={{
            padding: '36px 36px',
            fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, monospace",
            fontSize: 24,
            lineHeight: 1.7,
            color: '#e2e8f0',
            minHeight: 280,
          }}
        >
          {renderedCode.map((code, idx) => {
            if (!code) return null;
            return (
              <div key={idx} style={{ display: 'flex' }}>
                <span
                  style={{
                    width: 40,
                    color: 'rgba(255, 255, 255, 0.25)',
                    userSelect: 'none',
                  }}
                >
                  {idx + 1}
                </span>
                <span>
                  {code.includes('import') || code.includes('const') || code.includes('await') || code.includes('new') ? (
                    <span style={{ color: scene.accentColor }}>{code.split(' ')[0]} </span>
                  ) : null}
                  <span>
                    {code.includes('import') || code.includes('const') || code.includes('await') || code.includes('new')
                      ? code.substring(code.indexOf(' ') + 1)
                      : code}
                  </span>
                </span>
              </div>
            );
          })}
        </div>

        {/* Live Token Counter Footer Ribbon */}
        <div
          style={{
            padding: '24px 36px',
            background: 'rgba(255, 255, 255, 0.04)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Active Context Capacity
            </div>
            <div style={{ fontSize: 44, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', marginTop: 4 }}>
              {formattedTokens}{' '}
              <span style={{ fontSize: 24, fontWeight: 700, color: scene.accentColor }}>TOKENS</span>
            </div>
          </div>

          <div
            style={{
              padding: '12px 20px',
              borderRadius: 14,
              background: `${scene.accentColor}25`,
              border: `1px solid ${scene.accentColor}60`,
              color: '#FFFFFF',
              fontSize: 20,
              fontWeight: 800,
            }}
          >
            100x vs GPT-4
          </div>
        </div>
      </div>

      {/* Spoken Subtitles at bottom */}
      <KineticCaptions subtitles={scene.subtitles} accentColor={scene.accentColor} />
    </div>
  );
};
