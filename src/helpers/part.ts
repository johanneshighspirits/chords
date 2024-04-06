import { Chord, ChordLine, Part as PartType } from '@/types';
import {
  getBarEnd,
  getDurationBetweenPositions,
  getNumberOfBeats,
  positionAsString,
} from './timing';
import { getRandomColor } from './color';
import { generateId } from './common';
import { formatChord } from './chord';
import { Break, BreakType } from './break';

export const Part = {
  new: (chords = [] as Chord[], index = 0): PartType => {
    const uid = generateId();
    const color = getRandomColor();
    const pattern = getChordPattern(chords);
    return {
      uid,
      color,
      title: 'New Part',
      chords,
      index,
      pattern,
      barOffset: 0,
    };
  },
};
export const getChordPattern = (chords: (Chord | BreakType)[]) =>
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
  let currentChords: (Chord | BreakType)[] = [];
  let prevChord: Chord | undefined = undefined;
  for (const chord of chords) {
    if (chord.timing.position.bar < (lines.length + 1) * 4) {
      if (prevChord) {
        const breakDuration = getDurationBetweenPositions(
          getBarEnd(prevChord.timing),
          chord.timing.position
        );
        if (getNumberOfBeats(breakDuration)) {
          currentChords.push(
            Break.new(getBarEnd(prevChord.timing), breakDuration)
          );
        }
      }
      currentChords.push(chord);
      prevChord = chord;
    } else {
      lines.push({
        pattern: getChordPattern(currentChords),
        chords: currentChords,
      });
      currentChords = [chord];
      prevChord = undefined;
    }
  }
  if (currentChords.length) {
    lines.push({
      pattern: getChordPattern(currentChords),
      chords: currentChords,
    });
  }

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

  const lastLine = lines.at(-1);
  if (lastLine) {
    const lastChord = lastLine.chords.at(-1);
    if (lastChord) {
      const { bar, beat } = getBarEnd(lastChord.timing);
      if (bar % 4 === 0 && beat === 0) {
        lines.push({
          pattern: `empty_${lines.length}`,
          chords: [Break.blank({ bar, beat })],
        });
      }
    }
  }
  return lines;
};
