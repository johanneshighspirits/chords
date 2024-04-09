import { ChordDetails, ChordFlavor, Note, Sign } from '@/types';
import { FLAT } from './chord';

const Notes: { [key in Note]: number } = {
  A: 69,
  B: 71,
  C: 60,
  D: 62,
  E: 64,
  F: 65,
  G: 67,
};

const getSignMod = (sign?: Sign) => {
  if (!sign) {
    return 0;
  }
  return sign === FLAT ? -1 : 1;
};

const ChordNotes: { [key in ChordFlavor]: number[] } = {
  major: [4, 7],
  minor: [3, 7],
  dim: [3, 6],
  aug: [4, 8],
  sus: [5, 7],
};

const getChordNotes = (flavor: ChordFlavor) => {
  return ChordNotes[flavor];
};

export const getMidiNotes = (chord: ChordDetails): MidiNote[] => {
  const { note, sign, flavor, bass, bassSign, modifiers } = chord;
  const rootNote = Notes[note] + getSignMod(sign);
  const [midNote, lastNote] = getChordNotes(flavor);
  const notes = [
    createNote(rootNote),
    createNote(rootNote + midNote),
    createNote(rootNote + lastNote),
  ];
  if (bass) {
    const bassNote = Notes[bass] + getSignMod(bassSign) - 12;
    notes.unshift(createNote(bassNote));
  } else {
    notes.unshift(createNote(rootNote - 12));
  }
  if (modifiers) {
    for (const mod of modifiers) {
      notes.push(createNote(rootNote + mod));
    }
  }
  return notes;
};

export type MidiNote = {
  midi: number;
  freq: number;
};

const createNote = (midiNote: number): MidiNote => {
  return { midi: midiNote, freq: getFrequency(midiNote) };
};

const getFrequency = (midiNote: number) =>
  440 * Math.pow(2, (midiNote - 69) / 12);
