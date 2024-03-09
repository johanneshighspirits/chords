import { FLAT, SHARP } from './helpers/chord';

export type Song = SongMeta & {
  parts: Part[];
};

export type SongMeta = {
  uid: string;
  slug: string;
  title: string;
};

export type Note = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
export type Sign = typeof SHARP | typeof FLAT | '';

export type Chord = {
  uid: string;
  original: string;
  display: string;
  note: Note;
  major: boolean;
  sign: Sign;
  bass?: Note;
  bassSign?: Sign;
  modifier?: number;
  timing: Timing;
};

export type MetaPart = {
  uid: string;
  color: Color;
  title: string;
  pattern?: string;
};

export type Part = MetaPart & {
  chordLines?: ChordLine[];
  chords: Chord[];
  timing: Timing;
};

export type Color = {
  h: number;
  s: number;
  l: number;
};

export type ChordLine = {
  pattern: string;
  chords: Chord[];
  repeatCount?: number;
  isDuplicate?: boolean;
};

export type Duration = {
  bar: number;
  beat: number;
};

export type Timing = {
  offset: number;
  position: Duration;
  duration: Duration;
};

export type WithMany<T, Many, Key extends string> = T & Record<Key, Many[]>;
