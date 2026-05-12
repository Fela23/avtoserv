import { create } from 'zustand';
import type { User, AuthTokens, Car, Appointment, Tender, Notification, Chat } from '@/types';
import { authService, carService, appointmentService, tenderService, notificationService, chatService } from '@/services/apiServices';
import { signalRService } from '@/services/signalR';

interface AppState {
  // Auth State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Data State
  cars: Car[];
  appointments: Appointment[];
  tenders: Tender[];
  notifications: Notification[];
  chats: Chat[];

  // UI State
  isSidebarOpen: boolean;
  activeTab: string;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  
  fetchCars: () => Promise<void>;
  fetchAppointments: () => Promise<void>;
  fetchTenders: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  fetchChats: () => Promise<void>;

  toggleSidebar: () => void;
  setActiveTab: (tab: string) => void;
  clearError: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial State
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  cars: [],
  appointments: [],
  tenders: [],
  notifications: [],
  chats: [],
  isSidebarOpen: true,
  activeTab: 'dashboard',

  // Auth Actions
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { user, tokens } = await authService.login({ email, password });
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      
      if (tokens.accessToken) {
        await signalRService.startConnection(tokens.accessToken);
      }
      
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Login failed', 
        isLoading: false 
      });
      throw error;
    }
  },

  register: async (email: string, password: string, firstName: string, lastName: string, phone: string) => {
    set({ isLoading: true, error: null });
    try {
      const { user, tokens } = await authService.register({ 
        email, 
        password, 
        firstName, 
        lastName, 
        phone 
      });
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      
      if (tokens.accessToken) {
        await signalRService.startConnection(tokens.accessToken);
      }
      
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Registration failed', 
        isLoading: false 
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore logout errors
    } finally {
      await signalRService.stopConnection();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({ 
        user: null, 
        isAuthenticated: false, 
        cars: [], 
        appointments: [], 
        tenders: [],
        notifications: [],
        chats: []
      });
    }
  },

  loadUser: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return;
    }

    set({ isLoading: true });
    try {
      const user = await authService.getCurrentUser();
      
      await signalRService.startConnection(token);
      
      set({ user, isAuthenticated: true, isLoading: false });
      
      // Load initial data
      get().fetchCars();
      get().fetchAppointments();
      get().fetchTenders();
      get().fetchNotifications();
      get().fetchChats();
    } catch (error) {
      console.error('Failed to load user:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({ isLoading: false });
    }
  },

  // Data Fetching Actions
  fetchCars: async () => {
    try {
      const cars = await carService.getCars();
      set({ cars });
    } catch (error) {
      console.error('Failed to fetch cars:', error);
    }
  },

  fetchAppointments: async () => {
    try {
      const appointments = await appointmentService.getAppointments();
      set({ appointments });
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    }
  },

  fetchTenders: async () => {
    try {
      const tenders = await tenderService.getTenders();
      set({ tenders });
    } catch (error) {
      console.error('Failed to fetch tenders:', error);
    }
  },

  fetchNotifications: async () => {
    try {
      const notifications = await notificationService.getNotifications();
      set({ notifications });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  },

  fetchChats: async () => {
    try {
      const chats = await chatService.getChats();
      set({ chats });
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    }
  },

  // UI Actions
  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },

  setActiveTab: (tab: string) => {
    set({ activeTab: tab });
  },

  clearError: () => {
    set({ error: null });
  },
}));
