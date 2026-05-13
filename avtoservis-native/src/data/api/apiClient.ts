import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { ApiError } from '@shared/types';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

class ApiClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: Error) => void;
  }> = [];

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://api.avtoserv.com',
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - добавляет JWT токен
    this.instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - обрабатывает 401 и refresh токен
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // Если ошибка 401 и запрос ещё не повторялся
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return this.instance(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
            if (!refreshToken) {
              throw new Error('No refresh token');
            }

            const response = await axios.post(`${this.instance.defaults.baseURL}/api/auth/refresh`, {
              refreshToken,
            });

            const { token: newToken, refreshToken: newRefreshToken } = response.data;

            await SecureStore.setItemAsync(TOKEN_KEY, newToken);
            await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, newRefreshToken);

            this.processQueue(null, newToken);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }

            return this.instance(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError as Error, null);
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
            
            // Dispatch event for auth state change
            if (Platform.OS !== 'web') {
              // В реальном приложении здесь будет навигация на экран логина
              console.log('Session expired, redirect to login');
            }
            
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(this.mapError(error));
      }
    );
  }

  private processQueue(error: Error | null, token: string | null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else if (token) {
        prom.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  private mapError(error: AxiosError<ApiError>): Error {
    if (error.response?.data?.error) {
      const apiError = error.response.data.error;
      const mappedMessage = this.mapErrorCodeToMessage(apiError.code);
      return new Error(mappedMessage || apiError.message || 'Произошла ошибка');
    }

    if (error.code === 'ECONNABORTED') {
      return new Error('Превышено время ожидания ответа от сервера');
    }

    if (error.code === 'NETWORK_ERROR' || !error.response) {
      return new Error('Нет подключения к интернету. Проверьте соединение.');
    }

    return new Error('Произошла непредвиденная ошибка. Попробуйте ещё раз.');
  }

  private mapErrorCodeToMessage(code: string): string | null {
    const errorMap: Record<string, string> = {
      'VALIDATION_ERROR': 'Проверьте правильность заполнения полей',
      'NOT_FOUND': 'Запрашиваемый ресурс не найден',
      'UNAUTHORIZED': 'Сессия истекла. Войдите заново',
      'FORBIDDEN': 'У вас нет доступа к этому ресурсу',
      'CONFLICT': 'Конфликт данных. Обновите страницу.',
      'SERVER_ERROR': 'Сервер временно недоступен. Попробуйте позже',
      'NETWORK_ERROR': 'Проверьте подключение к интернету',
      'AUTH_INVALID_CREDENTIALS': 'Неверный email или пароль',
      'AUTH_ACCOUNT_LOCKED': 'Аккаунт заблокирован. Обратитесь в поддержку',
      'AUTH_EMAIL_NOT_CONFIRMED': 'Подтвердите email для продолжения',
      'CONFLICT_CAR_HAS_APPOINTMENTS': 'Нельзя удалить автомобиль с активными записями',
    };

    return errorMap[code] || null;
  }

  getInstance(): AxiosInstance {
    return this.instance;
  }
}

// Singleton instance
export const apiClient = new ApiClient().getInstance();
export default apiClient;
