// API Types from BACKEND_INTEGRATION.md and SPEC.md

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'client' | 'service' | 'admin';
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Car {
  id: string;
  userId: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  licensePlate?: string;
  mileage?: number;
  color?: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceAppointment {
  id: string;
  userId: string;
  carId: string;
  serviceId: string;
  dateTime: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  description?: string;
  estimatedPrice?: number;
  finalPrice?: number;
  mechanicNotes?: string;
  createdAt: string;
  updatedAt: string;
  car?: Car;
  service?: Service;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  duration: number; // in minutes
  category: string;
  isActive: boolean;
}

export interface Tender {
  id: string;
  userId: string;
  carId: string;
  serviceId: string;
  description: string;
  budgetMin?: number;
  budgetMax?: number;
  deadline: string;
  status: 'open' | 'in_review' | 'accepted' | 'rejected' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  offers?: Offer[];
  car?: Car;
}

export interface Offer {
  id: string;
  tenderId: string;
  serviceId: string;
  price: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  service?: Service;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  messageType: 'text' | 'image' | 'file';
  attachmentUrl?: string;
  isRead: boolean;
  createdAt: string;
  sender?: User;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

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

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
