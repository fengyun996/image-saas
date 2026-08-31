import { initTRPC } from '@trpc/server';
import type { Session } from 'next-auth';

interface Context {
  session: Session | null;
}

const t = initTRPC.context<Context>().create();

const { router, procedure } = t;

const middleware = t.middleware(async ({ ctx, next }) => {
  const start = Date.now();
  const result = await next();
  console.log(`请求耗时${Date.now() - start}ms`);

  return result;
});

const logProcedure = procedure.use(middleware);

export const testRouter = router({
  hello: logProcedure.query(async ({ ctx }) => {
    // console.log(ctx.session);

    return {
      greeting: 'Hello from tRPC!',
    };
  }),
});

export type TestRouter = typeof testRouter;
