import { serverCaller } from '@/server/router';
import { createContext } from '@/utils/server';

export default async function Home() {
  // server调用
  const context = await createContext();
  const data = await serverCaller(context).hello();

  return <div className="flex h-screen justify-center items-center">DashBoard {data.greeting}</div>;
}
