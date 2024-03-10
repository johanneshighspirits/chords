import { Chord, ChordDetails, ChordMeta, Note, Sign } from '@/types';
import { Timing } from './timing';
import { generateId } from './common';

const ChordRegex =
  /^(?<root>[A-H])(?<signMatch>\#|b)?(?<minor>m)?(?<modifier>[0-9]*)?(?<bassMatch>\/[A-H])?(?<bassSignMatch>\#|b?)?/i;

export const parseChord = (input: string): ChordDetails | null => {
  const original = input.trim();
  if (!original) {
    return null;
  }
  const groups = ChordRegex.exec(original)?.groups;
  if (!groups) {
    return null;
  }
  const { root, minor, signMatch, modifier, bassMatch, bassSignMatch } = groups;
  const modNumber = Number(modifier);
  const note: Note = root.toUpperCase().replace('H', 'B') as Note;
  const sign = getSign(signMatch);
  const bass: Note | undefined = bassMatch
    ? (bassMatch.replace('/', '').toUpperCase().replace('H', 'B') as Note)
    : undefined;
  const bassSign = getSign(bassSignMatch);
  const chord: ChordDetails = {
    note: note.toUpperCase() as Note,
    major: minor !== 'm',
    sign,
    modifier: isNaN(modNumber) ? undefined : modNumber,
    bass,
    bassSign,
  };
  return chord;
};

export const SHARP = '&#9839;';
export const FLAT = '&#9837;';

const getSign = (match?: string): Sign => {
  if (match === '#') return SHARP;
  if (match === 'b') return FLAT;
  return '';
};

export const formatChord = ({
  note,
  sign,
  major,
  bass,
  bassSign,
  modifier,
}: Chord) => {
  return [note, sign, major ? '' : 'm', modifier, bass, bassSign]
    .map(Boolean)
    .join('');
};
