import type { ComponentProps } from 'react';

type InputProps = ComponentProps<'input'> & {
  label: string;
  error?: string;
};

export function Input({ label, error, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
      >
        {label}
      </label>
      <input
        id={id}
        className={`h-11 rounded-xl border bg-white/50 px-3.5 text-sm transition-all duration-200 outline-none placeholder:text-zinc-400
          ${
            error
              ? 'border-red-400 focus:ring-2 focus:ring-red-200'
              : 'border-border-glass focus:border-accent focus:ring-2 focus:ring-blue-500/10 dark:bg-white/5 dark:text-zinc-100 dark:placeholder:text-zinc-500'
          }`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
