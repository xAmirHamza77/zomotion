/**
 * Design tokens for the Zomotion explainer.
 *
 * Aesthetic direction: **light editorial** — a bright, near-white page with
 * warm orange as the single accent. Every scene and primitive pulls from this
 * file, so the whole film re-skins from one place (Principle 2: the visual
 * language must grow from a written design spec, not scattered literals).
 *
 * Contrast notes (WCAG, against `bg` #F4F3F1):
 *  - `text` #0A0A0A          ~17.9:1  body + headlines
 *  - `textSecondary` #525252  ~7.1:1  supporting copy
 *  - `textMuted` #6B6B6B     ~4.8:1  labels, captions
 *  - `accent` #FF6B1A         ~2.6:1  DISPLAY ONLY — large numerals, rules,
 *                                          fills and glows. Never body text.
 *  - `accentInk` #C2410C     ~4.7:1  small accent-coloured text that must
 *                                          pass on the page.
 *
 * The page is a warm light grey rather than pure white so that the white card
 * surfaces (#FFFFFF) actually read as elevated. On #FAFAFA the page/card pair
 * differed by 1.4% and the whole layout went flat.
 */
export const tokens = {
  /** Page background. Warm light grey — sits below `surface` so cards lift. */
  bg: '#F4F3F1',
  /** Raised card surface. */
  surface: '#FFFFFF',
  /** Nested panel inside a surface (code blocks, inner tiles). */
  surfaceAlt: '#F7F6F4',
  /** Hairline borders. */
  border: '#E5E5E5',
  /** Emphasised border, for active or accent-rimmed elements. */
  borderStrong: '#D4D4D4',

  /** Primary type. */
  text: '#0A0A0A',
  /** Supporting copy. */
  textSecondary: '#525252',
  /** Labels and quiet metadata. */
  textMuted: '#6B6B6B',
  /** Type sitting on an orange fill. */
  onAccent: '#FFFFFF',

  /** The single brand accent. Display scale and fills only. */
  accent: '#FF6B1A',
  /** Darker orange for accent-coloured text small enough to need contrast. */
  accentInk: '#C2410C',
  /** Deeper orange for gradient tails. */
  accentDeep: '#E2550A',
  /** Tinted accent fills. */
  accentSoft: 'rgba(255, 107, 26, 0.10)',
  accentSoftStrong: 'rgba(255, 107, 26, 0.16)',
  /** 10-digit pastels for metric variety — orange family, all >=3:1 on white. */
  accentAlt: '#F97316',
  accentAlt2: '#EA580C',

  /** Soft neutral shadow; black at low alpha, never a heavy drop. */
  shadow: '0 24px 60px -12px rgba(0, 0, 0, 0.10)',
  shadowSm: '0 12px 30px -10px rgba(0, 0, 0, 0.10)',
  /**
   * Card lift. Three stacked layers rather than one big blur: a crisp contact
   * shadow that grounds the edge, a wide warm pass tinted by the card's own
   * accent so the colour appears to come from the card, and a deeper neutral
   * that fades out entirely. `accent` is the hex; `cardLift` fills it in.
   */
  cardLift: (accent: string) =>
    `0 1px 2px rgba(15, 23, 42, 0.05), 0 20px 40px -24px ${accent}59, 0 40px 80px -40px rgba(15, 23, 42, 0.22)`,
  /** Tinted icon tile behind a card glyph. */
  tileFill: (accent: string) => `linear-gradient(145deg, ${accent}22 0%, ${accent}0D 100%)`,
  /** Warm-tinted ambient glow, the light-theme counterpart to a dark scene wash. */
  glow: 'radial-gradient(circle, rgba(255, 107, 26, 0.16) 0%, transparent 70%)',

  /** Syntax colours for the code panels. */
  code: {
    fg: '#0A0A0A',
    keyword: '#C2410C',
    value: '#B45309',
    comment: '#A8A29E',
    rule: '#78716C',
  },
} as const;

export type Tokens = typeof tokens;
