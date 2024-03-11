'use server';

import { insertSong } from '@/db/actions';
import { generateId } from '@/helpers/common';
import { slugify } from '@/helpers/string';
import { redirect } from 'next/navigation';

export const createSong = async (formData: FormData) => {
  const title = formData.get('title') as string;
  if (title) {
    const slug = slugify(title);
    const newSong = await insertSong({ uid: generateId(), title, slug });
    redirect(`/song/${slug}`);
  }
};
