import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { upsertUser } from './db/user';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    signIn: async (params) => {
      if (params.user.email === 'johannes@highspirits.se') {
        const { id, email, image, name } = params.user;
        if (!id) {
          return false;
        }
        const user = await upsertUser({
          id,
          email,
          image: image ?? '',
          name: name ?? '',
        });
        console.log('Logged in:', user.firstName, user.lastName);
        return true;
      }
      return false;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
});
