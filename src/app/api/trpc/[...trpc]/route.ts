import { createContext, testRouter } from '@/utils/server';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { NextRequest } from 'next/server';

const handler = (request: NextRequest) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: testRouter,
    createContext: async () => createContext(),
  });
};

export { handler as GET, handler as POST };
