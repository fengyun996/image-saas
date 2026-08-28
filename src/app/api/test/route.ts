/* eslint-disable @typescript-eslint/no-explicit-any */
import { createUserSchema } from '@/server/db/validate-schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams;

  try {
    const result = createUserSchema.parse({
      name: query.get('name'),
      email: query.get('email'),
    });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}
