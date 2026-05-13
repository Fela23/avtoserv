import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@shared/constants/theme';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default';

interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
  size?: 'small' | 'medium';
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'default',
  size = 'medium',
}) => {
  const getColors = () => {
    switch (variant) {
      case 'success':
        return { bg: '#DCFCE7', text: '#166534' };
      case 'warning':
        return { bg: '#FEF3C7', text: '#92400E' };
      case 'error':
        return { bg: '#FEE2E2', text: '#991B1B' };
      case 'info':
        return { bg: '#DBEAFE', text: '#1E40AF' };
      default:
        return { bg: Colors.background, text: Colors.textSecondary };
    }
  };

  const colors = getColors();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.bg },
        size === 'small' && styles.small,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: colors.text },
          size === 'small' && Typography.caption,
          size === 'medium' && Typography.labelSmall,
        ]}
      >
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  small: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
  },
  text: {
    fontWeight: '600',
  },
});

export default Badge;
