import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@shared/constants/theme';

interface AppointmentFormProps {
  carName: string;
  serviceName: string;
  date: string;
  time: string;
  masterName?: string;
  description?: string;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  carName,
  serviceName,
  date,
  time,
  masterName,
  description,
}) => {
  return (
    <View>
      <Text style={styles.label}>Автомобиль</Text>
      <View style={styles.field}>
        <Text style={styles.value}>{carName}</Text>
      </View>

      <Text style={styles.label}>Услуга</Text>
      <View style={styles.field}>
        <Text style={styles.value}>{serviceName}</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>Дата</Text>
          <View style={styles.field}>
            <Text style={styles.value}>{date}</Text>
          </View>
        </View>

        <View style={styles.half}>
          <Text style={styles.label}>Время</Text>
          <View style={styles.field}>
            <Text style={styles.value}>{time}</Text>
          </View>
        </View>
      </View>

      {masterName && (
        <>
          <Text style={styles.label}>Мастер</Text>
          <View style={styles.field}>
            <Text style={styles.value}>{masterName}</Text>
          </View>
        </>
      )}

      {description && (
        <>
          <Text style={styles.label}>Описание проблемы</Text>
          <View style={styles.field}>
            <Text style={styles.value}>{description}</Text>
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
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  half: {
    flex: 1,
  },
});

export default AppointmentForm;
