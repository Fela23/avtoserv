import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@shared/constants/theme';

interface ReminderFormProps {
  title: string;
  type: string;
  intervalKm?: number;
  intervalDays?: number;
}

export const ReminderForm: React.FC<ReminderFormProps> = ({
  title,
  type,
  intervalKm,
  intervalDays,
}) => {
  return (
    <View>
      <Text style={styles.label}>Название</Text>
      <View style={styles.field}>
        <Text style={styles.value}>{title}</Text>
      </View>

      <Text style={styles.label}>Тип напоминания</Text>
      <View style={styles.field}>
        <Text style={styles.value}>{type}</Text>
      </View>

      {intervalKm && (
        <>
          <Text style={styles.label}>Интервал (км)</Text>
          <View style={styles.field}>
            <Text style={styles.value}>{intervalKm.toLocaleString()} км</Text>
          </View>
        </>
      )}

      {intervalDays && (
        <>
          <Text style={styles.label}>Интервал (дней)</Text>
          <View style={styles.field}>
            <Text style={styles.value}>{intervalDays} дн.</Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    ...Typography.labelSmall,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  field: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  value: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
});

export default ReminderForm;
