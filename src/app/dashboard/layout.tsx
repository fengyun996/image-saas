import { getServerAuthSession } from '@/server/auth';
import { redirect } from 'next/navigation';

export default async function DashBoardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession();

  if (!session?.user) {
    return redirect('/api/auth/signin');
  }

  return <>{children}</>;
}
