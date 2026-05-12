import { useEffect, useCallback } from 'react';
import { signalRService } from '@/services/signalR';
import type { Message, Notification } from '@/types';

export function useSignalR() {
  const handleMessage = useCallback((handler: (message: Message) => void) => {
    return signalRService.onMessageReceived(handler);
  }, []);

  const handleNotification = useCallback((handler: (notification: Notification) => void) => {
    return signalRService.onNotificationReceived(handler);
  }, []);

  const sendMessage = useCallback(async (chatId: string, text: string) => {
    await signalRService.sendMessage(chatId, text);
  }, []);

  const joinChat = useCallback(async (chatId: string) => {
    await signalRService.joinChat(chatId);
  }, []);

  const leaveChat = useCallback(async (chatId: string) => {
    await signalRService.leaveChat(chatId);
  }, []);

  const isConnected = useCallback(() => {
    return signalRService.isConnected();
  }, []);

  return {
    handleMessage,
    handleNotification,
    sendMessage,
    joinChat,
    leaveChat,
    isConnected,
  };
}

export function useAuth() {
  const login = useCallback(async (email: string, password: string) => {
    const { authService } = await import('@/services/apiServices');
    const { user, tokens } = await authService.login({ email, password });
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    return { user, tokens };
  }, []);

  const register = useCallback(async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    phone: string
  ) => {
    const { authService } = await import('@/services/apiServices');
    const { user, tokens } = await authService.register({ 
      email, 
      password, 
      firstName, 
      lastName, 
      phone 
    });
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    return { user, tokens };
  }, []);

  const logout = useCallback(async () => {
    const { authService } = await import('@/services/apiServices');
    const { signalRService } = await import('@/services/signalR');
    try {
      await authService.logout();
    } catch {
      // Ignore
    } finally {
      await signalRService.stopConnection();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }, []);

  const isAuthenticated = useCallback(() => {
    return !!localStorage.getItem('accessToken');
  }, []);

  return {
    login,
    register,
    logout,
    isAuthenticated,
  };
}

export function useCars() {
  const fetchCars = useCallback(async () => {
    const { carService } = await import('@/services/apiServices');
    return await carService.getCars();
  }, []);

  const createCar = useCallback(async (data: {
    brand: string;
    model: string;
    year: number;
    vin?: string;
    licensePlate?: string;
    mileage: number;
  }) => {
    const { carService } = await import('@/services/apiServices');
    return await carService.createCar(data);
  }, []);

  const updateCar = useCallback(async (id: string, data: Partial<{
    brand: string;
    model: string;
    year: number;
    vin?: string;
    licensePlate?: string;
    mileage: number;
  }>) => {
    const { carService } = await import('@/services/apiServices');
    return await carService.updateCar(id, data);
  }, []);

  const deleteCar = useCallback(async (id: string) => {
    const { carService } = await import('@/services/apiServices');
    await carService.deleteCar(id);
  }, []);

  return {
    fetchCars,
    createCar,
    updateCar,
    deleteCar,
  };
}

export function useAppointments() {
  const fetchAppointments = useCallback(async () => {
    const { appointmentService } = await import('@/services/apiServices');
    return await appointmentService.getAppointments();
  }, []);

  const createAppointment = useCallback(async (data: {
    carId: string;
    serviceTypeId: string;
    dateTime: string;
    notes?: string;
  }) => {
    const { appointmentService } = await import('@/services/apiServices');
    return await appointmentService.createAppointment(data);
  }, []);

  const cancelAppointment = useCallback(async (id: string) => {
    const { appointmentService } = await import('@/services/apiServices');
    return await appointmentService.cancelAppointment(id);
  }, []);

  const getServiceTypes = useCallback(async () => {
    const { appointmentService } = await import('@/services/apiServices');
    return await appointmentService.getServiceTypes();
  }, []);

  const getAvailableSlots = useCallback(async (serviceTypeId: string, date: string) => {
    const { appointmentService } = await import('@/services/apiServices');
    return await appointmentService.getAvailableSlots(serviceTypeId, date);
  }, []);

  return {
    fetchAppointments,
    createAppointment,
    cancelAppointment,
    getServiceTypes,
    getAvailableSlots,
  };
}
