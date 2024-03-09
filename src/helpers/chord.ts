import { Chord, Note, Sign } from '@/types';
import { Timing } from './timing';
import { generateId } from './common';

const ChordRegex =
  /^(?<root>[A-H])(?<signMatch>\#|b)?(?<minor>m)?(?<modifier>[0-9]*)?(?<bassMatch>\/[A-H])?(?<bassSignMatch>\#|b?)?/i;

export const parseChord = (input: string): Chord | null => {
  const original = input.trim();
  if (!original) {
    return null;
  }
  const groups = ChordRegex.exec(original)?.groups;
  if (!groups) {
    return null;
  }
  const { root, minor, signMatch, modifier, bassMatch, bassSignMatch } = groups;
  const uid = generateId();
  const modNumber = Number(modifier);
  const note: Note = root.toUpperCase().replace('H', 'B') as Note;
  const sign = getSign(signMatch);
  const bass: Note | undefined = bassMatch
    ? (bassMatch.replace('/', '').toUpperCase().replace('H', 'B') as Note)
    : undefined;
  const bassSign = getSign(bassSignMatch);
  const chord: Chord = {
    uid,
    original,
    display: [note, signMatch, minor, modifier]
      .filter((s) => s !== undefined)
      .join(''),
    note: note.toUpperCase() as Note,
    major: minor !== 'm',
    sign,
    modifier: isNaN(modNumber) ? undefined : modNumber,
    bass,
    bassSign,
    timing: Timing.withBarLength(),
  };
  // console.log(chord);
  return chord;
};

export const SHARP = '&#9839;';
export const FLAT = '&#9837;';

const getSign = (match?: string): Sign => {
  if (match === '#') return SHARP;
  if (match === 'b') return FLAT;
  return '';
};
