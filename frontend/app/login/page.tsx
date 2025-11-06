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
import { useAuth } from '@/lib/hooks/useAuth';
import { handleApiError } from '@/lib/api';

const emailLoginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6个字符'),
});

const phoneLoginSchema = z.object({
  phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号'),
  code: z.string().length(6, '验证码为6位数字'),
});

type EmailLoginFormData = z.infer<typeof emailLoginSchema>;
type PhoneLoginFormData = z.infer<typeof phoneLoginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, login, phoneLogin, sendSmsCode, isLoggingIn, isSendingSms, loginError } = useAuth();
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [countdown, setCountdown] = useState(0);

  const emailForm = useForm<EmailLoginFormData>({
    resolver: zodResolver(emailLoginSchema),
  });

  const phoneForm = useForm<PhoneLoginFormData>({
    resolver: zodResolver(phoneLoginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/feed');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const onEmailSubmit = (data: EmailLoginFormData) => {
    login(data);
  };

  const onPhoneSubmit = (data: PhoneLoginFormData) => {
    phoneLogin(data);
  };

  const handleSendCode = () => {
    const phone = phoneForm.getValues('phone');
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      phoneForm.setError('phone', { message: '请输入有效的手机号' });
      return;
    }
    sendSmsCode(phone);
    setCountdown(60);
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <Card className="w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-700 to-primary-500 items-center justify-center mb-4">
            <span className="text-white font-bold text-3xl">C</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            欢迎来到 Campus Connect
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            黑龙江省大学生社交与服务平台
          </p>
        </div>

        {/* Login Method Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setLoginMethod('email')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
              loginMethod === 'email'
                ? 'bg-primary-700 text-white'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}
          >
            <Mail className="h-4 w-4" />
            邮箱登录
          </button>
          <button
            onClick={() => setLoginMethod('phone')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
              loginMethod === 'phone'
                ? 'bg-primary-700 text-white'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}
          >
            <Phone className="h-4 w-4" />
            手机登录
          </button>
        </div>

        {/* Email Login Form */}
        {loginMethod === 'email' && (
          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
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
              placeholder="请输入密码"
              error={emailForm.formState.errors.password?.message}
              {...emailForm.register('password')}
            />
            {loginError && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {handleApiError(loginError)}
              </p>
            )}
            <Button type="submit" className="w-full" isLoading={isLoggingIn}>
              登录
            </Button>
          </form>
        )}

        {/* Phone Login Form */}
        {loginMethod === 'phone' && (
          <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
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
            {loginError && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {handleApiError(loginError)}
              </p>
            )}
            <Button type="submit" className="w-full" isLoading={isLoggingIn}>
              登录
            </Button>
          </form>
        )}

        {/* WeChat Login Placeholder */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                或
              </span>
            </div>
          </div>
          
          <Button
            variant="outline"
            className="w-full mt-4"
            disabled
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.5 12c-.83 0-1.5.67-1.5 1.5S7.67 15 8.5 15s1.5-.67 1.5-1.5S9.33 12 8.5 12zm7 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm3.5 3.5c0 2.5-2 4.5-4.5 4.5h-7C5 20 3 18 3 15.5 3 13 5 11 7.5 11h9c2.5 0 4.5 2 4.5 4.5z"/>
            </svg>
            微信登录 (即将开放)
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          还没有账号？
          <Link href="/register" className="text-primary-700 hover:underline ml-1">
            立即注册
          </Link>
        </p>
      </Card>
    </div>
  );
}
