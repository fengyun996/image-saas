'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTRPC } from '@/utils/client';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const trpc = useTRPC();

  const { data, isLoading } = useQuery(
    trpc.hello.queryOptions(void 0, { refetchOnWindowFocus: false }),
  );

  return (
    <div className="flex h-screen justify-center items-center">
      <form className="w-full max-w-md flex flex-col gap-4">
        <h1 className="text-center text-xl font-bold">Create App</h1>
        <Input name="name" placeholder="App Name" />
        <Textarea name="description" placeholder="Description" />
        <Button type="submit">Submit</Button>
        {data?.greeting}
        {isLoading && <p>Loading...</p>}
      </form>
    </div>
  );
}
