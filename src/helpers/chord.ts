import { ChordDetails, ChordFlavor, Note, Sign, isChord } from '@/types';
import { BreakType } from './break';

const ChordRegex =
  /^(?<root>[A-H])(?<signMatch>\#|b)?(?<flavorMatch>(?:m(?!aj7)|\+|dim))?(?<modifierMatch>(?:maj7|add[0-9]|[0-9])*)?(?<bassMatch>\/[A-H])?(?<bassSignMatch>\#|b?)?/i;

const Flavors: Record<string, ChordFlavor> = {
  m: 'minor',
  min: 'minor',
  minor: 'minor',
  dim: 'dim',
  '+': 'aug',
};

const Modifiers: Record<string, number[]> = {
  add9: [2],
  6: [9],
  7: [10],
  maj7: [11],
  9: [2],
  11: [10, 14, 17],
};

export const parseChord = (input: string): ChordDetails | null => {
  const original = input.trim();
  if (!original) {
    return null;
  }
  const groups = ChordRegex.exec(original)?.groups;
  if (!groups) {
    return null;
  }
  const {
    root,
    flavorMatch,
    signMatch,
    modifierMatch,
    bassMatch,
    bassSignMatch,
  } = groups;
  const flavor = Flavors[flavorMatch] ?? 'major';
  const modifiers = Modifiers[modifierMatch];
  const note: Note = root.toUpperCase().replace('H', 'B') as Note;
  const sign = getSign(signMatch);
  const bass: Note | undefined = bassMatch
    ? (bassMatch.replace('/', '').toUpperCase().replace('H', 'B') as Note)
    : undefined;
  const bassSign = getSign(bassSignMatch);
  const chord: ChordDetails = {
    type: 'chord',
    note: note.toUpperCase() as Note,
    flavor,
    sign,
    modifiers,
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

const signToString = (sign?: Sign) =>
  sign === SHARP ? '#' : sign === FLAT ? 'b' : '';

export const flavorToString = (flavor: ChordFlavor) => {
  if (flavor === 'major') return '';
  if (flavor === 'minor') return 'm';
  if (flavor === 'aug') return '+';
  return flavor;
};

export const modifiersToString = (modifiers?: number[]) => {
  return modifiers
    ? Object.entries(Modifiers).find(([key, value]) => {
        return modifiers.join(',') === value.join(',');
      })?.[0]
    : undefined;
};

export const formatChord = (input: ChordDetails | BreakType) => {
  if (isChord(input)) {
    const { note, sign, flavor, bass, bassSign, modifiers } = input;
    const mod = modifiersToString(modifiers);
    return [
      note,
      signToString(sign),
      flavorToString(flavor),
      mod,
      bass ? '/' : '',
      bass,
      signToString(bassSign),
    ]
      .filter(Boolean)
      .join('');
  }
  return JSON.stringify(input);
};
