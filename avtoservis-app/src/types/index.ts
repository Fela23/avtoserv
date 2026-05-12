export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'Customer' | 'ServiceManager' | 'Mechanic' | 'Admin';
  avatarUrl?: string;
}

export interface Car {
  id: string;
  userId: string;
  brand: string;
  model: string;
  year: number;
  vin?: string;
  licensePlate?: string;
  mileage: number;
  serviceHistory: ServiceRecord[];
}

export interface ServiceRecord {
  id: string;
  carId: string;
  date: string;
  description: string;
  cost: number;
  mechanicName?: string;
}

export interface Appointment {
  id: string;
  userId: string;
  carId: string;
  serviceTypeId: string;
  dateTime: string;
  status: 'Pending' | 'Confirmed' | 'InProgress' | 'Completed' | 'Cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceType {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  estimatedDuration: number; // minutes
}

export interface Tender {
  id: string;
  userId: string;
  carId: string;
  description: string;
  budget?: number;
  deadline: string;
  status: 'Open' | 'InReview' | 'Accepted' | 'Closed';
  offers: TenderOffer[];
  createdAt: string;
}

export interface TenderOffer {
  id: string;
  tenderId: string;
  serviceCenterId: string;
  serviceCenterName: string;
  price: number;
  estimatedDays: number;
  message: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'Info' | 'Warning' | 'Success' | 'Error';
  isRead: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  details?: Record<string, string[]>;
}
