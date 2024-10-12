import Link from 'next/link';
import UserButton from './UserButton';
import { Button } from './ui/button';
import { getCurrentSession } from '@/lib/auth/session';

export default async function NavBar() {
  const { user } = await getCurrentSession();

  return (
    <header className="sticky top-0 bg-background px-3 shadow-sm">
      <nav className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3">
        <Link href="/" className="font-bold">
          ONGBA
        </Link>

        {user ? (
          <UserButton user={user} />
        ) : (
          <Button asChild>
            <Link href={`/login`}>Login</Link>
          </Button>
        )}
      </nav>
    </header>
  );
}
