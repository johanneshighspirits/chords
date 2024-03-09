import { eq } from 'drizzle-orm';
import { db } from '.';
import { NewSong, DBSong, songs, DBPart, DBChord } from './schema';
import { Chord, Part, Song, WithMany } from '@/types';
import { deserializeTiming } from '@/transfer/serializer';

export async function insertSong(song: NewSong): Promise<DBSong[]> {
  return db.insert(songs).values(song).returning();
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

const convertParts = (parts: WithMany<DBPart, DBChord, 'chords'>[]): Part[] => {
  return parts.map(({ uid, title, chords, position, duration, offset }) => {
    return {
      uid,
      title,
      color: { h: 0, s: 0, l: 0 },
      chords: convertChords(chords),
      timing: deserializeTiming([position, duration, offset]),
    } satisfies Part;
  });
};

const convertChords = (chords: DBChord[]): Chord[] => {
  return chords.map(({ uid, json, position, duration, offset }) => {
    return {
      ...JSON.parse(json as string),
      uid,
      timing: deserializeTiming([position, duration, offset]),
    };
  });
};
