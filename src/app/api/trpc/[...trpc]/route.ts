import { getServerAuthSession } from '@/server/auth';
import { testRouter } from '@/utils/server';
import { TRPCError } from '@trpc/server';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { NextRequest } from 'next/server';

const handler = (request: NextRequest) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: testRouter,
    createContext: async () => {
      const session = await getServerAuthSession();

      if (!session?.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });
      }

      return { session };
    },
  });
};

export { handler as GET, handler as POST };
