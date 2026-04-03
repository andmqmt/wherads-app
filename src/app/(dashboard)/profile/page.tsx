'use client';

import { useAuth } from '@/contexts/auth-context';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Perfil
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Informações da sua conta
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-4">
          <div>
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Nome
            </span>
            <p className="text-zinc-900 dark:text-zinc-50">{user.name}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Email
            </span>
            <p className="text-zinc-900 dark:text-zinc-50">{user.email}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Membro desde
            </span>
            <p className="text-zinc-900 dark:text-zinc-50">
              {new Date(user.createdAt).toLocaleDateString('pt-BR', {
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
