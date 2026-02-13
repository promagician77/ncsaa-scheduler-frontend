/**
 * Reusable Alert component with gentle styling
 */

import React from 'react';
import { cn } from '@/app/lib/utils';

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

export function Alert({ variant = 'info', title, children, className, onClose }: AlertProps) {
  const variantStyles = {
    info: {
      container: 'bg-blue-50/70 dark:bg-blue-900/15 border-blue-200/60 dark:border-blue-800/40',
      title: 'text-blue-800 dark:text-blue-200',
      text: 'text-blue-600/90 dark:text-blue-300/90',
      icon: '💡',
    },
    success: {
      container: 'bg-emerald-50/70 dark:bg-emerald-900/15 border-emerald-200/60 dark:border-emerald-800/40',
      title: 'text-emerald-800 dark:text-emerald-200',
      text: 'text-emerald-600/90 dark:text-emerald-300/90',
      icon: '✓',
    },
    warning: {
      container: 'bg-amber-50/70 dark:bg-amber-900/15 border-amber-200/60 dark:border-amber-800/40',
      title: 'text-amber-800 dark:text-amber-200',
      text: 'text-amber-600/90 dark:text-amber-300/90',
      icon: '⚠️',
    },
    error: {
      container: 'bg-red-50/70 dark:bg-red-900/15 border-red-200/60 dark:border-red-800/40',
      title: 'text-red-800 dark:text-red-200',
      text: 'text-red-600/90 dark:text-red-300/90',
      icon: '✕',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={cn('relative p-4 border rounded-xl backdrop-blur-sm', styles.container, className)}>
      <div className="flex items-start">
        <span className="text-xl mr-3 flex-shrink-0">{styles.icon}</span>
        <div className="flex-1">
          {title && (
            <p className={cn('font-medium mb-1', styles.title)}>
              {title}
            </p>
          )}
          <div className={styles.text}>
            {children}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={cn('ml-3 flex-shrink-0 hover:opacity-60 transition-opacity', styles.text)}
            aria-label="Close"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
