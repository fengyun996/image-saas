import { getServerAuthSession } from '@/server/auth';
import { initTRPC, TRPCError } from '@trpc/server';
import { createCallerFactory } from '@trpc/server/unstable-core-do-not-import';
import type { Session } from 'next-auth';

export async function createContext() {
  {
    const session = await getServerAuthSession();

    if (!session?.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });
    }

    return { session };
  }
}

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

export const serverCaller = createCallerFactory()(testRouter);
