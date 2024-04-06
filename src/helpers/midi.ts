import { ChordDetails, Note, Sign } from '@/types';

const Notes: { [key in Note]: number } = {
  A: 69,
  B: 71,
  C: 60,
  D: 62,
  E: 64,
  F: 65,
  G: 67,
};

const Modifiers: Record<number, number> = {
  11: 11,
  7: 10,
  9: 2,
};

const getSignMod = (sign?: Sign) => {
  if (!sign) {
    return 0;
  }
  return sign === '&#9837;' ? -1 : 1;
};

export const getMidiNotes = (chord: ChordDetails): MidiNote[] => {
  const { note, sign, flavor, bass, bassSign, modifiers } = chord;
  const rootNote = Notes[note] + getSignMod(sign);
  const midNote = rootNote + (flavor === 'major' || flavor === 'aug' ? 4 : 3);
  const lastNote = rootNote + (flavor === 'dim' ? 6 : flavor === 'aug' ? 8 : 7);
  const notes = [
    createNote(rootNote),
    createNote(midNote),
    createNote(lastNote),
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
