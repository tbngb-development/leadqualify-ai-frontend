// src/app/(dashboard)/layout.tsx

import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import type { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-surface-muted overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto thin-scrollbar p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}