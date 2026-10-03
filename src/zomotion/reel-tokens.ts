/**
 * Design tokens for "Zomotion — Reel".
 *
 * The previous cut of this video was built as cards: rounded rectangles, one
 * border-radius everywhere, the same soft shadow under each, tracked-out
 * ALL-CAPS eyebrows over every heading. That is the generic SaaS layout and it
 * read as a template, not as a film about a video engine.
 *
 * The subject here is a *render engine*. Its own world is the frame: an
 * aperture, crop marks, a contact sheet, a scrubber, timecode, a frame counter.
 * So the layout language of this film is the frame gate, and the numbers on
 * screen are real — the timecode and the playhead are computed from the actual
 * render clock, not typed in as decoration.
 *
 * Colour is deliberately pushed off the warm-cream/terracotta default that
 * white-plus-orange usually lands in: a *cooler* near-white page (#F1F1EF) and a
 * punchier vermilion (#FF5A00) rather than a softened orange (#FF6B1A) that
 * sits next to Anthropic's clay accent. The dark act uses true void black so
 * the reveal can carry real emissive light.
 *
 * Contrast (WCAG, against `page` #F1F1EF, L = 0.879):
 *  - ink      #0A0A0A  17.5:1  headlines, body
 *  - ink2     #4C4C49   7.6:1  supporting copy
 *  - ink3     #6E6E6B   4.5:1  timecode, labels, metadata
 *  - flame    #FF5A00   2.8:1  DISPLAY ONLY — rules, fills, edges, glows.
 *                                 Never body text.
 *  - flameInk #C13A00   4.8:1  accent-coloured text small enough to need it.
 */
export const reel = {
  /** Cool near-white page. */
  page: '#F1F1EF',
  /** Raised surface. */
  surface: '#FFFFFF',
  /** Recessed panel inside a surface. */
  sunk: '#F6F6F4',
  /** Hairline. */
  rule: '#E2E2DF',
  /** Slightly heavier rule, for the gate. */
  ruleStrong: '#CFCDC8',

  ink: '#0A0A0A',
  ink2: '#4C4C49',
  ink3: '#6E6E6B',

  /** The single accent. Display scale and fills only. */
  flame: '#FF5A00',
  /** Darker vermilion for accent-coloured text that must pass on the page. */
  flameInk: '#C13A00',
  flameSoft: 'rgba(255, 90, 0, 0.10)',
  flameSoft2: 'rgba(255, 90, 0, 0.18)',

  /** The reveal act. True near-black, so emissive edges actually emit. */
  void: '#08080A',
  voidRaised: '#141417',
  voidInk: '#F5F5F3',
  voidInk2: '#9A9A97',

  /** Chrome ramp for the metallic wordmark in the dark act. */
  chrome: [
    '#FFFFFF',
    '#D8D8D6',
    '#8E8E8C',
    '#E4E4E2',
    '#A8A8A6',
    '#FFFFFF',
  ],

  /** Display face: a tight heavy grotesque. */
  display: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  /** Data face: timecode, frame numbers, commands. */
  mono: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
} as const;

/** Timecode from a frame index at a given fps: mm:ss:ff. */
export const timecode = (frame: number, fps: number): string => {
  const f = Math.max(0, Math.floor(frame));
  const ff = f % fps;
  const totalSeconds = Math.floor(f / fps);
  const ss = totalSeconds % 60;
  const mm = Math.floor(totalSeconds / 60);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(mm)}:${p(ss)}:${p(ff)}`;
};

/**
 * The gate: a 16:9 frame inset from the composition edge, with corner crop
 * marks and a tick strip along the top edge carrying the playhead. Inset is
 * generous enough that the ticks read as film perforations, not as a border.
 */
export const GATE_INSET = 56;
export const GATE_W = 1920 - GATE_INSET * 2;
export const GATE_H = 1080 - GATE_INSET * 2;

/**
 * The reel's total length, in frames. Act 5 renders inside a Sequence, where
 * `useVideoConfig().durationInFrames` reports the *sequence's* duration, so
 * anything that needs the real file length — the closing contact sheet's
 * timecode — has to read it from here rather than from the config hook.
 */
export const REEL_TOTAL_FRAMES = 1800;
