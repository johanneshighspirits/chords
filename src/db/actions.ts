'use server';

import { eq, inArray } from 'drizzle-orm';
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
  ChordMeta,
  Note,
  Part as PartType,
  Sign,
  Song,
  SongMeta,
  WithMany,
} from '@/types';
import { deserializeColor, serializeColor } from '@/helpers/color';
import { deserializeTiming, serializeTiming } from '@/helpers/timing';
import { Part } from '@/helpers/part';
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
      console.log(`Created song ${songId} and empty part ${dbPart[0]?.uid}`);
    }
  });
}

export async function updateSong(song: Partial<SongMeta> & { uid: string }) {
  return db
    .update(songs)
    .set({ ...song })
    .where(eq(songs.uid, song.uid));
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
  return {
    uid,
    title,
    color: serializeColor(color),
    ...serializeTiming(timing),
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

export async function updatePart(
  part: Partial<Pick<PartType, 'color' | 'timing' | 'title'>> & { uid: string }
) {
  const { color, timing, title, uid } = part;
  const dbPart: Partial<DBPart> = {
    title,
    ...(color ? { color: serializeColor(color) } : {}),
    ...(timing ? { ...serializeTiming(timing) } : {}),
  };
  return db.update(parts).set(dbPart).where(eq(parts.uid, uid)).returning();
}

export async function deletePart(uid: string) {
  return db.delete(parts).where(eq(parts.uid, uid));
}

export async function insertChord(
  partId: string,
  data: Chord | Chord[]
): Promise<DBChord[]> {
  return db
    .insert(chords)
    .values(
      Array.isArray(data)
        ? data.map((c) => serializeChord(partId, c))
        : [serializeChord(partId, data)]
    )
    .returning();
}

export async function updateChordTiming(chordMeta: ChordMeta | ChordMeta[]) {
  const items = Array.isArray(chordMeta) ? chordMeta : [chordMeta];
  await Promise.all(
    items.map((item) => {
      return db
        .update(chords)
        .set(serializeTiming(item.timing))
        .where(eq(chords.uid, item.uid));
    })
  );
}

export async function deleteChord(uid: string | string[]) {
  await db
    .delete(chords)
    .where(Array.isArray(uid) ? inArray(chords.uid, uid) : eq(chords.uid, uid));
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
        timing: deserializeTiming({ position, duration, offset }),
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
        timing: deserializeTiming({ position, duration, offset }),
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

const serializeChord = (partId: string, chord: Chord): NewChord => {
  const { uid, timing, ...details } = chord;
  const dbChord = {
    ...details,
    ...serializeTiming(timing),
    uid,
    partId,
  } satisfies NewChord;
  return dbChord;
};
