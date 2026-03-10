import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full rounded-lg border px-3 py-2.5 text-base text-gray-900 bg-white
          placeholder:text-gray-500 outline-none
          focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
          focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1
          disabled:bg-gray-50 disabled:text-gray-500
          dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400
          dark:focus-visible:ring-offset-gray-900
          ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
