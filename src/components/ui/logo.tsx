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
      <rect width="40" height="40" rx="10" fill="url(#gradient)" />
      <path
        d="M12 26V14L16.5 24L21 14V26"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="27" cy="17" r="3.5" stroke="white" strokeWidth="2" />
      <path
        d="M30.5 17V26"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id="gradient"
          x1="0"
          y1="0"
          x2="40"
          y2="40"
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
