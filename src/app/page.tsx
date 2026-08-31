'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { trpcClient } from '@/utils/client';
import { useEffect } from 'react';

export default function Home() {
  // 会运行两次
  useEffect(() => {
    trpcClient.hello.query();
  }, []);

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
