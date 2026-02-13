/**
 * Reusable Button component with soft variants
 */

import React from 'react';
import { cn } from '@/app/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 active:scale-[0.97] shadow-sm shadow-amber-200/50 hover:shadow-md hover:shadow-amber-200/60 dark:shadow-amber-900/20',
    secondary: 'bg-white/60 dark:bg-gray-700/60 text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-600/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50',
    ghost: 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 backdrop-blur-sm',
    danger: 'bg-gradient-to-r from-red-400 to-rose-500 text-white hover:from-red-500 hover:to-rose-600 active:scale-[0.97] shadow-sm shadow-red-200/50 hover:shadow-md',
  };

  const sizeStyles = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
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
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
