'use client';

import { Logo, LogoFull } from '@/components/ui/logo';
import { useAuth } from '@/contexts/auth-context';
import { useI18n } from '@/contexts/i18n-context';
import { useTheme } from '@/contexts/theme-context';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { locale, t, changeLocale } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: '/dashboard', label: t.dashboard.title },
    { href: '/campaigns', label: t.campaigns.title },
    { href: '/profile', label: t.profile.title },
  ];

  function handleLogout() {
    logout();
    router.push('/');
  }

  return (
    <>
      {/* Desktop Header */}
      <header className="glass-strong sticky top-0 z-50">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="hidden sm:block">
              <LogoFull />
            </Link>
            <Link href="/dashboard" className="sm:hidden">
              <Logo size={28} />
            </Link>

            <nav className="hidden items-center gap-0.5 sm:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                    pathname.startsWith(item.href)
                      ? 'bg-gradient-to-r from-blue-500/10 to-violet-500/10 text-blue-600 dark:text-blue-400'
                      : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => changeLocale(locale === 'pt-BR' ? 'en' : 'pt-BR')}
              className="rounded-lg px-2 py-1 text-xs font-medium text-zinc-400 transition-all duration-200 hover:text-zinc-700 dark:hover:text-zinc-200"
              aria-label="Alternar idioma"
            >
              {locale === 'pt-BR' ? 'EN' : 'PT'}
            </button>
            <button
              onClick={toggleTheme}
              className="rounded-lg p-1.5 text-zinc-400 transition-all duration-200 hover:text-zinc-700 dark:hover:text-zinc-200"
              aria-label={t.common.toggleTheme}
            >
              {theme === 'light' ? (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                  />
                </svg>
              )}
            </button>
            <span className="hidden text-sm text-zinc-500 dark:text-zinc-400 sm:block">
              {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-zinc-400 transition-all duration-200 hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              {t.common.logout}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Tab Bar */}
      <nav className="glass-strong fixed bottom-0 left-0 right-0 z-50 sm:hidden">
        <div className="flex items-center justify-around pb-[env(safe-area-inset-bottom)]">
          <TabItem
            href="/dashboard"
            label={t.dashboard.title}
            active={pathname === '/dashboard'}
            icon={
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                />
              </svg>
            }
          />
          <TabItem
            href="/campaigns"
            label={t.campaigns.title}
            active={pathname.startsWith('/campaigns')}
            icon={
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                />
              </svg>
            }
          />
          <TabItem
            href="/campaigns/new"
            label=""
            active={pathname === '/campaigns/new'}
            isCreate
            icon={
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            }
          />
          <TabItem
            href="/profile"
            label={t.profile.title}
            active={pathname === '/profile'}
            icon={
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            }
          />
        </div>
      </nav>
    </>
  );
}

function TabItem({
  href,
  label,
  active,
  icon,
  isCreate,
}: {
  href: string;
  label: string;
  active: boolean;
  icon: React.ReactNode;
  isCreate?: boolean;
}) {
  if (isCreate) {
    return (
      <Link
        href={href}
        className="flex -mt-3 h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-lg shadow-blue-500/25 transition-all duration-200 active:scale-95"
      >
        {icon}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-0.5 px-3 py-2 transition-all duration-200 ${
        active
          ? 'text-blue-600 dark:text-blue-400'
          : 'text-zinc-400 dark:text-zinc-500'
      }`}
    >
      {icon}
      {label && <span className="text-[10px] font-medium">{label}</span>}
    </Link>
  );
}
