'use client';

import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  showRightSidebar?: boolean;
}

export default function MainLayout({ children, showRightSidebar = true }: MainLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header onMenuClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />
      
      <div className="container mx-auto">
        <div className="flex">
          {/* Left Sidebar - Desktop */}
          <div className="hidden lg:block w-64 sticky top-16 h-[calc(100vh-4rem)]">
            <Sidebar />
          </div>

          {/* Mobile Sidebar Overlay */}
          {isMobileSidebarOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setIsMobileSidebarOpen(false)}
              />
              <div className="fixed left-0 top-16 bottom-0 w-64 z-50 lg:hidden animate-slide-in">
                <Sidebar />
              </div>
            </>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0 px-4 py-6">
            <div className={cn('max-w-2xl mx-auto', !showRightSidebar && 'max-w-4xl')}>
              {children}
            </div>
          </main>

          {/* Right Sidebar - Desktop */}
          {showRightSidebar && (
            <div className="hidden xl:block sticky top-16 h-[calc(100vh-4rem)] py-6">
              <RightSidebar />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
