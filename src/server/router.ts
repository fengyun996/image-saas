import { createCallerFactory } from '@trpc/server/unstable-core-do-not-import';
import { fileRouter } from '@/server/routers/file';
import { publicProcedure, router } from '@/server/trpc';

export const appRouter = router({
  hello: publicProcedure.query(() => ({ greeting: 'Hello from tRPC!' })),
  file: fileRouter,
});

export type AppRouter = typeof appRouter;
export const serverCaller = createCallerFactory()(appRouter);
