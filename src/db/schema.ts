import { relations } from 'drizzle-orm';
import {
  integer,
  boolean,
  serial,
  pgTable,
  text,
  uuid,
  varchar,
  timestamp,
  primaryKey,
} from 'drizzle-orm/pg-core';
import type { AdapterAccount } from 'next-auth/adapters';

export const users = pgTable('user', {
  id: text('id').notNull().primaryKey(),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
});

export const usersRelations = relations(users, ({ many }) => ({
  songs: many(songs),
}));

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').notNull().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export type DBUser = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const songs = pgTable('songs', {
  uid: uuid('uid').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  title: text('title').notNull(),
  artist: text('artist').notNull(),
  artistSlug: text('artist_slug').notNull(),
  slug: text('slug').notNull(),
});
export const songsRelations = relations(songs, ({ one, many }) => ({
  admin: one(users, { fields: [songs.userId], references: [users.id] }),
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
