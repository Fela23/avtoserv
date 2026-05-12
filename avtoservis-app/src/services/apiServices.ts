import api from './api';
import type { User, AuthTokens, Car, Appointment, ServiceType, Tender, Chat, Notification } from '@/types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

class AuthService {
  async login(request: LoginRequest): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await api.post<{ user: User; tokens: AuthTokens }>('/auth/login', request);
    return response.data;
  }

  async register(request: RegisterRequest): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await api.post<{ user: User; tokens: AuthTokens }>('/auth/register', request);
    return response.data;
  }

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  }

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/profile');
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put<User>('/profile', data);
    return response.data;
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await api.post('/auth/change-password', { oldPassword, newPassword });
  }
}

class CarService {
  async getCars(): Promise<Car[]> {
    const response = await api.get<Car[]>('/cars');
    return response.data;
  }

  async getCar(id: string): Promise<Car> {
    const response = await api.get<Car>(`/cars/${id}`);
    return response.data;
  }

  async createCar(data: Omit<Car, 'id' | 'userId' | 'serviceHistory'>): Promise<Car> {
    const response = await api.post<Car>('/cars', data);
    return response.data;
  }

  async updateCar(id: string, data: Partial<Car>): Promise<Car> {
    const response = await api.put<Car>(`/cars/${id}`, data);
    return response.data;
  }

  async deleteCar(id: string): Promise<void> {
    await api.delete(`/cars/${id}`);
  }

  async getServiceHistory(carId: string): Promise<Car['serviceHistory']> {
    const response = await api.get<Car['serviceHistory']>(`/cars/${carId}/history`);
    return response.data;
  }
}

class AppointmentService {
  async getAppointments(): Promise<Appointment[]> {
    const response = await api.get<Appointment[]>('/appointments');
    return response.data;
  }

  async getAppointment(id: string): Promise<Appointment> {
    const response = await api.get<Appointment>(`/appointments/${id}`);
    return response.data;
  }

  async createAppointment(data: Omit<Appointment, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Appointment> {
    const response = await api.post<Appointment>('/appointments', data);
    return response.data;
  }

  async updateAppointment(id: string, data: Partial<Appointment>): Promise<Appointment> {
    const response = await api.put<Appointment>(`/appointments/${id}`, data);
    return response.data;
  }

  async cancelAppointment(id: string): Promise<Appointment> {
    const response = await api.post<Appointment>(`/appointments/${id}/cancel`);
    return response.data;
  }

  async getServiceTypes(): Promise<ServiceType[]> {
    const response = await api.get<ServiceType[]>('/services/types');
    return response.data;
  }

  async getAvailableSlots(serviceTypeId: string, date: string): Promise<string[]> {
    const response = await api.get<string[]>('/appointments/slots', {
      params: { serviceTypeId, date }
    });
    return response.data;
  }
}

class TenderService {
  async getTenders(): Promise<Tender[]> {
    const response = await api.get<Tender[]>('/tenders');
    return response.data;
  }

  async getTender(id: string): Promise<Tender> {
    const response = await api.get<Tender>(`/tenders/${id}`);
    return response.data;
  }

  async createTender(data: Omit<Tender, 'id' | 'status' | 'offers' | 'createdAt'>): Promise<Tender> {
    const response = await api.post<Tender>('/tenders', data);
    return response.data;
  }

  async submitOffer(tenderId: string, price: number, estimatedDays: number, message: string): Promise<void> {
    await api.post(`/tenders/${tenderId}/offers`, { price, estimatedDays, message });
  }

  async acceptOffer(tenderId: string, offerId: string): Promise<void> {
    await api.post(`/tenders/${tenderId}/offers/${offerId}/accept`);
  }

  async rejectOffer(tenderId: string, offerId: string): Promise<void> {
    await api.post(`/tenders/${tenderId}/offers/${offerId}/reject`);
  }
}

class ChatService {
  async getChats(): Promise<Chat[]> {
    const response = await api.get<Chat[]>('/chat');
    return response.data;
  }

  async getMessages(chatId: string): Promise<Message[]> {
    const response = await api.get<Message[]>(`/chat/${chatId}/messages`);
    return response.data;
  }

  async markAsRead(chatId: string): Promise<void> {
    await api.post(`/chat/${chatId}/read`);
  }
}

class NotificationService {
  async getNotifications(): Promise<Notification[]> {
    const response = await api.get<Notification[]>('/notifications');
    return response.data;
  }

  async markAsRead(notificationId: string): Promise<void> {
    await api.post(`/notifications/${notificationId}/read`);
  }

  async markAllAsRead(): Promise<void> {
    await api.post('/notifications/read-all');
  }
}

export const authService = new AuthService();
export const carService = new CarService();
export const appointmentService = new AppointmentService();
export const tenderService = new TenderService();
export const chatService = new ChatService();
export const notificationService = new NotificationService();
