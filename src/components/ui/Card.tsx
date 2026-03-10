import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg'
}

const paddingClasses = {
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
}

export function Card({ padding = 'md', className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
