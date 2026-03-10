interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 28,
  md: 36,
  lg: 48,
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const px = sizes[size]

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* Gota de sangue */}
      <path
        d="M16 2C16 2 5.5 13.5 5.5 20.5C5.5 26.3 10.2 31 16 31C21.8 31 26.5 26.3 26.5 20.5C26.5 13.5 16 2 16 2Z"
        fill="#2563eb"
      />
      {/* Curva de glicemia */}
      <path
        d="M9 22Q11 17 13.5 20Q15.5 22.5 17 15Q18.5 8 21 18Q21.8 21 23 19.5"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}
