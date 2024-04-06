import { Chord, ChordDetails } from '@/types';
import { describe, expect, it } from 'vitest';
import { formatChord, parseChord } from './chord';

describe('chord', () => {
  const parseTest = (input: string, expected: ChordDetails) => {
    it(`should parse "${input}" correctly`, () => {
      expect(parseChord(input)).toEqual(expected);
    });
  };

  const displayTest = (chord: ChordDetails, expected: string) => {
    it(`should pretty print ${JSON.stringify(chord)}`, () => {
      expect(formatChord(chord)).toEqual(expected);
    });
  };

  const parseTestCases: [string, ChordDetails][] = [
    [
      'Dm7',
      {
        type: 'chord',
        note: 'D',
        flavor: 'minor',
        modifiers: [10],
        sign: '',
        bass: undefined,
        bassSign: '',
      },
    ],
    [
      'd',
      {
        type: 'chord',
        note: 'D',
        flavor: 'major',
        sign: '',
        bass: undefined,
        bassSign: '',
      },
    ],
    [
      'dbm9',
      {
        type: 'chord',
        note: 'D',
        flavor: 'minor',
        sign: '&#9837;',
        modifiers: [2],
        bass: undefined,
        bassSign: '',
      },
    ],
    [
      'G/H',
      {
        type: 'chord',
        note: 'G',
        flavor: 'major',
        modifiers: undefined,
        sign: '',
        bass: 'B',
        bassSign: '',
      },
    ],
    [
      'Dmaj7',
      {
        type: 'chord',
        note: 'D',
        flavor: 'major',
        modifiers: [11],
        sign: '',
        bass: undefined,
        bassSign: '',
      },
    ],
    [
      'Gadd9',
      {
        type: 'chord',
        note: 'G',
        flavor: 'major',
        modifiers: [2],
        sign: '',
        bass: undefined,
        bassSign: '',
      },
    ],
    [
      'G11',
      {
        type: 'chord',
        note: 'G',
        flavor: 'major',
        modifiers: [10, 14, 17],
        sign: '',
        bass: undefined,
        bassSign: '',
      },
    ],
    [
      'C+',
      {
        type: 'chord',
        note: 'C',
        flavor: 'aug',
        modifiers: undefined,
        sign: '',
        bass: undefined,
        bassSign: '',
      },
    ],
    [
      'Cdim',
      {
        type: 'chord',
        note: 'C',
        flavor: 'dim',
        modifiers: undefined,
        sign: '',
        bass: undefined,
        bassSign: '',
      },
    ],
  ];

  for (const testCase of parseTestCases) {
    parseTest(...testCase);
  }

  const displayTestCases: [ChordDetails, string][] = [
    [
      {
        type: 'chord',
        note: 'D',
        flavor: 'minor',
        modifiers: [10],
        sign: '',
        bass: undefined,
        bassSign: '',
      },
      'Dm7',
    ],
    [
      {
        type: 'chord',
        note: 'D',
        flavor: 'major',
        sign: '',
        bass: undefined,
        bassSign: '',
      },
      'D',
    ],
    [
      {
        type: 'chord',
        note: 'G',
        flavor: 'major',
        modifiers: undefined,
        sign: '',
        bass: 'B',
        bassSign: '',
      },
      'G/B',
    ],
    [
      {
        type: 'chord',
        note: 'C',
        flavor: 'aug',
        modifiers: undefined,
        sign: '',
        bass: undefined,
        bassSign: '',
      },
      'C+',
    ],
    [
      {
        type: 'chord',
        note: 'C',
        flavor: 'dim',
        modifiers: undefined,
        sign: '',
        bass: undefined,
        bassSign: '',
      },
      'Cdim',
    ],
  ];

  for (const testCase of displayTestCases) {
    displayTest(...testCase);
  }
});
