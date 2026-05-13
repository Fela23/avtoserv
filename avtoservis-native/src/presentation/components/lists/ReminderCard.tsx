import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@shared/constants/theme';

interface ReminderCardProps {
  reminder: {
    id: string;
    title: string;
    description?: string;
    nextDueDate?: string;
    nextDueKm?: number;
    type: string;
  };
  onPress?: () => void;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({ reminder, onPress }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'oil': return '🛢️';
      case 'filter': return '💨';
      case 'tires': return '🍞';
      case 'brakes': return '🛑';
      case 'battery': return '🔋';
      default: return '📅';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>{getTypeIcon(reminder.type)}</Text>
        <View style={styles.content}>
          <Text style={styles.title}>{reminder.title}</Text>
          {reminder.description && (
            <Text style={styles.description} numberOfLines={1}>
              {reminder.description}
            </Text>
          )}
        </View>
      </View>
      
      {(reminder.nextDueDate || reminder.nextDueKm) && (
        <View style={styles.footer}>
          {reminder.nextDueDate && (
            <Text style={styles.due}>
              📅 {new Date(reminder.nextDueDate).toLocaleDateString('ru-RU')}
            </Text>
          )}
          {reminder.nextDueKm && (
            <Text style={styles.due}>
              🚗 {reminder.nextDueKm.toLocaleString()} км
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    ...Typography.h4,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  description: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  due: {
    ...Typography.labelSmall,
    color: Colors.textSecondary,
  },
});

export default ReminderCard;
