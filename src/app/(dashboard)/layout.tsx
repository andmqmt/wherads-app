import { Header } from '@/components/layout/header';
import { ProtectedRoute } from '@/components/layout/protected-route';
import type { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="relative flex flex-1 flex-col overflow-hidden bg-zinc-50/50 dark:bg-zinc-950">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -top-32 right-0 h-[500px] w-[500px] rounded-full bg-blue-400/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-violet-400/5 blur-3xl" />
        </div>
        <Header />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
