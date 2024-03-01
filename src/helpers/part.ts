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

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.isDuplicate) {
      index += 1;
      continue;
    }
    const { pattern } = line;
    let repeatCount = 0;
    let foundMismatch = false;
    while (!foundMismatch) {
      const nextLine = lines[index + 1 + repeatCount];
      if (nextLine?.pattern === pattern) {
        repeatCount += 1;
        nextLine.isDuplicate = true;
      } else {
        foundMismatch = true;
      }
    }
    if (repeatCount > 0) {
      line.repeatCount = repeatCount + 1;
    }
  }

  return lines;
};
