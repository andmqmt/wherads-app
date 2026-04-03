'use client';

import { Logo } from '@/components/ui/logo';
import { useI18n } from '@/contexts/i18n-context';
import Link from 'next/link';

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden">
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/15 blur-[120px] dark:bg-blue-500/10" />
        <div className="absolute -bottom-20 left-1/4 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[100px] dark:bg-violet-500/8" />
        <div className="absolute right-1/4 top-1/3 h-[300px] w-[300px] rounded-full bg-cyan-400/8 blur-[80px]" />
      </div>

      <main className="relative z-10 flex w-full max-w-2xl flex-col items-center gap-10 px-6 py-20">
        <div className="flex flex-col items-center gap-6 text-center">
          <Logo size={56} />
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-6xl">
            Wher
            <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
              Ads
            </span>
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
            {t.home.subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/auth/login"
            className="flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-8 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-blue-500/30 hover:brightness-110 active:brightness-95 sm:w-auto"
          >
            {t.common.enter}
          </Link>
          <Link
            href="/auth/register"
            className="glass flex h-12 items-center justify-center rounded-xl px-8 text-sm font-medium text-zinc-700 transition-all duration-200 hover:bg-surface-hover dark:text-zinc-300 sm:w-auto"
          >
            {t.common.createAccount}
          </Link>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {['AI Insights', 'Analytics', 'i18n', 'Dark Mode'].map((tag) => (
            <span
              key={tag}
              className="glass rounded-full px-3.5 py-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </main>
    </div>
  );
}
