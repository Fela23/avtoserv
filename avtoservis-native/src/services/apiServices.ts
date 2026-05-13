import apiClient from './api';
import { 
  User, 
  Car, 
  ServiceAppointment, 
  Service, 
  Tender, 
  Offer, 
  Message, 
  Conversation,
  Notification,
  LoginRequest,
  RegisterRequest,
  AuthTokens,
  PaginatedResponse 
} from '../types';

// Auth Services
export const authService = {
  login: async (data: LoginRequest): Promise<{ tokens: AuthTokens; user: User }> => {
    return apiClient.post('/auth/login', data);
  },

  register: async (data: RegisterRequest): Promise<{ tokens: AuthTokens; user: User }> => {
    return apiClient.post('/auth/register', data);
  },

  logout: async (): Promise<void> => {
    return apiClient.post('/auth/logout');
  },

  refreshToken: async (): Promise<AuthTokens> => {
    return apiClient.post('/auth/refresh');
  },

  getProfile: async (): Promise<User> => {
    return apiClient.get('/auth/profile');
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    return apiClient.put('/auth/profile', data);
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    return apiClient.post('/auth/change-password', { oldPassword, newPassword });
  },
};

// Car Services
export const carService = {
  getAll: async (): Promise<Car[]> => {
    return apiClient.get('/cars');
  },

  getById: async (id: string): Promise<Car> => {
    return apiClient.get(`/cars/${id}`);
  },

  create: async (data: Omit<Car, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Car> => {
    return apiClient.post('/cars', data);
  },

  update: async (id: string, data: Partial<Car>): Promise<Car> => {
    return apiClient.put(`/cars/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/cars/${id}`);
  },
};

// Appointment Services
export const appointmentService = {
  getAll: async (params?: { status?: string; page?: number; pageSize?: number }): Promise<PaginatedResponse<ServiceAppointment>> => {
    return apiClient.get('/appointments', params);
  },

  getById: async (id: string): Promise<ServiceAppointment> => {
    return apiClient.get(`/appointments/${id}`);
  },

  create: async (data: Omit<ServiceAppointment, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ServiceAppointment> => {
    return apiClient.post('/appointments', data);
  },

  update: async (id: string, data: Partial<ServiceAppointment>): Promise<ServiceAppointment> => {
    return apiClient.put(`/appointments/${id}`, data);
  },

  cancel: async (id: string): Promise<ServiceAppointment> => {
    return apiClient.patch(`/appointments/${id}/cancel`);
  },

  confirm: async (id: string): Promise<ServiceAppointment> => {
    return apiClient.patch(`/appointments/${id}/confirm`);
  },
};

// Service Catalog
export const serviceCatalogService = {
  getAll: async (): Promise<Service[]> => {
    return apiClient.get('/services');
  },

  getById: async (id: string): Promise<Service> => {
    return apiClient.get(`/services/${id}`);
  },

  getByCategory: async (category: string): Promise<Service[]> => {
    return apiClient.get('/services', { category });
  },
};

// Tender Services
export const tenderService = {
  getAll: async (params?: { status?: string; page?: number; pageSize?: number }): Promise<PaginatedResponse<Tender>> => {
    return apiClient.get('/tenders', params);
  },

  getById: async (id: string): Promise<Tender> => {
    return apiClient.get(`/tenders/${id}`);
  },

  create: async (data: Omit<Tender, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'offers'>): Promise<Tender> => {
    return apiClient.post('/tenders', data);
  },

  update: async (id: string, data: Partial<Tender>): Promise<Tender> => {
    return apiClient.put(`/tenders/${id}`, data);
  },

  cancel: async (id: string): Promise<void> => {
    return apiClient.patch(`/tenders/${id}/cancel`);
  },

  getOffers: async (tenderId: string): Promise<Offer[]> => {
    return apiClient.get(`/tenders/${tenderId}/offers`);
  },

  acceptOffer: async (offerId: string): Promise<void> => {
    return apiClient.patch(`/offers/${offerId}/accept`);
  },

  rejectOffer: async (offerId: string): Promise<void> => {
    return apiClient.patch(`/offers/${offerId}/reject`);
  },
};

// Chat Services
export const chatService = {
  getConversations: async (): Promise<Conversation[]> => {
    return apiClient.get('/chat/conversations');
  },

  getConversationById: async (id: string): Promise<Conversation> => {
    return apiClient.get(`/chat/conversations/${id}`);
  },

  getMessages: async (conversationId: string, page?: number, pageSize?: number): Promise<PaginatedResponse<Message>> => {
    return apiClient.get(`/chat/conversations/${conversationId}/messages`, { page, pageSize });
  },

  sendMessage: async (conversationId: string, content: string): Promise<Message> => {
    return apiClient.post(`/chat/conversations/${conversationId}/messages`, { content });
  },

  markAsRead: async (conversationId: string): Promise<void> => {
    return apiClient.patch(`/chat/conversations/${conversationId}/read`);
  },
};

// Notification Services
export const notificationService = {
  getAll: async (params?: { page?: number; pageSize?: number }): Promise<PaginatedResponse<Notification>> => {
    return apiClient.get('/notifications', params);
  },

  markAsRead: async (id: string): Promise<void> => {
    return apiClient.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    return apiClient.patch('/notifications/read-all');
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/notifications/${id}`);
  },
};
