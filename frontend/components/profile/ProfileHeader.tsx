import { useState } from 'react';
import { User, MapPin, Calendar, Briefcase, Award, UserPlus, UserMinus } from 'lucide-react';
import { ProfileData } from '@/lib/types';
import Button from '@/components/ui/Button';
import { useFollowStatus } from '@/lib/hooks/useFollow';

interface ProfileHeaderProps {
  profile: ProfileData;
  isOwnProfile: boolean;
  onEdit?: () => void;
}

export default function ProfileHeader({ profile, isOwnProfile, onEdit }: ProfileHeaderProps) {
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const { isFollowing, toggleFollow } = useFollowStatus(profile.user.id);

  const handleFollowClick = async () => {
    setIsFollowLoading(true);
    try {
      await toggleFollow();
    } catch (err: any) {
      alert(err.message || '操作失败');
    } finally {
      setIsFollowLoading(false);
    }
  };
  const { user, stats } = profile;
  const userProfile = user.profile;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Cover Image */}
      <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-800"></div>

      <div className="px-6 pb-6">
        {/* Avatar and Basic Info */}
        <div className="flex items-start -mt-16 mb-4">
          <div className="relative">
            {userProfile?.avatar_url ? (
              <img
                src={userProfile.avatar_url}
                alt={userProfile.nickname || 'User'}
                className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <User className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>

          <div className="ml-6 flex-1 mt-16">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userProfile?.nickname || 'User'}
                </h1>
                {userProfile?.major && (
                  <p className="text-gray-600 dark:text-gray-400 flex items-center mt-1">
                    <Briefcase className="w-4 h-4 mr-1" />
                    {userProfile.major}
                  </p>
                )}
              </div>

              {isOwnProfile ? (
                <Button onClick={onEdit} variant="outline">
                  编辑资料
                </Button>
              ) : (
                <Button 
                  onClick={handleFollowClick} 
                  disabled={isFollowLoading}
                  variant={isFollowing ? 'outline' : 'primary'}
                >
                  {isFollowLoading ? (
                    '处理中...'
                  ) : isFollowing ? (
                    <>
                      <UserMinus className="w-4 h-4 mr-1" />
                      取消关注
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-1" />
                      关注
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {userProfile?.bio && (
          <p className="text-gray-700 dark:text-gray-300 mb-4">{userProfile.bio}</p>
        )}

        {/* Info Row */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          {userProfile?.university && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {userProfile.university.name}
            </div>
          )}

          {userProfile?.graduation_year && (
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {userProfile.graduation_year}届
            </div>
          )}

          {userProfile?.birth_year && (
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              {new Date().getFullYear() - userProfile.birth_year}岁
            </div>
          )}
        </div>

        {/* Skills */}
        {userProfile?.skills && userProfile.skills.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Award className="w-4 h-4 mr-1 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">技能</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {userProfile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex gap-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.posts_count}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">帖子</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.groups_count}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">群组</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.followers_count}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">关注者</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.following_count}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">关注中</div>
          </div>
        </div>
      </div>
    </div>
  );
}
