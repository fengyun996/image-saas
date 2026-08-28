import { DrizzleAdapter } from '@auth/drizzle-adapter';
import GitHubProvider from 'next-auth/providers/github';
import { db } from '@/server/db/db';
import { AuthOptions, getServerSession as nextAuthGetServerSession } from 'next-auth';

export const authOptions: AuthOptions = {
  adapter: DrizzleAdapter(db),
  // Configure one or more authentication providers
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
};

export function getServerAuthSession() {
  return nextAuthGetServerSession(authOptions);
}
