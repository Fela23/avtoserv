import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { apiClient } from '@data/api/apiClient';
import { AuthTokens, User, LoginCredentials, RegisterData, ApiError } from '@shared/types';
import { useAuthStore } from '@domain/repositories/AuthRepository';

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

interface RegisterResponse {
  message: string;
}

export const useLogin = (): UseMutationResult<
  LoginResponse,
  Error,
  LoginCredentials
> => {
  const { login } = useAuthStore();

  return useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: async (credentials: LoginCredentials): Promise<LoginResponse> => {
      const response = await apiClient.post<LoginResponse>('/api/auth/login', credentials);
      return response.data;
    },
    onSuccess: async (data) => {
      await login(
        { token: data.token, refreshToken: data.refreshToken },
        data.user
      );
    },
  });
};

export const useRegister = (): UseMutationResult<
  RegisterResponse,
  Error,
  RegisterData
> => {
  return useMutation({
    mutationKey: ['auth', 'register'],
    mutationFn: async (data: RegisterData): Promise<RegisterResponse> => {
      const response = await apiClient.post<RegisterResponse>('/api/auth/register', data);
      return response.data;
    },
  });
};

export const useLogout = (): UseMutationResult<void, Error, void> => {
  const { logout } = useAuthStore();

  return useMutation({
    mutationKey: ['auth', 'logout'],
    mutationFn: async (): Promise<void> => {
      try {
        await apiClient.post('/api/auth/logout');
      } catch (error) {
        console.error('Logout API error:', error);
      } finally {
        await logout();
      }
    },
  });
};

export const useForgotPassword = (): UseMutationResult<
  { message: string },
  Error,
  { email: string }
> => {
  return useMutation({
    mutationKey: ['auth', 'forgot-password'],
    mutationFn: async ({ email }: { email: string }): Promise<{ message: string }> => {
      const response = await apiClient.post('/api/auth/forgot-password', { email });
      return response.data;
    },
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationKey: ['auth', 'refresh'],
    mutationFn: async (refreshToken: string): Promise<LoginResponse> => {
      const response = await apiClient.post('/api/auth/refresh', { refreshToken });
      return response.data;
    },
  });
};
