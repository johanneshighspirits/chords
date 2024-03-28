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
        note: 'D',
        major: false,
        modifier: 7,
        sign: '',
        bass: undefined,
        bassSign: '',
      },
    ],
    [
      'd',
      {
        note: 'D',
        major: true,
        sign: '',
        bass: undefined,
        bassSign: '',
      },
    ],
    [
      'dbm9',
      {
        note: 'D',
        major: false,
        sign: '&#9837;',
        modifier: 9,
        bass: undefined,
        bassSign: '',
      },
    ],
    [
      'G/H',
      {
        note: 'G',
        major: true,
        modifier: undefined,
        sign: '',
        bass: 'B',
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
        note: 'D',
        major: false,
        modifier: 7,
        sign: '',
        bass: undefined,
        bassSign: '',
      },
      'Dm7',
    ],
    [
      {
        note: 'D',
        major: true,
        sign: '',
        bass: undefined,
        bassSign: '',
      },
      'D',
    ],
    [
      {
        note: 'G',
        major: true,
        modifier: undefined,
        sign: '',
        bass: 'B',
        bassSign: '',
      },
      'G/B',
    ],
  ];

  for (const testCase of displayTestCases) {
    displayTest(...testCase);
  }
});
