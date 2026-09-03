import { createHash, createHmac } from 'node:crypto';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, protectedProcedure } from '@/server/trpc';

const signInput = z.object({
  method: z.literal('PUT'),
  key: z.string().min(1).max(1024),
  expiresIn: z.number().int().min(60).max(900).default(300),
});

function hmac(key: string | Buffer, value: string) {
  return createHmac('sha1', key).update(value).digest('hex');
}

function hash(value: string) {
  return createHash('sha1').update(value).digest('hex');
}

function encodePath(key: string) {
  return `/${key.split('/').map(encodeURIComponent).join('/')}`;
}

function createPresignedUrl({ method, key, expiresIn }: z.infer<typeof signInput>) {
  const secretId = process.env.COS_SECRET_ID;
  const secretKey = process.env.COS_SECRET_KEY;
  const bucket = process.env.COS_BUCKET;
  const region = process.env.COS_REGION;
  const endpoint = process.env.COS_ENDPOINT ?? `https://${bucket}.cos.${region}.myqcloud.com`;

  if (!secretId || !secretKey || !bucket || !region) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'COS environment variables are not configured',
    });
  }

  const url = new URL(endpoint);
  const now = new Date();
  const startTime = Math.floor(now.getTime() / 1000);
  const endTime = startTime + expiresIn;
  const signTime = `${startTime};${endTime}`;
  const path = `${url.pathname.replace(/\/$/, '')}${encodePath(key)}`;
  const signKey = hmac(secretKey, signTime);
  const httpString = [method.toLowerCase(), path, '', '', ''].join('\n');
  const stringToSign = ['sha1', signTime, hash(httpString), ''].join('\n');
  const signature = hmac(signKey, stringToSign);
  const query = new URLSearchParams([
    ['q-sign-algorithm', 'sha1'],
    ['q-ak', secretId],
    ['q-sign-time', signTime],
    ['q-key-time', signTime],
    ['q-header-list', ''],
    ['q-url-param-list', ''],
    ['q-signature', signature],
  ]);

  return `${url.origin}${path}?${query.toString()}`;
}

export const fileRouter = router({
  signUploadUrl: protectedProcedure.input(signInput).mutation(({ input }) => ({
    url: createPresignedUrl(input),
  })),
});
