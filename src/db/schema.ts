import { relations } from 'drizzle-orm';
import {
  integer,
  boolean,
  serial,
  pgTable,
  text,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  uid: uuid('uid').primaryKey(),
  email: text('email').notNull(),
  imageUrl: text('image_url').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
});
export const usersRelations = relations(users, ({ many }) => ({
  songs: many(songs),
}));

export type DBUser = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const songs = pgTable('songs', {
  uid: uuid('uid').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.uid),
  title: text('title').notNull(),
  artist: text('artist').notNull(),
  artistSlug: text('artist_slug').notNull(),
  slug: text('slug').notNull(),
});
export const songsRelations = relations(songs, ({ one, many }) => ({
  admin: one(users, { fields: [songs.userId], references: [users.uid] }),
  parts: many(parts),
}));

export type DBSong = typeof songs.$inferSelect;
export type NewSong = typeof songs.$inferInsert;

export const parts = pgTable('parts', {
  uid: uuid('uid').primaryKey(),
  title: text('title').notNull(),
  color: varchar('color', { length: 255 }),
  index: integer('index').notNull(),
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
  flavor: varchar('flavor').notNull(),
  sign: varchar('sign', { length: 8 }).notNull(),
  bass: varchar('bass', { length: 1 }),
  bassSign: varchar('bass_sign', { length: 8 }),
  modifiers: varchar('modifiers'),
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
