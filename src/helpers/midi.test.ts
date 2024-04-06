import { describe, expect, it } from 'vitest';
import { parseChord } from './chord';
import { getMidiNotes } from './midi';

describe('midi.getMidiNotes', () => {
  it('should return an array of midi notes', () => {
    const testGetMidiNotes = (input: string, expected: number[]) => {
      const chord = parseChord(input)!;
      const notes = getMidiNotes(chord);
      for (const [i, expectation] of expected.entries()) {
        expect(notes[i].midi).toBe(expectation);
      }
    };

    const assertions: [string, number[]][] = [
      ['C', [48, 60, 64, 67]],
      ['F', [53, 65, 69, 72]],
      ['Cm', [48, 60, 63, 67]],
      ['Cm7', [48, 60, 63, 67, 70]],
    ];

    for (const assertion of assertions) {
      testGetMidiNotes(...assertion);
    }
  });
});
