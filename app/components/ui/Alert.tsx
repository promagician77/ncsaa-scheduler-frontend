/**
 * Reusable Alert component for errors and notifications
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
      container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      title: 'text-blue-800 dark:text-blue-200',
      text: 'text-blue-600 dark:text-blue-300',
      icon: '💡',
    },
    success: {
      container: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      title: 'text-green-800 dark:text-green-200',
      text: 'text-green-600 dark:text-green-300',
      icon: '✓',
    },
    warning: {
      container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      title: 'text-yellow-800 dark:text-yellow-200',
      text: 'text-yellow-600 dark:text-yellow-300',
      icon: '⚠️',
    },
    error: {
      container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
      title: 'text-red-800 dark:text-red-200',
      text: 'text-red-600 dark:text-red-300',
      icon: '✕',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={cn('relative p-4 border rounded-lg', styles.container, className)}>
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
            className={cn('ml-3 flex-shrink-0 hover:opacity-70', styles.text)}
            aria-label="Close"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
