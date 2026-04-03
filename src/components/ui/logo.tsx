export function Logo({
  size = 32,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="40" height="40" rx="10" fill="url(#wa-bg)" />
      <path
        d="M20 6C14.48 6 10 10.48 10 16C10 23.5 20 34 20 34C20 34 30 23.5 30 16C30 10.48 25.52 6 20 6Z"
        fill="white"
      />
      <circle cx="20" cy="16" r="3.5" fill="url(#wa-dot)" />
      <defs>
        <linearGradient
          id="wa-bg"
          x1="0"
          y1="0"
          x2="40"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient
          id="wa-dot"
          x1="16.5"
          y1="12.5"
          x2="23.5"
          y2="19.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function LogoFull({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <Logo size={28} />
      <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
        Wher
        <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
          Ads
        </span>
      </span>
    </span>
  );
}
