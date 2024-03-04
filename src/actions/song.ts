'use server';

import { AsyncResult, Result } from '@/helpers/Result';
import { parseChord } from '@/helpers/chord';
import { slugify } from '@/helpers/string';
import { Song, SongMeta } from '@/types';
import { readFile, readdir, rm, writeFile } from 'fs/promises';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export const createSong = async (formData: FormData) => {
  const title = formData.get('title') as string;
  if (title) {
    const id = crypto.randomUUID().substring(0, 16);
    const slug = slugify(title);
    const song = {
      id,
      title,
      slug,
      parts: [],
    };
    await writeFile(`./temp/${slug}.json`, JSON.stringify(song, null, 2));
    redirect(`/song/${slug}`);
  }
};

export const updateSong = async (song: Song) => {
  const { slug } = song;
  await writeFile(`./temp/${slug}.json`, JSON.stringify(song, null, 2));
};

export const getSong = async (slug: string): Promise<Song> => {
  const song = await readFile(`./temp/${slug}.json`, { encoding: 'utf8' });
  return JSON.parse(song);
};

export const deleteSong = async (
  slug: string,
  pathToRevalidate: string
): Promise<Result<string>> => {
  try {
    await rm(`./temp/${slug}.json`);
    revalidatePath(pathToRevalidate);
    return Result.ok(slug);
  } catch (error: any) {
    return Result.fail(error);
  }
};

export const getSongs = async (): AsyncResult<SongMeta[]> => {
  const filenames = await readdir('./temp');
  const songs = await Promise.all(
    filenames.map((filename) =>
      readFile(`./temp/${filename}`, { encoding: 'utf8' }).then(
        (d) => JSON.parse(d) as Song
      )
    )
  );
  return Result.ok(songs.map(({ id, title, slug }) => ({ id, title, slug })));
};
