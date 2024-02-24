import { Chord, ChordLine } from '@/types';

export const getChordPattern = (chords: Chord[]) =>
  chords.map((chord) => chord.display).join('_');

export const getChordLines = (chords: Chord[], lineLength = 4): ChordLine[] => {
  const lines: ChordLine[] = [];
  for (let i = 0; i < chords.length; i += lineLength) {
    const lineChords = chords.slice(i, i + lineLength);
    lines.push({
      pattern: getChordPattern(lineChords),
      chords: lineChords,
    });
  }
  return lines;
};
