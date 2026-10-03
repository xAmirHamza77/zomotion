export interface WordTiming {
  word: string;
  startFrame: number;
  endFrame: number;
}

export interface ComparisonItem {
  label: string;
  score: number;
  maxScore?: number;
  displayValue: string;
  isHighlight?: boolean;
  color?: string;
}

export interface SceneData {
  id: number;
  durationInFrames: number;
  tag: string;
  headline: string;
  highlightWord: string;
  subhead: string;
  accentColor: string;
  sceneType: 'core' | 'specs' | 'benchmark' | 'cta';
  metricValue?: string;
  metricLabel?: string;
  comparisonItems?: ComparisonItem[];
  ctaButtonText?: string;
  ctaUrl?: string;
  subtitles: WordTiming[];
}

export interface VerticalVideoData {
  topic: string;
  brandPill: string;
  totalDurationFrames: number;
  scenes: SceneData[];
  voiceoverAudio?: string;
  bgmAudio?: string;
  bgmVolume?: number;
  voiceoverVolume?: number;
}
