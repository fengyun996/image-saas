import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getServerAuthSession } from '@/server/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerAuthSession();

  if (!session?.user) {
    return redirect('/api/auth/signin');
  }

  return (
    <div className="flex h-screen justify-center items-center">
      <form className="w-full max-w-md flex flex-col gap-4">
        <h1 className="text-center text-xl font-bold">Create App</h1>
        <Input name="name" placeholder="App Name" />
        <Textarea name="description" placeholder="Description" />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
