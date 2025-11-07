'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Search, Moon, Sun, Menu } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import NotificationBell from '../notification/NotificationBell';
import { useAuth } from '@/lib/hooks/useAuth';
import { useState } from 'react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left: Logo + Menu (mobile) */}
        <div className="flex items-center gap-4">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          
          <Link href="/feed" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-700 to-primary-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="hidden sm:block text-xl font-bold text-gray-900 dark:text-white">
              Campus Connect
            </span>
          </Link>
        </div>

        {/* Center: Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索群组、帖子、用户..."
              className="w-full h-10 pl-10 pr-4 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <NotificationBell />

              {/* User Avatar */}
              <Link href="/profile">
                <Avatar src={user?.profile?.avatar_url} size="md" />
              </Link>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm">登录</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
