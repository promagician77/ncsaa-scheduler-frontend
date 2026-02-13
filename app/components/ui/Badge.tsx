/**
 * Reusable Badge component with soft styling
 */

import React from 'react';
import { cn } from '@/app/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  const variantStyles = {
    default: 'bg-gray-100/80 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/40',
    primary: 'bg-blue-50/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/40',
    success: 'bg-emerald-50/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-700/40',
    warning: 'bg-amber-50/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200/50 dark:border-amber-700/40',
    danger: 'bg-red-50/80 text-red-700 dark:bg-red-900/30 dark:text-red-300 border border-red-200/50 dark:border-red-700/40',
    info: 'bg-indigo-50/80 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-700/40',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full backdrop-blur-sm',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}
