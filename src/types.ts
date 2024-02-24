export type Song = {
  id: string;
  title: string;
  parts: Part[];
};

export type Note = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
export type Chord = {
  id: string;
  display: string;
  note: Note;
  major: boolean;
  sign: '#' | 'b';
  modifier: number;
};

export type Part = {
  id: string;
  color: Color;
  title: string;
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
