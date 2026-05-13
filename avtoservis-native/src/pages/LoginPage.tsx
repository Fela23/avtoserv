import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Button, Input, Card } from '../components';
import { useAuthStore } from '../store';
import { authService } from '../services/apiServices';
import { LoginRequest } from '../types';

type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const LoginPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const login = useAuthStore((state) => state.login);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Введите email';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Некорректный email';
    }

    if (!password) {
      newErrors.password = 'Введите пароль';
    } else if (password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const loginData: LoginRequest = { email, password };
      const response = await authService.login(loginData);
      
      login(response.tokens, response.user);
      
      // Navigation will be handled by App.tsx based on auth state
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Ошибка входа. Проверьте данные.';
      Alert.alert('Ошибка', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Автосервис</Text>
          <Text style={styles.subtitle}>Вход в систему</Text>
        </View>

        <Card style={styles.formCard}>
          <Input
            label="Email"
            placeholder="example@mail.ru"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            disabled={isLoading}
          />

          <Input
            label="Пароль"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
            disabled={isLoading}
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Забыли пароль?</Text>
          </TouchableOpacity>

          <Button
            title="Войти"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            style={styles.loginButton}
          />
        </Card>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Нет аккаунта? </Text>
          <TouchableOpacity onPress={() => Alert.alert('Регистрация', 'Функция регистрации будет доступна позже')}>
            <Text style={styles.registerLink}>Зарегистрироваться</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSizes['3xl'],
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSizes.lg,
    color: colors.textSecondary,
  },
  formCard: {
    marginBottom: spacing.lg,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.md,
  },
  forgotPasswordText: {
    fontSize: typography.fontSizes.sm,
    color: colors.primary,
  },
  loginButton: {
    marginTop: spacing.sm,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  registerLink: {
    fontSize: typography.fontSizes.sm,
    color: colors.primary,
    fontWeight: typography.fontWeights.semibold,
  },
});
