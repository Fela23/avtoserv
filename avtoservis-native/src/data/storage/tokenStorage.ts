import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export const tokenStorage = {
  setToken: (token: string): void => {
    storage.set('auth_token', token);
  },
  getToken: (): string | undefined => {
    return storage.getString('auth_token');
  },
  deleteToken: (): void => {
    storage.delete('auth_token');
  },
};

export const refreshTokenStorage = {
  setRefreshToken: (refreshToken: string): void => {
    storage.set('refresh_token', refreshToken);
  },
  getRefreshToken: (): string | undefined => {
    return storage.getString('refresh_token');
  },
  deleteRefreshToken: (): void => {
    storage.delete('refresh_token');
  },
};

export const userStorage = {
  setUser: (userJson: string): void => {
    storage.set('user_data', userJson);
  },
  getUser: (): string | undefined => {
    return storage.getString('user_data');
  },
  deleteUser: (): void => {
    storage.delete('user_data');
  },
};

export const settingsStorage = {
  setTheme: (theme: 'light' | 'dark' | 'system'): void => {
    storage.set('theme_preference', theme);
  },
  getTheme: (): 'light' | 'dark' | 'system' | undefined => {
    const value = storage.getString('theme_preference');
    if (value === 'light' || value === 'dark' || value === 'system') {
      return value;
    }
    return undefined;
  },
  setBiometricsEnabled: (enabled: boolean): void => {
    storage.set('biometrics_enabled', enabled);
  },
  isBiometricsEnabled: (): boolean => {
    return storage.getBoolean('biometrics_enabled') || false;
  },
};

export const clearAllStorage = (): void => {
  storage.clearAll();
};

export default storage;
