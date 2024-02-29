import { Chord, Note } from '@/types';

const ChordRegex =
  /^(?<note>[A-G])(?<sign>\#|b)?(?<minor>m)?(?<modifier>[0-9]*)?/i;

export const parseChord = (input: string): Chord | null => {
  const original = input.trim();
  if (!original) {
    return null;
  }
  const groups = ChordRegex.exec(original)?.groups;
  if (!groups) {
    return null;
  }
  const { note, minor, sign, modifier } = groups;
  const id = crypto.randomUUID().substring(0, 8);
  const modNumber = Number(modifier);
  const chord = {
    id,
    original,
    display: [note, sign, minor, modifier]
      .filter((s) => s !== undefined)
      .join(''),
    note: note.toUpperCase() as Note,
    major: minor !== 'm',
    sign: sign as '#' | 'b',
    modifier: isNaN(modNumber) ? undefined : modNumber,
    bar: 1.0,
  };

  return chord;
};
