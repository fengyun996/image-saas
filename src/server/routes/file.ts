import z from 'zod';
import { protectedProcedure, router } from '../trpc';
import { TRPCError } from '@trpc/server';
import { S3Client, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { files } from '../db/schema';
import { db } from '../db/db';
import { v4 as uuid } from 'uuid';

const bucket = process.env.COS_BUCKET;
const apiEndpoint = process.env.COS_ENDPOINT;
const region = process.env.COS_REGION;
const COS_APP_ID = process.env.COS_APP_ID;
const COS_APP_SECRET = process.env.COS_APP_SECRET;

if (!bucket || !apiEndpoint || !region || !COS_APP_ID || !COS_APP_SECRET) {
  throw new Error(
    'Missing COS configuration: COS_BUCKET, COS_ENDPOINT, COS_REGION, COS_APP_ID, and COS_APP_SECRET are required',
  );
}

export const fileRoutes = router({
  createPresignedUrl: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        contentType: z.string(),
        size: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const date = new Date();

      const isoString = date.toISOString();

      const dateString = isoString.split('T')[0];

      const params: PutObjectCommandInput = {
        Bucket: bucket,
        Key: `${dateString}/${input.filename.replaceAll(' ', '_')}`,
        ContentType: input.contentType,
        ContentLength: input.size,
      };

      const s3Client = new S3Client({
        endpoint: apiEndpoint,
        region: region,
        credentials: {
          accessKeyId: COS_APP_ID,
          secretAccessKey: COS_APP_SECRET,
        },
      });

      const command = new PutObjectCommand(params);
      const url = await getSignedUrl(s3Client, command, {
        expiresIn: 60,
      });

      return {
        url,
        method: 'PUT' as const,
      };
    }),
  saveFile: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        path: z.string(),
        type: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx;

      const url = new URL(input.path);

      const photo = await db
        .insert(files)
        .values({
          ...input,
          id: uuid(),
          path: url.pathname,
          url: url.toString(),
          userId: session.user.id,
          contentType: input.type,
        })
        .returning();

      return photo[0];
    }),
});
