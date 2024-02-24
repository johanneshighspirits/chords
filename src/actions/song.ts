'use server';

import { parseChord } from '@/helpers/chord';
import { Song } from '@/types';

const MockSong: Song = {
  id: 'mock-id',
  title: 'New song',
  parts: [
    {
      id: 'p-1',
      title: 'Part one',
      color: {
        h: 140,
        s: 30,
        l: 30,
      },

      chords: [
        parseChord('F#m')!,
        parseChord('A')!,
        parseChord('D7')!,
        parseChord('G')!,
        parseChord('Em9')!,
      ],
    },
    {
      id: 'p-1-2',
      title: 'Part two',
      color: {
        h: 200,
        s: 34,
        l: 30,
      },
      chords: [
        parseChord('C')!,
        parseChord('F')!,
        parseChord('G')!,
        parseChord('G')!,
        parseChord('Am')!,
        parseChord('F')!,
        parseChord('G')!,
        parseChord('E7')!,
        parseChord('Am')!,
        parseChord('F')!,
        parseChord('G')!,
        parseChord('E7')!,
        parseChord('C#')!,
      ],
    },
  ],
};
export const getSong = async (slug: string): Promise<Song> => {
  return {
    ...MockSong,
    title: `New song - ${slug}`,
  };
};
