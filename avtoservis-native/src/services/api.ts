import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { AuthTokens, ApiError, ApiResponse } from '../types';
import { useAuthStore } from '../store';

const API_BASE_URL = process.env.API_BASE_URL || 'https://localhost:7002/api';

class ApiClient {
  private client: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => this.requestInterceptor(config),
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => this.responseInterceptor(error)
    );
  }

  private async requestInterceptor(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
    const tokens = useAuthStore.getState().tokens;
    
    if (tokens && config.headers) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    
    return config;
  }

  private async responseInterceptor(error: AxiosError<ApiError>): Promise<any> {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (this.refreshPromise) {
        try {
          const newToken = await this.refreshPromise;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return this.client(originalRequest);
        } catch {
          return Promise.reject(error);
        }
      }

      originalRequest._retry = true;

      this.refreshPromise = this.refreshToken();
      
      try {
        const newToken = await this.refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return this.client(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        this.refreshPromise = null;
      }
    }

    return Promise.reject(error);
  }

  private async refreshToken(): Promise<string> {
    const tokens = useAuthStore.getState().tokens;
    
    if (!tokens?.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post<{ accessToken: string; refreshToken: string }>(
      `${API_BASE_URL}/auth/refresh`,
      { refreshToken: tokens.refreshToken }
    );

    const newTokens: AuthTokens = {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    };

    useAuthStore.getState().login(newTokens, useAuthStore.getState().user!);
    
    return newTokens.accessToken;
  }

  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, { params });
    return response.data.data as T;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data);
    return response.data.data as T;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data);
    return response.data.data as T;
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.patch<ApiResponse<T>>(url, data);
    return response.data.data as T;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url);
    return response.data.data as T;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
