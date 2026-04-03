import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center gap-8 py-16 px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Wher<span className="text-blue-600">Ads</span>
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Insights inteligentes sobre o comportamento do consumidor para
            campanhas de marketing mais eficazes.
          </p>
        </div>

        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <Link
            href="/auth/login"
            className="flex h-12 w-full items-center justify-center rounded-full bg-blue-600 px-8 text-white transition-colors hover:bg-blue-700 sm:w-auto"
          >
            Entrar
          </Link>
          <Link
            href="/auth/register"
            className="flex h-12 w-full items-center justify-center rounded-full border border-zinc-300 px-8 text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 sm:w-auto"
          >
            Criar conta
          </Link>
        </div>
      </main>
    </div>
  );
}
