import { create } from 'zustand';
import { User, AuthTokens } from '@shared/types';
import { tokenStorage, refreshTokenStorage, userStorage, clearAllStorage } from '@data/storage/tokenStorage';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (tokens: AuthTokens, user: User) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  clearError: () => void;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (tokens, user) => {
    try {
      tokenStorage.setToken(tokens.token);
      refreshTokenStorage.setRefreshToken(tokens.refreshToken);
      userStorage.setUser(JSON.stringify(user));
      
      set({
        user,
        isAuthenticated: true,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: 'Ошибка при сохранении данных входа',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      tokenStorage.deleteToken();
      refreshTokenStorage.deleteRefreshToken();
      userStorage.deleteUser();
      clearAllStorage();
      
      set({
        user: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  setUser: (user) => {
    userStorage.setUser(JSON.stringify(user));
    set({ user });
  },

  clearError: () => {
    set({ error: null });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    
    try {
      const token = tokenStorage.getToken();
      const storedUser = userStorage.getUser();
      
      if (!token || !storedUser) {
        set({ 
          isAuthenticated: false, 
          user: null, 
          isLoading: false 
        });
        return false;
      }
      
      const user = JSON.parse(storedUser) as User;
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      return true;
    } catch (error) {
      console.error('Auth check error:', error);
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
      return false;
    }
  },
}));

// Selectors
export const selectCurrentUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectIsLoading = (state: AuthState) => state.isLoading;
export const selectAuthError = (state: AuthState) => state.error;
