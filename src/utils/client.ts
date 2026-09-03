import { createTRPCContext } from '@trpc/tanstack-react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@/server/router';

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/api/trpc',
    }),
  ],
});

export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();
