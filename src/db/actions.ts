'use server';

import { eq, and, inArray, sql } from 'drizzle-orm';
import { db } from '.';
import {
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
  ChordFlavor,
  ChordMeta,
  Note,
  Part as PartType,
  Sign,
  Song,
  SongMeta,
  WithMany,
  isChord,
} from '@/types';
import { deserializeColor, serializeColor } from '@/helpers/color';
import {
  deserializeTiming,
  isTimingEarlier,
  serializeTiming,
} from '@/helpers/timing';
import { Part } from '@/helpers/part';
import { revalidatePath } from 'next/cache';

type UpsertChordsProps = {
  action: 'upsertChords';
  songId: string;
  part: PartType;
  entries: (Chord | ChordMeta)[];
  removedEntryUids?: string[];
};

type UpsertPartsProps = {
  action: 'upsertParts';
  songId: string;
  entries: PartType[];
  removedEntryUids?: string[];
};

export type DBActionPayload = UpsertChordsProps | UpsertPartsProps;

export async function saveToDB(payloads: DBActionPayload[]): Promise<void> {
  console.log('----- saveToDB() ------', payloads.length);
  const merged = await mergePayloads(payloads);
  console.log(merged);
  for (const payload of merged) {
    console.log('WRITING:', payload.action);
    if (payload.action === 'upsertChords') {
      await writeChordsToDB(payload);
    }
    if (payload.action === 'upsertParts') {
      await writePartsToDB(payload);
    }
  }
}

export const mergePayloads = (payloads: DBActionPayload[]) => {
  const mergedChordPayloads: Record<string, UpsertChordsProps> = {};
  const chordsDictionary: Record<string, Chord | ChordMeta> = {};

  const mergedPartPayloads: Record<string, UpsertPartsProps> = {};
  const partsDictionary: Record<string, PartType> = {};

  for (const payload of payloads) {
    const key = getPayloadKey(payload);
    if (payload.action === 'upsertChords') {
      if (!mergedChordPayloads[key]) {
        mergedChordPayloads[key] = payload;
      } else {
        mergedChordPayloads[key].entries.push(...payload.entries);
        if (payload.removedEntryUids) {
          mergedChordPayloads[key].removedEntryUids?.push(
            ...payload.removedEntryUids
          );
        }
      }

      for (const entry of payload.entries) {
        if (!chordsDictionary[entry.uid]) {
          chordsDictionary[entry.uid] = entry;
        } else {
          chordsDictionary[entry.uid] = {
            ...chordsDictionary[entry.uid],
            ...entry,
          };
        }
      }
    }

    if (payload.action === 'upsertParts') {
      if (!mergedPartPayloads[key]) {
        mergedPartPayloads[key] = payload;
      } else {
        mergedPartPayloads[key].entries.push(...payload.entries);
        if (payload.removedEntryUids) {
          mergedPartPayloads[key].removedEntryUids?.push(
            ...payload.removedEntryUids
          );
        }
      }

      for (const entry of payload.entries) {
        if (!partsDictionary[entry.uid]) {
          partsDictionary[entry.uid] = entry;
        } else {
          partsDictionary[entry.uid] = {
            ...partsDictionary[entry.uid],
            ...entry,
          };
        }
      }
    }
  }

  const chordPayloads = Object.values(mergedChordPayloads).map((payload) => {
    const existingUids = new Set<string>();
    payload.entries = payload.entries
      .toReversed()
      .map((entry) => {
        if (existingUids.has(entry.uid)) {
          return null;
        }
        existingUids.add(entry.uid);
        if (chordsDictionary[entry.uid]) {
          return {
            ...entry,
            ...chordsDictionary[entry.uid],
          };
        }
        return entry;
      })
      .filter((e): e is Chord | ChordMeta => e !== null)
      .toReversed();
    if (payload.removedEntryUids) {
      payload.removedEntryUids = [...new Set(payload.removedEntryUids)];
    }
    return payload;
  });

  const partPayloads = Object.values(mergedPartPayloads).map((payload) => {
    const existingUids = new Set<string>();
    payload.entries = payload.entries
      .toReversed()
      .map((entry) => {
        if (existingUids.has(entry.uid)) {
          return null;
        }
        existingUids.add(entry.uid);
        if (partsDictionary[entry.uid]) {
          return {
            ...entry,
            ...partsDictionary[entry.uid],
          };
        }
        return entry;
      })
      .filter((e): e is PartType => e !== null)
      .toReversed();
    if (payload.removedEntryUids) {
      payload.removedEntryUids = [...new Set(payload.removedEntryUids)];
    }
    return payload;
  });

  return [...chordPayloads, ...partPayloads];
};

const getPayloadKey = (payload: DBActionPayload) => {
  const segments = [payload.action, payload.songId];
  if (payload.action === 'upsertChords') {
    segments.push(payload.part.uid);
  }
  return segments.join('|');
};

const preparedGetChord = db.query.chords
  .findFirst({
    where: (chords, { eq }) => eq(chords.uid, sql.placeholder('uid')),
  })
  .prepare('query_get_chord');

const preparedGetPart = db.query.parts
  .findFirst({
    where: (parts, { eq }) => eq(parts.uid, sql.placeholder('uid')),
  })
  .prepare('query_get_part');

function writePartsToDB({
  songId,
  entries,
  removedEntryUids,
}: UpsertPartsProps) {
  console.log(
    `🔥 WRITING ${entries.length} entries (Part) to DB Song (${songId})`
  );
  return db.transaction(async (tx) => {
    for (const entry of entries) {
      const existingEntry = await preparedGetPart.execute({
        uid: entry.uid,
      });
      if (existingEntry) {
        console.log('Part exists', entry.uid, entry.index, entry.title);
        const { color, index, title, uid } = entry;
        const dbPart: Partial<DBPart> = {
          index,
          title,
          ...(color ? { color: serializeColor(color) } : {}),
        };
        await tx.update(parts).set(dbPart).where(eq(parts.uid, uid));
      } else {
        console.log('Part does not exist', entry.uid);
        await tx.insert(parts).values(convertDBPart(songId, entry));
      }
    }
    if (removedEntryUids) {
      await tx.delete(parts).where(inArray(parts.uid, removedEntryUids));
    }
  });
}

function writeChordsToDB({
  songId,
  part,
  entries,
  removedEntryUids,
}: UpsertChordsProps) {
  console.log(`🔥 WRITING ${entries.length} entries (Chord) to DB`);
  return db.transaction(async (tx) => {
    const existingPart = await preparedGetPart.execute({ uid: part.uid });
    if (!existingPart) {
      console.log(`🔥 part ${part.uid} doesn't exist`);
      const dbPart = convertDBPart(songId, part);
      await tx.insert(parts).values(dbPart);
    }
    console.log(`🔥 part exists`);
    for (const entry of entries) {
      const existingEntry = await preparedGetChord.execute({
        uid: entry.uid,
      });
      if (isChord(entry)) {
        if (existingEntry) {
          console.log(`🔥 chord exists`, entry);
          await tx
            .update(chords)
            .set(serializeChord(part.uid, entry))
            .where(eq(chords.uid, entry.uid));
        } else {
          await tx.insert(chords).values([serializeChord(part.uid, entry)]);
        }
      } else if (existingEntry) {
        console.log(`🔥 entry exists`);
        await tx
          .update(chords)
          .set(serializeTiming(entry.timing))
          .where(eq(chords.uid, entry.uid));
      }
    }
    if (removedEntryUids) {
      console.log(`🔥 removing`);
      await tx.delete(chords).where(inArray(chords.uid, removedEntryUids));
    }
  });
}

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

// export async function updateSong(song: Partial<SongMeta> & { uid: string }) {
//   return db
//     .update(songs)
//     .set({ ...song })
//     .where(eq(songs.uid, song.uid));
// }

export async function deleteSong(
  uid: string,
  pathToRevalidate: string
): Promise<void> {
  await db.delete(songs).where(eq(songs.uid, uid));
  revalidatePath(pathToRevalidate);
}

const convertDBPart = (songId: string, part: PartType) => {
  const { uid, title, index, color } = part;
  return {
    uid,
    title,
    color: serializeColor(color),
    index,
    songId,
  } satisfies NewPart;
};

// export async function insertPart(
//   songId: string,
//   part: PartType
// ): Promise<DBPart[]> {
//   const dbPart = convertDBPart(songId, part);
//   return db.insert(parts).values(dbPart).returning();
// }

export async function updatePart(
  part: Partial<Pick<PartType, 'color' | 'index' | 'title'>> & { uid: string }
) {
  const { color, index, title, uid } = part;
  const dbPart: Partial<DBPart> = {
    index,
    title,
    ...(color ? { color: serializeColor(color) } : {}),
  };
  return db.update(parts).set(dbPart).where(eq(parts.uid, uid)).returning();
}

// export async function deletePart(uid: string) {
//   return db.delete(parts).where(eq(parts.uid, uid));
// }

// export async function insertChord(
//   partId: string,
//   data: Chord | Chord[]
// ): Promise<DBChord[]> {
//   return db
//     .insert(chords)
//     .values(
//       Array.isArray(data)
//         ? data.map((c) => serializeChord(partId, c))
//         : [serializeChord(partId, data)]
//     )
//     .returning();
// }

// export async function updateChordTiming(chordMeta: ChordMeta | ChordMeta[]) {
//   return [];
//   const items = Array.isArray(chordMeta) ? chordMeta : [chordMeta];
//   await Promise.all(
//     items.map((item) => {
//       return db
//         .update(chords)
//         .set(serializeTiming(item.timing))
//         .where(eq(chords.uid, item.uid));
//     })
//   );
// }

// export async function deleteChord(uid: string | string[]) {
//   return;
//   await db
//     .delete(chords)
//     .where(Array.isArray(uid) ? inArray(chords.uid, uid) : eq(chords.uid, uid));
// }

export async function querySong({
  slug,
  artistSlug,
}: {
  slug: string;
  artistSlug: string;
}): Promise<Song> {
  const result = await db.query.songs.findFirst({
    where: and(eq(songs.slug, slug), eq(songs.artistSlug, artistSlug)),
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
      artist: true,
      artistSlug: true,
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
  const { uid, title, artist, artistSlug, slug, parts } = dbSong;
  const song: Song = {
    uid,
    title,
    slug,
    artist,
    artistSlug,
    parts: convertParts(parts),
  };
  return song;
};

const convertParts = (
  parts: WithMany<DBPart, DBChord, 'chords'>[]
): PartType[] => {
  return parts
    .map(({ uid, title, color, chords, index }) => {
      return {
        uid,
        index,
        title,
        color: deserializeColor(color),
        chords: convertChords(chords),
        barOffset: 0,
      } satisfies PartType;
    })
    .sort((a, b) => {
      return a.index - b.index;
    });
};

const convertChords = (chords: DBChord[]): Chord[] => {
  return chords
    .map(
      ({
        uid,
        position,
        duration,
        offset,
        note,
        flavor,
        sign,
        bass,
        bassSign,
        modifiers,
      }) => {
        return {
          type: 'chord',
          uid,
          timing: deserializeTiming({ position, duration, offset }),
          note: note as Note,
          flavor: flavor as ChordFlavor,
          sign: sign as Sign,
          bass: bass ? (bass as Note) : undefined,
          bassSign: bassSign ? (bassSign as Sign) : undefined,
          modifiers: modifiers?.split(',').map(Number) || undefined,
        } satisfies Chord;
      }
    )
    .sort((a, b) => {
      return isTimingEarlier(a.timing, b.timing) ? -1 : 1;
    });
};

const serializeChord = (partId: string, chord: Chord): NewChord => {
  const { uid, timing, type, modifiers, ...details } = chord;
  const dbChord: NewChord = {
    ...details,
    ...serializeTiming(timing),
    modifiers: modifiers?.join(','),
    uid,
    partId,
  };
  return dbChord;
};
