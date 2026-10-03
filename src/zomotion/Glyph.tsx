import React from 'react';

export type GlyphName =
  | 'code'
  | 'camera'
  | 'type'
  | 'spark'
  | 'wave'
  | 'layers'
  | 'orbit'
  | 'grid';

/**
 * Glyph: Minimal 24x24 stroke marks used instead of emoji.
 *
 * Emoji render in full colour and read as cheap against the dark, restrained
 * palette of the zomotion scenes, and they vary per platform. These are plain
 * single-stroke SVG paths that inherit the accent colour of the card they sit
 * in, so they stay on-palette at any size.
 */
export const Glyph: React.FC<{ name: GlyphName; color?: string; size?: number }> = ({
  name,
  color = 'currentColor',
  size = 26,
}) => {
  const paths: Record<GlyphName, React.ReactNode> = {
    // Terminal prompt chevrons
    code: (
      <>
        <path d="M8.5 7.5 4 12l4.5 4.5" />
        <path d="M15.5 7.5 20 12l-4.5 4.5" />
        <path d="M13.4 5.6 10.6 18.4" />
      </>
    ),
    // PageCam: body, lens, viewfinder bump
    camera: (
      <>
        <path d="M3 8.5h3.6L8.4 6h7.2l1.8 2.5H21v11H3z" />
        <circle cx="12" cy="14" r="3.4" />
      </>
    ),
    // Kinetic type: T with baseline rule
    type: (
      <>
        <path d="M4.5 6.5h15" />
        <path d="M12 6.5v11" />
        <path d="M8.6 17.5h6.8" />
      </>
    ),
    // Single specular sparkle
    spark: (
      <path d="M12 3.5 13.9 10 20.5 12 13.9 14 12 20.5 10.1 14 3.5 12 10.1 10z" />
    ),
    // Waveform: five vertical bars
    wave: (
      <>
        <path d="M4 10.5v3" />
        <path d="M8 7.5v9" />
        <path d="M12 4.5v15" />
        <path d="M16 7.5v9" />
        <path d="M20 10.5v3" />
      </>
    ),
    // Stacked shot cards
    layers: (
      <>
        <path d="M12 3 21 7.6l-9 4.6-9-4.6z" />
        <path d="M4.4 12.3 12 16.2l7.6-3.9" />
        <path d="M4.4 16.6 12 20.5l7.6-3.9" />
      </>
    ),
    // Closed-form physics: body on an orbital path
    orbit: (
      <>
        <circle cx="12" cy="12" r="3.2" />
        <ellipse cx="12" cy="12" rx="9.2" ry="4.4" transform="rotate(-28 12 12)" />
      </>
    ),
    // Card grid
    grid: (
      <>
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0 }}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
};
