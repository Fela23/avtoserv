import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { useAuthStore } from '../store';
import { colors } from '../theme';

// Placeholder pages - will be implemented next
const CarsPage: React.FC = () => <Text>Автомобили</Text>;
const AppointmentsPage: React.FC = () => <Text>Записи</Text>;
const TendersPage: React.FC = () => <Text>Тендеры</Text>;
const ChatPage: React.FC = () => <Text>Чат</Text>;
const ProfilePage: React.FC = () => <Text>Профиль</Text>;

export type RootStackParamList = {
  Auth: {
    screen: 'Login';
  };
  Main: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Cars: undefined;
  Appointments: undefined;
  Tenders: undefined;
  Chat: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Cars':
              iconName = focused ? 'car' : 'car-outline';
              break;
            case 'Appointments':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Tenders':
              iconName = focused ? 'pricetag' : 'pricetag-outline';
              break;
            case 'Chat':
              iconName = focused ? 'chatbubble' : 'chatbubble-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray400,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardPage}
        options={{ title: 'Главная' }}
      />
      <Tab.Screen
        name="Cars"
        component={CarsPage}
        options={{ title: 'Авто' }}
      />
      <Tab.Screen
        name="Appointments"
        component={AppointmentsPage}
        options={{ title: 'Записи' }}
      />
      <Tab.Screen
        name="Tenders"
        component={TendersPage}
        options={{ title: 'Тендеры' }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatPage}
        options={{ title: 'Чат' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfilePage}
        options={{ title: 'Профиль' }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return null; // Or show a splash screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Auth" component={LoginPage} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 4,
    paddingBottom: 4,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  header: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
});
