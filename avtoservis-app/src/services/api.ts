import axios, { AxiosInstance, AxiosError } from 'axios';
import type { ApiError, AuthTokens } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private client: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest?.headers['X-Retry-Refresh']) {
          if (this.refreshPromise) {
            try {
              const newToken = await this.refreshPromise;
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client.request(originalRequest);
            } catch {
              this.handleAuthFailure();
              return Promise.reject(error);
            }
          }

          originalRequest.headers['X-Retry-Refresh'] = 'true';

          try {
            this.refreshPromise = this.refreshToken();
            const newToken = await this.refreshPromise;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client.request(originalRequest);
          } catch {
            this.handleAuthFailure();
            return Promise.reject(error);
          } finally {
            this.refreshPromise = null;
          }
        }

        return Promise.reject(this.formatError(error));
      }
    );
  }

  private getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  private saveTokens(tokens: AuthTokens): void {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  private async refreshToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post<{ tokens: AuthTokens }>(
      `${API_BASE_URL}/auth/refresh`,
      { refreshToken }
    );

    this.saveTokens(response.data.tokens);
    return response.data.tokens.accessToken;
  }

  private handleAuthFailure(): void {
    this.clearTokens();
    window.location.href = '/login';
  }

  private formatError(error: AxiosError<ApiError>): ApiError {
    if (error.response?.data) {
      return {
        statusCode: error.response.data.statusCode || error.response.status,
        message: error.response.data.message || 'An error occurred',
        details: error.response.data.details,
      };
    }

    return {
      statusCode: error.code ? 0 : 500,
      message: error.message || 'Network error',
    };
  }

  public setAuthToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  public clearAuthToken(): void {
    this.clearTokens();
  }

  public getClient(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient();
export default apiClient.getClient();
