'use server';

import { db } from '.';
import { sql } from 'drizzle-orm';
import { NewUser, users } from './schema';

const preparedGetUser = db.query.users
  .findFirst({
    where: (users, { eq }) => eq(users.uid, sql.placeholder('uid')),
  })
  .prepare('query_get_chord');

export const upsertUser = async ({
  id,
  email,
  image,
  name,
}: {
  id: string;
  email: string;
  image: string;
  name: string;
}) => {
  const existingUser = await preparedGetUser.execute({ uid: id });
  if (existingUser) {
    return existingUser;
  }
  const [firstName, ...lastName] = name.split(' ');
  const newUser = await db
    .insert(users)
    .values({
      uid: id,
      email,
      imageUrl: image,
      firstName,
      lastName: lastName?.join(' ') ?? '',
    })
    .returning();
  return newUser[0];
};
