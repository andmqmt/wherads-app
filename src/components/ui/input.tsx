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
        className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        {label}
      </label>
      <input
        id={id}
        className={`h-11 rounded-lg border px-3 text-sm transition-colors outline-none
          ${
            error
              ? 'border-red-500 focus:ring-2 focus:ring-red-200'
              : 'border-zinc-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100'
          }`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
