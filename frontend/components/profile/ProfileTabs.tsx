import { useState } from 'react';
import { FileText, Users } from 'lucide-react';

interface ProfileTabsProps {
  activeTab: 'posts' | 'groups';
  onTabChange: (tab: 'posts' | 'groups') => void;
}

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  const tabs = [
    { id: 'posts' as const, label: '帖子', icon: FileText },
    { id: 'groups' as const, label: '群组', icon: Users },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                isActive
                  ? 'text-primary-700 dark:text-primary-400 border-b-2 border-primary-700 dark:border-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
