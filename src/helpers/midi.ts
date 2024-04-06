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
  const { note, sign, major, bass, bassSign, modifier } = chord;
  const rootNote = Notes[note] + getSignMod(sign);
  const midNote = rootNote + (major ? 4 : 3);
  const lastNote = rootNote + 7;
  const notes = [
    createNote(rootNote),
    createNote(midNote),
    createNote(lastNote),
  ];
  if (bass) {
    const bassNote = Notes[bass] + getSignMod(bassSign) - 12;
    notes.push(createNote(bassNote));
  }
  if (modifier) {
    const Mod = rootNote + Modifiers[modifier];
    if (Mod) {
      notes.push(createNote(Mod));
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