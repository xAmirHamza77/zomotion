import React from 'react';
import { Glyph, GlyphName } from './Glyph';
import { tokens } from './tokens';

/**
 * SpecCard — the single card language for the explainer.
 *
 * The first cut of these scenes used a bare white rectangle with a 1px border
 * and a naked glyph floating in the top-left corner. Three things were wrong
 * with it: a #FAFAFA page and a #FFFFFF card differ by 1.4% so nothing read
 * as elevated; a 34px glyph has no anchor and the smallest element on the card
 * was carrying the most visual weight; and four structurally identical boxes
 * gave the eye no hierarchy to follow.
 *
 * The language here fixes all three:
 *  1. A tinted icon tile anchors the mark and puts the accent where the eye
 *     lands first.
 *  2. A top rule fades accent -> transparent, giving each card an identity
 *     without turning the row into a rainbow.
 *  3. An oversized index numeral sits behind the content as a watermark. It
 *     supplies the visual mass the card was missing and makes each card
 *     individually addressable.
 *  4. `cardLift` stacks a contact shadow, an accent-tinted pass and a deep
 *     neutral fade, so white cards separate from a near-white page.
 */

interface SpecCardProps {
  /** 1-based position in the row. Rendered as a zero-padded watermark. */
  index: number;
  icon: GlyphName;
  /** Card's own step in the orange ramp. Drives bar, tile, shadow and dot. */
  accent: string;
  title: string;
  desc: string;
  /** Footer metadata, e.g. "Recipe #1". */
  label?: string;
  /**
   * Short mono chips naming the actual API surface. These exist to give the
   * lower half of a tall card something to hold — a card padded to 420px with
   * only a title and a sentence reads as an accident, not a layout.
   */
  chips?: string[];
  /** Optional body content, e.g. a `CodePlate`. */
  children?: React.ReactNode;
  /** Override the height floor. The row uses this to fill the frame. */
  minHeight?: number;
  style?: React.CSSProperties;
}

export const SpecCard: React.FC<SpecCardProps> = ({
  index,
  icon,
  accent,
  title,
  desc,
  label,
  chips,
  children,
  minHeight,
  style,
}) => (
  <div
    style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      minHeight,
      padding: '34px 30px 26px',
      backgroundColor: tokens.surface,
      border: `1px solid ${tokens.border}`,
      borderRadius: 20,
      boxShadow: tokens.cardLift(accent),
      overflow: 'hidden',
      ...style,
    }}
  >
    {/* Accent rule: solid at the leading edge, fading out. */}
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: `linear-gradient(90deg, ${accent} 0%, ${accent}00 100%)`,
      }}
    />

    {/* Index watermark. Sits behind everything at low alpha. */}
    <div
      style={{
        position: 'absolute',
        top: 14,
        right: 20,
        fontSize: 96,
        fontWeight: 800,
        letterSpacing: '-0.05em',
        lineHeight: 1,
        color: accent,
        opacity: 0.12,
        fontVariantNumeric: 'tabular-nums',
        userSelect: 'none',
      }}
    >
      {String(index).padStart(2, '0')}
    </div>

    {/* Tinted icon tile. */}
    <div
      style={{
        position: 'relative',
        width: 54,
        height: 54,
        borderRadius: 15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: tokens.tileFill(accent),
        border: `1px solid ${accent}33`,
        marginBottom: 22,
      }}
    >
      <Glyph name={icon} color={accent} size={27} />
    </div>

    <div
      style={{
        position: 'relative',
        fontSize: 25,
        fontWeight: 800,
        color: tokens.text,
        letterSpacing: '-0.025em',
        lineHeight: 1.2,
        marginBottom: 10,
      }}
    >
      {title}
    </div>

    <div
      style={{
        position: 'relative',
        fontSize: 15.5,
        color: tokens.textSecondary,
        lineHeight: 1.62,
      }}
    >
      {desc}
    </div>

    {chips && chips.length > 0 && (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginTop: 20,
        }}
      >
        {chips.map((chip) => (
          <span
            key={chip}
            style={{
              padding: '6px 11px',
              borderRadius: 8,
              backgroundColor: tokens.surfaceAlt,
              border: `1px solid ${tokens.border}`,
              fontFamily: 'monospace',
              fontSize: 12.5,
              color: tokens.textSecondary,
              whiteSpace: 'nowrap',
            }}
          >
            {chip}
          </span>
        ))}
      </div>
    )}

    {children && <div style={{ position: 'relative', marginTop: 22 }}>{children}</div>}

    {/* Footer pins to the bottom so short and long cards share one baseline. */}
    {label && (
      <div
        style={{
          position: 'relative',
          marginTop: 'auto',
          paddingTop: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: tokens.border,
          }}
        />
        <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: accent }} />
        <span
          style={{
            fontSize: 11.5,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: tokens.textMuted,
          }}
        >
          {label}
        </span>
      </div>
    )}
  </div>
);

/**
 * SpecTile — the compact horizontal form, for a feature that sits inside a
 * larger surface (the hero card's two pillars). Same language as SpecCard at a
 * smaller scale: tinted icon tile, accent-tinted lift, quiet footer label.
 */
export const SpecTile: React.FC<{
  icon: GlyphName;
  accent: string;
  title: string;
  desc: string;
  label?: string;
}> = ({ icon, accent, title, desc, label }) => (
  <div
    style={{
      position: 'relative',
      display: 'flex',
      gap: 18,
      padding: '24px 26px',
      // Nested inside a white hero card, so it is tinted one step down rather
      // than white-on-white — a second white surface with a shadow under it
      // reads as pressed, not raised.
      backgroundColor: tokens.surfaceAlt,
      border: `1px solid ${accent}2E`,
      borderRadius: 16,
      boxShadow: '0 8px 20px -14px rgba(15, 23, 42, 0.20)',
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: 3,
        background: `linear-gradient(180deg, ${accent} 0%, ${accent}00 100%)`,
      }}
    />
    <div
      style={{
        flexShrink: 0,
        width: 44,
        height: 44,
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: tokens.tileFill(accent),
        border: `1px solid ${accent}33`,
      }}
    >
      <Glyph name={icon} color={accent} size={22} />
    </div>
    <div style={{ minWidth: 0 }}>
      <div
        style={{
          fontSize: 19,
          fontWeight: 700,
          color: tokens.text,
          letterSpacing: '-0.02em',
          marginBottom: 5,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 15, color: tokens.textSecondary, lineHeight: 1.55 }}>{desc}</div>
      {label && (
        <div
          style={{
            marginTop: 12,
            fontSize: 11.5,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: tokens.textMuted,
          }}
        >
          {label}
        </div>
      )}
    </div>
  </div>
);

/**
 * CodePlate — a code block styled as a labelled specimen panel rather than a
 * bare grey rectangle. `lines` are raw strings; `colors` optionally overrides
 * the colour of the line at that index.
 */
export const CodePlate: React.FC<{
  label: string;
  lines: string[];
  colors?: (string | undefined)[];
  accent: string;
}> = ({ label, lines, colors, accent }) => (
  <div
    style={{
      backgroundColor: tokens.surfaceAlt,
      border: `1px solid ${tokens.border}`,
      borderRadius: 14,
      overflow: 'hidden',
      fontFamily: 'monospace',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 18px',
        borderBottom: `1px solid ${tokens.border}`,
      }}
    >
      <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: accent }} />
      <span
        style={{
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: tokens.textMuted,
          fontFamily: 'inherit',
        }}
      >
        {label}
      </span>
    </div>
    <div style={{ padding: '18px 20px', fontSize: 14.5, lineHeight: 1.85 }}>
      {lines.map((line, i) => (
        <div key={i} style={{ color: colors?.[i] ?? tokens.code.fg, whiteSpace: 'pre' }}>
          {line}
        </div>
      ))}
    </div>
  </div>
);
