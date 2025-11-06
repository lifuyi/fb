'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { authService } from '@/lib/services/auth.service';
import { handleApiError } from '@/lib/api';

const emailRegisterSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6个字符'),
  password_confirmation: z.string().min(6, '密码至少6个字符'),
  nickname: z.string().min(2, '昵称至少2个字符').max(50, '昵称最多50个字符'),
}).refine((data) => data.password === data.password_confirmation, {
  message: "两次输入的密码不一致",
  path: ["password_confirmation"],
});

const phoneRegisterSchema = z.object({
  phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号'),
  code: z.string().length(6, '验证码为6位数字'),
  nickname: z.string().min(2, '昵称至少2个字符').max(50, '昵称最多50个字符'),
});

type EmailRegisterFormData = z.infer<typeof emailRegisterSchema>;
type PhoneRegisterFormData = z.infer<typeof phoneRegisterSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [registerMethod, setRegisterMethod] = useState<'email' | 'phone'>('email');
  const [countdown, setCountdown] = useState(0);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const emailForm = useForm<EmailRegisterFormData>({
    resolver: zodResolver(emailRegisterSchema),
  });

  const phoneForm = useForm<PhoneRegisterFormData>({
    resolver: zodResolver(phoneRegisterSchema),
  });

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const onEmailSubmit = async (data: EmailRegisterFormData) => {
    try {
      setIsRegistering(true);
      setRegisterError(null);
      const response = await authService.emailRegister(
        data.email,
        data.password,
        data.password_confirmation,
        data.nickname
      );
      
      // Save token and user data
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Redirect to feed
      router.push('/feed');
    } catch (error) {
      setRegisterError(handleApiError(error));
    } finally {
      setIsRegistering(false);
    }
  };

  const onPhoneSubmit = async (data: PhoneRegisterFormData) => {
    try {
      setIsRegistering(true);
      setRegisterError(null);
      const response = await authService.phoneRegister(
        data.phone,
        data.code,
        data.nickname
      );
      
      // Save token and user data
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Redirect to feed
      router.push('/feed');
    } catch (error) {
      setRegisterError(handleApiError(error));
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSendCode = async () => {
    const phone = phoneForm.getValues('phone');
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      phoneForm.setError('phone', { message: '请输入有效的手机号' });
      return;
    }
    try {
      setIsSendingSms(true);
      await authService.sendSmsCode(phone);
      setCountdown(60);
    } catch (error) {
      setRegisterError(handleApiError(error));
    } finally {
      setIsSendingSms(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <Card className="w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-700 to-primary-500 items-center justify-center mb-4">
            <span className="text-white font-bold text-3xl">C</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            注册 Campus Connect
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            加入黑龙江省大学生社交与服务平台
          </p>
        </div>

        {/* Register Method Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setRegisterMethod('email')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
              registerMethod === 'email'
                ? 'bg-primary-700 text-white'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}
          >
            <Mail className="h-4 w-4" />
            邮箱注册
          </button>
          <button
            onClick={() => setRegisterMethod('phone')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
              registerMethod === 'phone'
                ? 'bg-primary-700 text-white'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}
          >
            <Phone className="h-4 w-4" />
            手机注册
          </button>
        </div>

        {/* Email Register Form */}
        {registerMethod === 'email' && (
          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
            <Input
              label="昵称"
              type="text"
              placeholder="请输入昵称"
              error={emailForm.formState.errors.nickname?.message}
              {...emailForm.register('nickname')}
            />
            <Input
              label="邮箱"
              type="email"
              placeholder="请输入邮箱"
              error={emailForm.formState.errors.email?.message}
              {...emailForm.register('email')}
            />
            <Input
              label="密码"
              type="password"
              placeholder="请输入密码（至少6个字符）"
              error={emailForm.formState.errors.password?.message}
              {...emailForm.register('password')}
            />
            <Input
              label="确认密码"
              type="password"
              placeholder="请再次输入密码"
              error={emailForm.formState.errors.password_confirmation?.message}
              {...emailForm.register('password_confirmation')}
            />
            {registerError && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {registerError}
              </p>
            )}
            <Button type="submit" className="w-full" isLoading={isRegistering}>
              注册
            </Button>
          </form>
        )}

        {/* Phone Register Form */}
        {registerMethod === 'phone' && (
          <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
            <Input
              label="昵称"
              type="text"
              placeholder="请输入昵称"
              error={phoneForm.formState.errors.nickname?.message}
              {...phoneForm.register('nickname')}
            />
            <Input
              label="手机号"
              type="tel"
              placeholder="请输入手机号"
              error={phoneForm.formState.errors.phone?.message}
              {...phoneForm.register('phone')}
            />
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  label="验证码"
                  placeholder="请输入验证码"
                  error={phoneForm.formState.errors.code?.message}
                  {...phoneForm.register('code')}
                />
              </div>
              <div className="pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSendCode}
                  disabled={countdown > 0 || isSendingSms}
                  isLoading={isSendingSms}
                >
                  {countdown > 0 ? `${countdown}s` : '发送验证码'}
                </Button>
              </div>
            </div>
            {registerError && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {registerError}
              </p>
            )}
            <Button type="submit" className="w-full" isLoading={isRegistering}>
              注册
            </Button>
          </form>
        )}

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          已有账号？
          <Link href="/login" className="text-primary-700 hover:underline ml-1">
            立即登录
          </Link>
        </p>
      </Card>
    </div>
  );
}
