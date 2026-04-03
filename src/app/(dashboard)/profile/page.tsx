'use client';

import { useAuth } from '@/contexts/auth-context';
import { useI18n } from '@/contexts/i18n-context';

export default function ProfilePage() {
  const { user } = useAuth();
  const { t, locale } = useI18n();

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {t.profile.title}
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {t.profile.subtitle}
        </p>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex flex-col gap-4">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {t.auth.name}
            </span>
            <p className="mt-0.5 text-zinc-900 dark:text-zinc-50">
              {user.name}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {t.auth.email}
            </span>
            <p className="mt-0.5 text-zinc-900 dark:text-zinc-50">
              {user.email}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {t.profile.memberSince}
            </span>
            <p className="mt-0.5 text-zinc-900 dark:text-zinc-50">
              {new Date(user.createdAt).toLocaleDateString(locale, {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
