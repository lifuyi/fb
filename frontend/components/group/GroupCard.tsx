'use client';

import Link from 'next/link';
import { Users, Lock, Globe } from 'lucide-react';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { Group } from '@/lib/types';
import { useGroups } from '@/lib/hooks/useGroups';

interface GroupCardProps {
  group: Group;
}

export default function GroupCard({ group }: GroupCardProps) {
  const { joinGroup, leaveGroup } = useGroups();

  const handleToggleMembership = () => {
    if (group.is_member) {
      if (confirm('确定要退出这个群组吗？')) {
        leaveGroup(group.id);
      }
    } else {
      joinGroup(group.id);
    }
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <Link href={`/groups/${group.id}`}>
        <div className="flex items-start gap-3 mb-3">
          <Avatar src={group.avatar} size="lg" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white hover:text-primary-700 dark:hover:text-primary-400 transition-colors line-clamp-1">
              {group.name}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
              {group.type === 'private' ? (
                <Lock className="h-4 w-4" />
              ) : (
                <Globe className="h-4 w-4" />
              )}
              <span>{group.type === 'private' ? '私密群组' : '公开群组'}</span>
              <span>·</span>
              <Users className="h-4 w-4" />
              <span>{group.member_count} 成员</span>
            </div>
          </div>
        </div>
      </Link>

      {group.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {group.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        {group.member_role && (
          <span className="text-xs px-2 py-1 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400">
            {group.member_role === 'owner' ? '群主' : group.member_role === 'admin' ? '管理员' : '成员'}
          </span>
        )}
        
        <Button
          variant={group.is_member ? 'outline' : 'primary'}
          size="sm"
          onClick={handleToggleMembership}
          className="ml-auto"
        >
          {group.is_member ? '已加入' : '加入群组'}
        </Button>
      </div>
    </Card>
  );
}
