'use server';

import { querySong, insertSong } from '@/db/actions';
import { AsyncResult, Result } from '@/helpers/Result';
import { parseChord } from '@/helpers/chord';
import { generateId } from '@/helpers/common';
import { Part } from '@/helpers/part';
import { slugify } from '@/helpers/string';
import { deserializeSong, serializeSong } from '@/transfer/serializer';
import { Song, SongMeta } from '@/types';
import { readFile, readdir, rm, writeFile } from 'fs/promises';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export const createSong = async (formData: FormData) => {
  const title = formData.get('title') as string;
  if (title) {
    const slug = slugify(title);
    const newSong = await insertSong({ uid: generateId(), title, slug });
    console.log(newSong);
    // await writeFile(`./temp/${slug}.json`, serializeSong(song));
    redirect(`/song/${slug}`);
  }
};

export const updateSong = async (song: Song) => {
  const { slug } = song;
  console.log('-- updateSong ignored --');
  // await writeFile(`./temp/${slug}.json`, serializeSong(song));
};

export const getSong = async (slug: string): Promise<any> => {
  const songData = await querySong(slug);
  // const songData = await readFile(`./temp/${slug}.json`, {
  //   encoding: 'utf8',
  // });
  // const song = deserializeSong(JSON.parse(songData));
  return songData;
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
  return Result.ok(songs.map(({ uid, title, slug }) => ({ uid, title, slug })));
};
