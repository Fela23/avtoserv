import * as signalR from '@microsoft/signalr';
import type { Message, Notification } from '@/types';

const HUB_URL = import.meta.env.VITE_SIGNALR_URL || 'http://localhost:5000/hubs';

export class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private messageHandlers: ((message: Message) => void)[] = [];
  private notificationHandlers: ((notification: Notification) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  async startConnection(accessToken: string): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      return;
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${HUB_URL}/notifications`, {
        accessTokenFactory: () => accessToken,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.setupEventHandlers();
    this.setupReconnectHandler();

    try {
      await this.connection.start();
      console.log('SignalR Connected');
      this.reconnectAttempts = 0;
    } catch (error) {
      console.error('SignalR Connection Error:', error);
      throw error;
    }
  }

  private setupEventHandlers(): void {
    if (!this.connection) return;

    this.connection.on('ReceiveMessage', (message: Message) => {
      this.messageHandlers.forEach(handler => handler(message));
    });

    this.connection.on('ReceiveNotification', (notification: Notification) => {
      this.notificationHandlers.forEach(handler => handler(notification));
    });

    this.connection.on('AppointmentStatusChanged', (appointmentId: string, status: string) => {
      console.log('Appointment status changed:', appointmentId, status);
    });

    this.connection.on('TenderOfferReceived', (tenderId: string, offerId: string) => {
      console.log('New tender offer:', tenderId, offerId);
    });
  }

  private setupReconnectHandler(): void {
    if (!this.connection) return;

    this.connection.onreconnecting((error) => {
      console.log('Reconnecting...', error);
    });

    this.connection.onreconnected((connectionId) => {
      console.log('Reconnected successfully', connectionId);
      this.reconnectAttempts = 0;
    });

    this.connection.onclose((error) => {
      console.log('Connection closed', error);
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        setTimeout(() => this.restartConnection(), 2000);
      }
    });
  }

  private async restartConnection(): Promise<void> {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      try {
        await this.startConnection(accessToken);
      } catch (error) {
        console.error('Failed to restart SignalR connection:', error);
      }
    }
  }

  onMessageReceived(handler: (message: Message) => void): () => void {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  onNotificationReceived(handler: (notification: Notification) => void): () => void {
    this.notificationHandlers.push(handler);
    return () => {
      this.notificationHandlers = this.notificationHandlers.filter(h => h !== handler);
    };
  }

  async sendMessage(chatId: string, text: string): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      throw new Error('SignalR not connected');
    }

    await this.connection.invoke('SendMessage', chatId, text);
  }

  async joinChat(chatId: string): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      throw new Error('SignalR not connected');
    }

    await this.connection.invoke('JoinChat', chatId);
  }

  async leaveChat(chatId: string): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      throw new Error('SignalR not connected');
    }

    await this.connection.invoke('LeaveChat', chatId);
  }

  async stopConnection(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      console.log('SignalR Disconnected');
    }
  }

  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}

export const signalRService = new SignalRService();
