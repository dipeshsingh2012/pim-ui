import React from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  activeTab?: 'products' | 'lanes';
  onSelectTab?: (tab: 'products' | 'lanes') => void;
}

export function Layout({ children, activeTab, onSelectTab }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header activeTab={activeTab} onSelectTab={onSelectTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
