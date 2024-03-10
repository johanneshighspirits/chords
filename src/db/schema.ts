import { relations } from 'drizzle-orm';
import {
  integer,
  boolean,
  pgTable,
  text,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const songs = pgTable('songs', {
  uid: uuid('uid').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
});
export const songsRelations = relations(songs, ({ many }) => ({
  parts: many(parts),
}));

export type DBSong = typeof songs.$inferSelect;
export type NewSong = typeof songs.$inferInsert;

export const parts = pgTable('parts', {
  uid: uuid('uid').primaryKey(),
  title: text('title').notNull(),
  color: varchar('color', { length: 255 }),
  position: integer('position').notNull(),
  duration: integer('duration').notNull(),
  offset: integer('offset').notNull(),
  songId: uuid('song_id')
    .notNull()
    .references(() => songs.uid, {
      onDelete: 'cascade',
    }),
});

export const partsRelations = relations(parts, ({ one, many }) => ({
  song: one(songs, {
    fields: [parts.songId],
    references: [songs.uid],
  }),
  chords: many(chords),
}));

export type DBPart = typeof parts.$inferSelect;
export type NewPart = typeof parts.$inferInsert;

export const chords = pgTable('chords', {
  uid: uuid('uid').primaryKey(),
  position: integer('position').notNull(),
  duration: integer('duration').notNull(),
  offset: integer('offset').notNull(),
  note: varchar('note', { length: 1 }).notNull(),
  major: boolean('major').notNull().default(true),
  sign: varchar('sign', { length: 8 }).notNull(),
  bass: varchar('bass', { length: 1 }),
  bassSign: varchar('bass_sign', { length: 8 }),
  modifier: integer('modifier'),
  partId: uuid('part_id')
    .notNull()
    .references(() => parts.uid, {
      onDelete: 'cascade',
    }),
});

export const chordsRelations = relations(chords, ({ one }) => ({
  part: one(parts, {
    fields: [chords.partId],
    references: [parts.uid],
  }),
}));

export type DBChord = typeof chords.$inferSelect;
export type NewChord = typeof chords.$inferInsert;
