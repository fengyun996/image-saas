import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { TestRouter } from './server';
export const trpcClient = createTRPCClient<TestRouter>({
  links: [
    httpBatchLink({
      url: 'http://127.0.0.1:3000/api/trpc',
    }),
  ],
});
