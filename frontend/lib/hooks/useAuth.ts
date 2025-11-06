import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth.store';
import { authService } from '../services/auth.service';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const { user, token, isAuthenticated, login, logout: logoutStore } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getCurrentUser,
    enabled: isAuthenticated && !!token,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return authService.emailLogin(credentials.email, credentials.password);
    },
    onSuccess: (data) => {
      login(data.user, data.token);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      router.push('/feed');
    },
  });

  const phoneLoginMutation = useMutation({
    mutationFn: async (credentials: { phone: string; code: string }) => {
      return authService.phoneLogin(credentials.phone, credentials.code);
    },
    onSuccess: (data) => {
      login(data.user, data.token);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      router.push('/feed');
    },
  });

  const sendSmsCodeMutation = useMutation({
    mutationFn: (phone: string) => authService.sendSmsCode(phone),
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
      router.push('/login');
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (data) => {
      useAuthStore.getState().setUser(data);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  return {
    user: currentUser || user,
    isAuthenticated,
    isLoading,
    login: loginMutation.mutate,
    phoneLogin: phoneLoginMutation.mutate,
    sendSmsCode: sendSmsCodeMutation.mutate,
    logout: logoutMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    isLoggingIn: loginMutation.isPending || phoneLoginMutation.isPending,
    isSendingSms: sendSmsCodeMutation.isPending,
    loginError: loginMutation.error || phoneLoginMutation.error,
  };
}
