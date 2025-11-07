import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { UpdateProfileData, UserProfile } from '@/lib/types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | undefined;
  onSave: (data: UpdateProfileData) => Promise<void>;
}

export default function EditProfileModal({ isOpen, onClose, profile, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState<UpdateProfileData>({
    nickname: '',
    bio: '',
    gender: 0,
    birth_year: undefined,
    major: '',
    graduation_year: undefined,
    skills: [],
  });
  const [skillInput, setSkillInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        nickname: profile.nickname || '',
        bio: profile.bio || '',
        gender: profile.gender || 0,
        birth_year: profile.birth_year,
        major: profile.major || '',
        graduation_year: profile.graduation_year,
        skills: profile.skills || [],
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || '更新失败');
    } finally {
      setIsLoading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills?.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...(formData.skills || []), skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills?.filter((s) => s !== skill) || [],
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="编辑资料">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <Input
          label="昵称"
          value={formData.nickname}
          onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
          placeholder="请输入昵称"
        />

        <Textarea
          label="个人简介"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="介绍一下自己..."
          rows={3}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            性别
          </label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value={0}>未知</option>
            <option value={1}>男</option>
            <option value={2}>女</option>
          </select>
        </div>

        <Input
          label="出生年份"
          type="number"
          value={formData.birth_year || ''}
          onChange={(e) => setFormData({ ...formData, birth_year: e.target.value ? parseInt(e.target.value) : undefined })}
          placeholder="例如: 2000"
        />

        <Input
          label="专业"
          value={formData.major}
          onChange={(e) => setFormData({ ...formData, major: e.target.value })}
          placeholder="请输入专业"
        />

        <Input
          label="毕业年份"
          type="number"
          value={formData.graduation_year || ''}
          onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value ? parseInt(e.target.value) : undefined })}
          placeholder="例如: 2024"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            技能标签
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="输入技能后按回车添加"
            />
            <Button type="button" onClick={addSkill} variant="outline">
              添加
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills?.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm flex items-center gap-1"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" onClick={onClose} variant="outline" disabled={isLoading}>
            取消
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? '保存中...' : '保存'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
