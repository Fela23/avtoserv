import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@shared/constants/theme';

interface CarFormProps {
  brand: string;
  model: string;
  year: string;
  licensePlate: string;
  vin: string;
  mileage: string;
  color: string;
  isPrimary: boolean;
  errors?: Record<string, string>;
  onChange: (field: string, value: any) => void;
}

export const CarForm: React.FC<CarFormProps> = ({
  brand,
  model,
  year,
  licensePlate,
  vin,
  mileage,
  color,
  isPrimary,
  errors,
  onChange,
}) => {
  return (
    <View>
      <Text style={styles.label}>Марка</Text>
      <View style={styles.input}>
        <Text>{brand || 'Не указано'}</Text>
      </View>

      <Text style={styles.label}>Модель</Text>
      <View style={styles.input}>
        <Text>{model || 'Не указано'}</View>

      <Text style={styles.label}>Год выпуска</Text>
      <View style={styles.input}>
        <Text>{year || 'Не указано'}</Text>
      </View>

      <Text style={styles.label}>VIN</Text>
      <View style={styles.input}>
        <Text>{vin || 'Не указано'}</Text>
      </View>

      <Text style={styles.label}>Пробег (км)</Text>
      <View style={styles.input}>
        <Text>{mileage || 'Не указано'}</Text>
      </View>

      <Text style={styles.label}>Цвет</Text>
      <View style={styles.input}>
        <Text>{color || 'Не указано'}</Text>
      </View>

      <Text style={styles.label}>Основной автомобиль</Text>
      <View style={styles.input}>
        <Text>{isPrimary ? 'Да' : 'Нет'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
});

export default CarForm;
