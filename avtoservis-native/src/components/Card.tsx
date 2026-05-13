import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

interface CardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'outlined' | 'elevated';
  style?: any;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  onPress,
  variant = 'elevated',
  style,
}) => {
  const getCardStyle = () => {
    const baseStyle = [styles.card];
    
    switch (variant) {
      case 'outlined':
        baseStyle.push(styles.outlinedCard);
        break;
      case 'elevated':
        baseStyle.push(shadows.md);
        break;
    }
    
    return baseStyle;
  };

  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper
      style={[...getCardStyle(), style]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}
      {children && <View style={styles.content}>{children}</View>}
    </CardWrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.sm,
  },
  outlinedCard: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.regular,
    color: colors.textSecondary,
  },
  content: {
    // Content styling
  },
});
