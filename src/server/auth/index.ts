import { DrizzleAdapter } from '@auth/drizzle-adapter';
import {
  AuthOptions,
  DefaultSession,
  getServerSession as nextAuthGetServerSession,
} from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GitlabProvider from 'next-auth/providers/gitlab';
import { db } from '@/server/db/db';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

export const authOptions: AuthOptions = {
  adapter: DrizzleAdapter(db),
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
      }

      return session;
    },
  },
  providers: [
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            issuer: 'https://github.com/login/oauth',
          }),
        ]
      : []),
    ...(process.env.GITLAB_ID && process.env.GITLAB_SECRET
      ? [
          GitlabProvider({
            clientId: process.env.GITLAB_ID,
            clientSecret: process.env.GITLAB_SECRET,
            issuer: 'https://gitlab.com',
          }),
        ]
      : []),
  ],
};

export function getServerSession() {
  return nextAuthGetServerSession(authOptions);
}
