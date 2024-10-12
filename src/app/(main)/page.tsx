import { getCurrentSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export default async function Home() {
  const { session } = await getCurrentSession();
  if (!session) redirect('/login');

  return <div>hi</div>;
}
