'use server';

import { eq } from 'drizzle-orm';
import { db } from '.';
import {
  NewSong,
  DBSong,
  songs,
  DBPart,
  DBChord,
  chords,
  NewChord,
  NewPart,
  parts,
} from './schema';
import {
  Chord,
  Note,
  Part as PartType,
  Sign,
  Song,
  SongMeta,
  WithMany,
} from '@/types';
import { deserializeColor, serializeColor } from '@/helpers/color';
import { deserializeTiming, serializeTiming } from '@/helpers/timing';
import { generateId } from '@/helpers/common';
import { Part } from '@/helpers/part';
import { parseChord } from '@/helpers/chord';
import { revalidatePath } from 'next/cache';

export async function insertSong(song: SongMeta): Promise<void> {
  return db.transaction(async (tx) => {
    const dbSong = await tx
      .insert(songs)
      .values(song)
      .returning({ songId: songs.uid });
    const songId = dbSong[0]?.songId;
    if (songId) {
      const newPart = Part.new();
      const dbPart = await tx
        .insert(parts)
        .values(convertDBPart(songId, newPart))
        .returning();
      console.log('created song and empty part', songId, dbPart[0]?.uid);
    }
  });
}

export async function deleteSong(
  uid: string,
  pathToRevalidate: string
): Promise<void> {
  await db.delete(songs).where(eq(songs.uid, uid));
  revalidatePath(pathToRevalidate);
}

const convertDBPart = (songId: string, part: PartType) => {
  const { uid, title, timing, color } = part;
  const [position, duration, offset] = serializeTiming(timing);
  return {
    uid,
    title,
    color: serializeColor(color),
    position,
    duration,
    offset,
    songId,
  } satisfies NewPart;
};

export async function insertPart(
  songId: string,
  part: PartType
): Promise<DBPart[]> {
  const dbPart = convertDBPart(songId, part);
  return db.insert(parts).values(dbPart).returning();
}

export async function insertChord(
  partId: string,
  chord: Chord
): Promise<DBChord[]> {
  const { uid, timing, ...details } = chord;
  const [position, duration, offset] = serializeTiming(timing);
  const dbChord = {
    ...details,
    uid,
    position,
    duration,
    offset,
    partId,
  } satisfies NewChord;

  return db.insert(chords).values(dbChord).returning();
}

export async function querySong(slug: string): Promise<Song> {
  const result = await db.query.songs.findFirst({
    where: eq(songs.slug, slug),
    with: {
      parts: {
        with: {
          chords: true,
        },
      },
    },
  });
  if (!result) {
    throw new Error(`No song found`);
  }

  return convertSong(result);
}

export async function querySongsMeta(): Promise<SongMeta[]> {
  const result = await db.query.songs.findMany({
    columns: {
      uid: true,
      slug: true,
      title: true,
    },
  });
  if (!result) {
    throw new Error('No Songs found');
  }
  return result;
}

const convertSong = (
  dbSong: WithMany<DBSong, WithMany<DBPart, DBChord, 'chords'>, 'parts'>
): Song => {
  const { uid, title, slug, parts } = dbSong;
  const song: Song = {
    uid,
    title,
    slug,
    parts: convertParts(parts),
  };
  return song;
};

const convertParts = (
  parts: WithMany<DBPart, DBChord, 'chords'>[]
): PartType[] => {
  return parts.map(
    ({ uid, title, color, chords, position, duration, offset }) => {
      return {
        uid,
        title,
        color: deserializeColor(color),
        chords: convertChords(chords),
        timing: deserializeTiming([position, duration, offset]),
      } satisfies PartType;
    }
  );
};

const convertChords = (chords: DBChord[]): Chord[] => {
  return chords.map(
    ({
      uid,
      position,
      duration,
      offset,
      note,
      major,
      sign,
      bass,
      bassSign,
      modifier,
    }) => {
      return {
        uid,
        timing: deserializeTiming([position, duration, offset]),
        note: note as Note,
        major,
        sign: sign as Sign,
        bass: bass ? (bass as Note) : undefined,
        bassSign: bassSign ? (bassSign as Sign) : undefined,
        modifier: modifier || undefined,
      } satisfies Chord;
    }
  );
};
