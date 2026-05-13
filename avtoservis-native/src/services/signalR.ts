import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { Message, Notification } from '../types';
import { useAppStore } from '../store';

const SIGNALR_HUB_URL = process.env.SIGNALR_HUB_URL || 'https://localhost:7002/hubs';

class SignalRService {
  private chatConnection: any = null;
  private notificationConnection: any = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  async startChatConnection(accessToken: string): Promise<void> {
    if (this.chatConnection?.state === HubConnectionState.Connected) {
      return;
    }

    this.chatConnection = new HubConnectionBuilder()
      .withUrl(`${SIGNALR_HUB_URL}/chat`, {
        accessTokenFactory: () => accessToken,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .build();

    this.chatConnection.on('ReceiveMessage', (message: Message) => {
      this.handleNewMessage(message);
    });

    this.chatConnection.on('UserTyping', (userId: string, conversationId: string) => {
      console.log(`User ${userId} is typing in conversation ${conversationId}`);
    });

    try {
      await this.chatConnection.start();
      console.log('SignalR Chat Connection started');
      this.reconnectAttempts = 0;
    } catch (err) {
      console.error('SignalR Chat Connection error:', err);
      this.handleReconnect('chat');
    }
  }

  async startNotificationConnection(accessToken: string): Promise<void> {
    if (this.notificationConnection?.state === HubConnectionState.Connected) {
      return;
    }

    this.notificationConnection = new HubConnectionBuilder()
      .withUrl(`${SIGNALR_HUB_URL}/notifications`, {
        accessTokenFactory: () => accessToken,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .build();

    this.notificationConnection.on('ReceiveNotification', (notification: Notification) => {
      this.handleNewNotification(notification);
    });

    this.notificationConnection.on('AppointmentStatusChanged', (appointmentId: string, newStatus: string) => {
      console.log(`Appointment ${appointmentId} status changed to ${newStatus}`);
    });

    this.notificationConnection.on('TenderUpdated', (tenderId: string) => {
      console.log(`Tender ${tenderId} was updated`);
    });

    try {
      await this.notificationConnection.start();
      console.log('SignalR Notification Connection started');
      this.reconnectAttempts = 0;
    } catch (err) {
      console.error('SignalR Notification Connection error:', err);
      this.handleReconnect('notification');
    }
  }

  private handleReconnect(type: 'chat' | 'notification') {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        const tokens = useAppStore.getState();
        // Reconnection logic would need access to auth tokens
        console.log(`Attempting to reconnect ${type} connection...`);
      }, 2000 * this.reconnectAttempts);
    } else {
      console.error(`Max reconnection attempts reached for ${type}`);
    }
  }

  private handleNewMessage(message: Message) {
    // Could add message to local store or trigger notification
    console.log('New message received:', message);
  }

  private handleNewNotification(notification: Notification) {
    useAppStore.getState().addNotification(notification);
    console.log('New notification received:', notification.title);
  }

  async sendMessage(conversationId: string, content: string): Promise<void> {
    if (this.chatConnection?.state !== HubConnectionState.Connected) {
      throw new Error('Chat connection not established');
    }

    await this.chatConnection.invoke('SendMessage', conversationId, content);
  }

  async sendTypingIndicator(conversationId: string): Promise<void> {
    if (this.chatConnection?.state !== HubConnectionState.Connected) {
      return;
    }

    await this.chatConnection.send('SendTypingIndicator', conversationId);
  }

  async stopChatConnection(): Promise<void> {
    if (this.chatConnection) {
      await this.chatConnection.stop();
      this.chatConnection = null;
    }
  }

  async stopNotificationConnection(): Promise<void> {
    if (this.notificationConnection) {
      await this.notificationConnection.stop();
      this.notificationConnection = null;
    }
  }

  async stopAllConnections(): Promise<void> {
    await Promise.all([
      this.stopChatConnection(),
      this.stopNotificationConnection(),
    ]);
  }
}

export const signalRService = new SignalRService();
export default signalRService;
