import { Chord, ChordLine, Part as PartType } from '@/types';
import { Timing, positionAsString } from './timing';
import { getRandomColor, deserializeColor } from './color';
import { generateId } from './common';
import { formatChord } from './chord';

export const Part = {
  new: (chords = [] as Chord[]): PartType => {
    const uid = generateId();
    const color = getRandomColor();
    const pattern = getChordPattern(chords);
    return {
      uid,
      color,
      title: 'New Part',
      chords,
      timing: Timing.init(),
      pattern,
    };
  },
};
export const getChordPattern = (chords: Chord[]) =>
  chords
    .map(
      (chord) =>
        `${formatChord(chord)}_${positionAsString(chord.timing.duration)}`
    )
    .join('|');

export const getChordLines = (chords: Chord[]): ChordLine[] => {
  /**
   * Split chords by lines (4 bars on each line)
   */
  const lines: ChordLine[] = [];
  let currentChords: Chord[] = [];
  for (const chord of chords) {
    if (chord.timing.position.bar < (lines.length + 1) * 4) {
      currentChords.push(chord);
    } else {
      lines.push({
        pattern: getChordPattern(currentChords),
        chords: currentChords,
      });
      currentChords = [chord];
    }
  }
  if (currentChords.length) {
    lines.push({
      pattern: getChordPattern(currentChords),
      chords: currentChords,
    });
  }

  // let currentNumberOfBeats = 0;
  // let currentChords: Chord[] = [];
  // for (const chord of chords) {
  //   currentNumberOfBeats +=
  //     4 * chord.timing.duration.bar + chord.timing.duration.beat;
  //   if (currentNumberOfBeats <= barsPerLine * 4) {
  //     currentChords.push(chord);
  //   } else {
  //     lines.push({
  //       pattern: getChordPattern(currentChords),
  //       chords: currentChords,
  //     });
  //     currentNumberOfBeats =
  //       4 * chord.timing.duration.bar + chord.timing.duration.beat;
  //     currentChords = [chord];
  //   }
  // }
  // lines.push({
  //   pattern: getChordPattern(currentChords),
  //   chords: currentChords,
  // });

  /**
   * Find duplicate lines and group them
   */
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
