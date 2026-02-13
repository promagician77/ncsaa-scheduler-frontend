/**
 * Reusable Tab component with gentle styling
 */

import React from 'react';
import { cn } from '@/app/lib/utils';

interface Tab {
  id: string;
  label: string;
  icon?: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn('inline-flex rounded-2xl glass p-1.5 shadow-sm', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300',
            activeTab === tab.id
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm shadow-amber-200/40'
              : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'
          )}
        >
          {tab.icon && <span className="mr-2">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

interface TabPanelProps {
  value: string;
  activeValue: string;
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({ value, activeValue, children, className }: TabPanelProps) {
  if (value !== activeValue) return null;

  return (
    <div className={cn('animate-in fade-in duration-300', className)}>
      {children}
    </div>
  );
}
