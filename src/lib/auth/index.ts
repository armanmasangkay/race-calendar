import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/lib/db';
import { users, accounts, sessions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
  }),
  providers: [
    Google,
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async session({ session, user }) {
      const dbUser = await db.query.users.findFirst({
        where: eq(users.id, user.id),
      });

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          isAdmin: dbUser?.isAdmin ?? false,
        },
      };
    },
  },
});
