'use client';

import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { href: '/campaigns', label: 'Campanhas' },
  { href: '/profile', label: 'Perfil' },
];

export function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push('/');
  }

  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link
            href="/campaigns"
            className="text-xl font-bold text-zinc-900 dark:text-zinc-50"
          >
            Wher<span className="text-blue-600">Ads</span>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname.startsWith(item.href)
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-zinc-600 dark:text-zinc-400 sm:block">
            {user?.name}
          </span>
          <button
            onClick={handleLogout}
            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
