import { BreakType } from './helpers/break';
import { FLAT, SHARP } from './helpers/chord';

export type Song = SongMeta & {
  parts: Part[];
};

export type SongMeta = {
  uid: string;
  slug: string;
  title: string;
  artist: string;
  artistSlug: string;
};

export type Note = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
export type Sign = typeof SHARP | typeof FLAT | '';

export type ChordMeta = {
  uid: string;
  timing: Timing;
};

export type ChordFlavor = 'major' | 'minor' | 'dim' | 'aug' | 'sus';

export type ChordDetails = {
  type: 'chord';
  note: Note;
  flavor: ChordFlavor;
  sign: Sign;
  bass?: Note;
  bassSign?: Sign;
  modifiers?: number[];
};

export type Chord = ChordMeta & ChordDetails;

export const isChord = (
  input: Chord | ChordMeta | ChordDetails | BreakType
): input is Chord => {
  return typeof input === 'object' && 'type' in input && input.type === 'chord';
};

export type PartMeta = {
  uid: string;
  color: Color;
  title: string;
  pattern?: string;
};

export type Part = PartMeta & {
  chordLines?: ChordLine[];
  chords: Chord[];
  index: number;
  barOffset: number;
};

export type Color = {
  // 0-360
  h: number;
  // 0-100
  s: number;
  // 0-100
  l: number;
  // 0-1
  a: number;
};

export type ChordLine = {
  pattern: string;
  chords: (Chord | BreakType)[];
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
