import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from './store';
import { AppNavigator } from './navigation/AppNavigator';
import { signalRService } from './services/signalR';

const App: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const tokens = useAuthStore((state) => state.tokens);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    // Initialize auth state from storage
    const initializeAuth = async () => {
      try {
        // Check if we have stored tokens
        const storedTokens = useAuthStore.getState().tokens;
        if (storedTokens) {
          // Optionally validate token expiration here
          const isExpired = new Date(storedTokens.expiresAt) < new Date();
          if (isExpired) {
            // Token expired, logout
            useAuthStore.getState().logout();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    // Start SignalR connections when authenticated
    if (isAuthenticated && tokens?.accessToken) {
      signalRService.startChatConnection(tokens.accessToken);
      signalRService.startNotificationConnection(tokens.accessToken);
    } else {
      signalRService.stopAllConnections();
    }

    // Cleanup on unmount
    return () => {
      signalRService.stopAllConnections();
    };
  }, [isAuthenticated, tokens]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
