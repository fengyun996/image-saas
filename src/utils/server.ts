import type { Session } from 'next-auth';

export interface Context {
  session: Session | null;
}

export async function createContext() {
  return { session: null };
}
