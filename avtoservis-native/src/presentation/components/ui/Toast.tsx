import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@shared/constants/theme';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  isVisible: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', isVisible }) => {
  if (!isVisible) return null;

  const getColors = () => {
    switch (type) {
      case 'success':
        return { bg: '#DCFCE7', text: '#166534', icon: '✅' };
      case 'error':
        return { bg: '#FEE2E2', text: '#991B1B', icon: '❌' };
      case 'warning':
        return { bg: '#FEF3C7', text: '#92400E', icon: '⚠️' };
      default:
        return { bg: '#DBEAFE', text: '#1E40AF', icon: 'ℹ️' };
    }
  };

  const colors = getColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={styles.icon}>{colors.icon}</Text>
      <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 9999,
  },
  icon: {
    fontSize: 18,
    marginRight: Spacing.sm,
  },
  message: {
    ...Typography.body,
    flex: 1,
    fontWeight: '500',
  },
});

export default Toast;
