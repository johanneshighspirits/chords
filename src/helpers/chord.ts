import { Chord, Note, Sign } from '@/types';
import { Timing } from './timing';

const ChordRegex =
  /^(?<root>[A-H])(?<signMatch>\#|b)?(?<minor>m)?(?<modifier>[0-9]*)?/i;

export const parseChord = (input: string): Chord | null => {
  const original = input.trim();
  if (!original) {
    return null;
  }
  const groups = ChordRegex.exec(original)?.groups;
  if (!groups) {
    return null;
  }
  const { root, minor, signMatch, modifier } = groups;
  const id = crypto.randomUUID().substring(0, 8);
  const modNumber = Number(modifier);
  const note: Note = root.toUpperCase().replace('H', 'B') as Note;
  const sign = getSign(signMatch);
  const chord = {
    id,
    original,
    display: [note, signMatch, minor, modifier]
      .filter((s) => s !== undefined)
      .join(''),
    note: note.toUpperCase() as Note,
    major: minor !== 'm',
    sign,
    modifier: isNaN(modNumber) ? undefined : modNumber,
    timing: Timing.withBarLength(),
  };
  console.log(chord);
  return chord;
};

export const SHARP = '&#9839;';
export const FLAT = '&#9837;';

const getSign = (match?: string): Sign => {
  if (match === '#') return SHARP;
  if (match === 'b') return FLAT;
  return '';
};
