import { Header } from '@/components/layout/header';
import { ProtectedRoute } from '@/components/layout/protected-route';
import type { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
