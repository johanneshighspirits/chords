import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
// import { upsertUser } from './db/user';
import { db } from './db';
import { DrizzleAdapter } from '@auth/drizzle-adapter';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [Google],
  callbacks: {
    signIn: async (params) => {
      console.log(params);
      if (params.user.email === 'johannes@highspirits.se') {
        const { id, email, image, name } = params.user;
        if (!id) {
          return false;
        }
        // const user = await upsertUser({
        //   id,
        //   email,
        //   image: image ?? '',
        //   name: name ?? '',
        // });
        // console.log('Logged in:', user.firstName, user.lastName);
        return true;
      }
      return false;
    },
    // jwt({ token, user, account, profile }) {
    //   if (user) {
    //     console.log('token, user,account,profile');
    //     console.log(token, user, account, profile);
    //     token.id = user.id;
    //   }
    //   return token;
    // },
    // session({ session, user, token }) {
    //   session.user.id = token.id as string;
    //   return session;
    // },
  },
});
