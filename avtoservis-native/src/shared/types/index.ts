/**
 * Shared types for the Avtoservis application
 */

// User & Auth
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'client' | 'admin' | 'master';
  phone?: string;
  avatarUrl?: string;
  twoFactorEnabled: boolean;
  createdAt: string;
}

export interface AuthTokens {
  token: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

// Car
export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  currentMileage: number;
  color: string;
  isPrimary: boolean;
  imageUrl?: string;
}

// Appointment
export type AppointmentStatus = 
  | 'Draft' 
  | 'New' 
  | 'Confirmed' 
  | 'InProgress' 
  | 'Completed' 
  | 'Cancelled';

export interface Appointment {
  id: string;
  carId: string;
  carBrand: string;
  carModel: string;
  serviceId: string;
  serviceName: string;
  scheduledDate: string;
  scheduledTime: string;
  status: AppointmentStatus;
  totalPrice: number;
  description?: string;
  masterName?: string;
}

// Tender
export interface TenderOffer {
  id: string;
  works: TenderWork[];
  parts: TenderPart[];
  totalPrice: number;
}

export interface TenderWork {
  name: string;
  price: number;
  quantity: number;
}

export interface TenderPart {
  name: string;
  price: number;
  quantity: number;
}

export type TenderStatus = 'PendingApproval' | 'Active' | 'Completed' | 'Cancelled';

export interface Tender {
  id: string;
  carId: string;
  carBrand: string;
  carModel: string;
  status: TenderStatus;
  description: string;
  minBudget: number;
  maxBudget: number;
  deadline: string;
  createdAt: string;
  offers: TenderOffer[];
}

// Reminder
export interface Reminder {
  id: string;
  carId: string;
  type: 'oil' | 'filter' | 'tires' | 'brakes' | 'battery' | 'custom';
  title: string;
  description?: string;
  intervalKm?: number;
  intervalDays?: number;
  lastServiceDate?: string;
  lastServiceKm?: number;
  nextDueDate?: string;
  nextDueKm?: number;
  isActive: boolean;
}

// Driving Profile
export interface DrivingProfile {
  carId: string;
  avgDailyDistance: number;
  drivingStyle: 'calm' | 'normal' | 'aggressive';
  cityDrivingPercent: number;
  highwayDrivingPercent: number;
}

// Chat
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  url: string;
  type: 'image' | 'document';
  name: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage?: Message;
  unreadCount: number;
}

// Bonus
export interface BonusBalance {
  total: number;
  available: number;
  pending: number;
}

export interface BonusTransaction {
  id: string;
  amount: number;
  type: 'earn' | 'spend';
  description: string;
  date: string;
  appointmentId?: string;
}

// Notification
export type NotificationType = 
  | 'appointment_confirmed'
  | 'appointment_rescheduled'
  | 'appointment_cancelled'
  | 'tender_offer'
  | 'chat_message'
  | 'reminder_due'
  | 'promo'
  | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, string>;
  isRead: boolean;
  createdAt: string;
}

// API Response Types
export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    hasNextPage: boolean;
    nextPage?: number;
  };
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Appointments: undefined;
  Tenders: undefined;
  Chat: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  Notifications: undefined;
  CarsList: undefined;
  CarDetail: { carId: string };
  AddEditCar: { carId?: string };
};

export type AppointmentsStackParamList = {
  Appointments: undefined;
  NewAppointment: undefined;
  AppointmentDetail: { appointmentId: string };
  RescheduleModal: { appointmentId: string };
  CancelModal: { appointmentId: string };
};

export type TendersStackParamList = {
  Tenders: undefined;
  TenderDetail: { tenderId: string };
  TenderToAppointmentWizard: { tenderId: string; offerId: string };
  Calculator: undefined;
};

export type ChatStackParamList = {
  ChatList: undefined;
  Chat: { conversationId: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
  History: undefined;
  Bonuses: undefined;
  RemindersList: undefined;
  AddEditReminder: { reminderId?: string };
  DrivingProfile: { carId: string };
};
