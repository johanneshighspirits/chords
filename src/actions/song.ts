'use server';

import { insertSong } from '@/db/actions';
import { Result } from '@/helpers/Result';
import { generateId } from '@/helpers/common';
import { slugify } from '@/helpers/string';
import { Song } from '@/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const createSong = async (formData: FormData) => {
  const title = formData.get('title') as string;
  if (title) {
    const slug = slugify(title);
    const newSong = await insertSong({ uid: generateId(), title, slug });
    redirect(`/song/${slug}`);
  }
};

export const updateSong = async (song: Song) => {
  const { slug } = song;
  console.log('-- updateSong ignored --');
};
