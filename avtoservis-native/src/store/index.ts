import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Car, AuthTokens, Notification } from '../types';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (tokens: AuthTokens, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: true,
      login: (tokens, user) => set({ 
        tokens, 
        user, 
        isAuthenticated: true,
        isLoading: false 
      }),
      logout: () => set({ 
        user: null, 
        tokens: null, 
        isAuthenticated: false,
        isLoading: false 
      }),
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null
      })),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        user: state.user, 
        tokens: state.tokens, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

interface AppState {
  cars: Car[];
  notifications: Notification[];
  unreadNotificationsCount: number;
  selectedCarId: string | null;
  setCars: (cars: Car[]) => void;
  addCar: (car: Car) => void;
  updateCar: (id: string, car: Partial<Car>) => void;
  removeCar: (id: string) => void;
  setSelectedCarId: (id: string | null) => void;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      cars: [],
      notifications: [],
      unreadNotificationsCount: 0,
      selectedCarId: null,
      setCars: (cars) => set({ cars }),
      addCar: (car) => set((state) => ({ cars: [...state.cars, car] })),
      updateCar: (id, carData) => set((state) => ({
        cars: state.cars.map((c) => (c.id === id ? { ...c, ...carData } : c))
      })),
      removeCar: (id) => set((state) => ({
        cars: state.cars.filter((c) => c.id !== id)
      })),
      setSelectedCarId: (id) => set({ selectedCarId: id }),
      setNotifications: (notifications) => set({ 
        notifications,
        unreadNotificationsCount: notifications.filter(n => !n.isRead).length
      }),
      addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications],
        unreadNotificationsCount: state.unreadNotificationsCount + 1
      })),
      markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        ),
        unreadNotificationsCount: Math.max(0, state.unreadNotificationsCount - 1)
      })),
      markAllNotificationsAsRead: () => set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadNotificationsCount: 0
      })),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        cars: state.cars,
        selectedCarId: state.selectedCarId,
      }),
    }
  )
);

interface UIState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
