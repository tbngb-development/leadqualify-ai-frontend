// src/app/(admin)/layout.tsx

import { AdminSidebar } from '@/components/layout/AdminSidebar';
import type { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-surface-muted overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <header className="h-14 border-b border-surface-border bg-surface flex items-center px-5 shrink-0">
          <h1 className="text-base font-semibold text-text-primary">
            Admin Control Panel
          </h1>
        </header>
        <main className="flex-1 overflow-y-auto thin-scrollbar p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}