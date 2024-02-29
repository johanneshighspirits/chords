export type Song = SongMeta & {
  parts: Part[];
};

export type SongMeta = {
  id: string;
  slug: string;
  title: string;
};

export type Note = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
export type Chord = {
  id: string;
  original: string;
  display: string;
  note: Note;
  major: boolean;
  sign?: '#' | 'b';
  modifier?: number;
  bar: number;
};

export type Part = {
  id: string;
  color: Color;
  title: string;
  pattern?: string;
  chordLines?: ChordLine[];
  chords: Chord[];
};

export type Color = {
  h: number;
  s: number;
  l: number;
};

export type ChordLine = {
  pattern: string;
  chords: Chord[];
};
