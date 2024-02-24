'use server';

import { Song } from '@/types';

export const getSong = async (slug: string): Promise<Song> => {
  return {
    title: `New song - ${slug}`,
    parts: [],
  };
};
