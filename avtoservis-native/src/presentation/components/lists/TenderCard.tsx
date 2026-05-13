import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@shared/constants/theme';

interface TenderCardProps {
  tender: {
    id: string;
    carBrand: string;
    carModel: string;
    status: string;
    description: string;
    minBudget: number;
    maxBudget: number;
    deadline: string;
    offersCount: number;
  };
  onPress?: () => void;
}

export const TenderCard: React.FC<TenderCardProps> = ({ tender, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.carName}>{tender.carBrand} {tender.carModel}</Text>
      <Text style={styles.description} numberOfLines={2}>{tender.description}</Text>
      
      <View style={styles.budgetRow}>
        <Text style={styles.budgetLabel}>Бюджет:</Text>
        <Text style={styles.budgetValue}>
          {tender.minBudget.toLocaleString()} - {tender.maxBudget.toLocaleString()} ₽
        </Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.deadline}>
          До: {new Date(tender.deadline).toLocaleDateString('ru-RU')}
        </Text>
        <Text style={styles.offers}>{tender.offersCount} предложений</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  carName: {
    ...Typography.h4,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  budgetLabel: {
    ...Typography.labelSmall,
    color: Colors.textTertiary,
  },
  budgetValue: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  deadline: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  offers: {
    ...Typography.captionBold,
    color: Colors.primary,
  },
});

export default TenderCard;
