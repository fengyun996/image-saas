import { initTRPC } from '@trpc/server';
const t = initTRPC.create();

const { router, procedure } = t;

export const testRouter = router({
  hello: procedure.query(() => {
    return {
      greeting: 'Hello from tRPC!',
    };
  }),
});

export type TestRouter = typeof testRouter;
