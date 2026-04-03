import type { ComponentProps } from 'react';

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
};

const variants = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-200 disabled:bg-blue-400',
  secondary:
    'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 focus:ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-200 disabled:bg-red-400',
};

export function Button({
  variant = 'primary',
  isLoading,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`flex h-11 items-center justify-center rounded-lg px-6 text-sm font-medium transition-colors focus:ring-2 outline-none disabled:cursor-not-allowed ${variants[variant]}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        children
      )}
    </button>
  );
}
