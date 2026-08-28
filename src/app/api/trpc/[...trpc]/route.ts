import { initTRPC } from '@trpc/server';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { NextRequest } from 'next/server';

const t = initTRPC.create();

const { router, procedure } = t;

const testRouter = router({
  hello: procedure.query(() => {
    return {
      greeting: 'Hello from tRPC!',
    };
  }),
});

const handler = (request: NextRequest) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: testRouter,
    createContext: () => ({}),
  });
};
