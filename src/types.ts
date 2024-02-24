export type Song = {
  id: string;
  title: string;
  parts: Part[];
};

export type Chord = {
  id: string;
  display: string;
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
