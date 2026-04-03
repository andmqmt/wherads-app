import type { ComponentProps } from 'react';

type SelectProps = ComponentProps<'select'> & {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
};

export function Select({ label, error, id, options, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
      >
        {label}
      </label>
      <select
        id={id}
        className={`h-11 rounded-xl border bg-white/50 px-3.5 text-sm transition-all duration-200 outline-none
          ${
            error
              ? 'border-red-400 focus:ring-2 focus:ring-red-200'
              : 'border-border-glass focus:border-accent focus:ring-2 focus:ring-blue-500/10 dark:bg-white/5 dark:text-zinc-100'
          }`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
