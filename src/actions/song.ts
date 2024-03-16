'use server';

import { insertSong } from '@/db/actions';
import { generateId } from '@/helpers/common';
import { slugify } from '@/helpers/string';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const schema = z.object({
  title: z.string(),
  artist: z.string(),
});

export const createSong = async (
  prevState: { errors: Record<string, string[]> },
  formData: FormData
) => {
  const validatedFields = schema.safeParse({
    title: formData.get('title') as string,
    artist: formData.get('artist') as string,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { title, artist } = validatedFields.data;
  const slug = slugify(title);
  const artistSlug = slugify(artist);

  const newSong = await insertSong({
    uid: generateId(),
    slug,
    title,
    artist,
    artistSlug,
  });
  redirect(`/songs/${artistSlug}/${slug}`);
};
