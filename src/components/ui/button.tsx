import type { ComponentProps } from 'react';

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
};

const variants = {
  primary:
    'bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:brightness-110 active:brightness-95',
  secondary: 'glass text-zinc-700 hover:bg-surface-hover dark:text-zinc-300',
  danger:
    'bg-red-500/90 text-white hover:bg-red-500 shadow-lg shadow-red-500/20',
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
      className={`flex h-11 items-center justify-center rounded-xl px-6 text-sm font-medium transition-all duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]}`}
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
