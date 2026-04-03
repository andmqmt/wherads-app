import { Header } from '@/components/layout/header';
import { ProtectedRoute } from '@/components/layout/protected-route';
import type { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="relative flex flex-1 flex-col bg-[#f5f5f7] dark:bg-black">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 right-[-10%] h-[600px] w-[600px] rounded-full bg-blue-400/8 blur-[120px] dark:bg-blue-500/6" />
          <div className="absolute top-[40%] left-[-10%] h-[500px] w-[500px] rounded-full bg-violet-400/8 blur-[120px] dark:bg-violet-500/6" />
          <div className="absolute bottom-[-10%] right-[30%] h-[400px] w-[400px] rounded-full bg-cyan-400/6 blur-[100px] dark:bg-cyan-500/4" />
        </div>
        <Header />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 pb-24 sm:px-6 sm:pb-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
