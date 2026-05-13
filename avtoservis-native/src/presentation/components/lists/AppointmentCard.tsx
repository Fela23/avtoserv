import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@shared/constants/theme';
import { Appointment, AppointmentStatus } from '@shared/types';
import Badge from '../ui/Badge';

interface AppointmentCardProps {
  appointment: Appointment;
  onPress?: () => void;
}

const getStatusBadge = (status: AppointmentStatus): { text: string; variant: 'success' | 'warning' | 'error' | 'info' } => {
  switch (status) {
    case 'Confirmed':
    case 'Completed':
      return { text: 'Подтверждено', variant: 'success' };
    case 'New':
      return { text: 'Новая', variant: 'warning' };
    case 'InProgress':
      return { text: 'В работе', variant: 'info' };
    case 'Cancelled':
      return { text: 'Отменено', variant: 'error' };
    case 'Draft':
      return { text: 'Черновик', variant: 'default' as any };
    default:
      return { text: status, variant: 'default' as any };
  }
};

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onPress }) => {
  const statusBadge = getStatusBadge(appointment.status);
  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.carInfo}>
          <Text style={styles.carName}>{appointment.carBrand} {appointment.carModel}</Text>
          <Text style={styles.serviceName}>{appointment.serviceName}</Text>
        </View>
        <Badge text={statusBadge.text} variant={statusBadge.variant} size="small" />
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📅</Text>
          <Text style={styles.detailText}>
            {new Date(appointment.scheduledDate).toLocaleDateString('ru-RU')}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>🕐</Text>
          <Text style={styles.detailText}>{appointment.scheduledTime}</Text>
        </View>
        
        {appointment.masterName && (
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>👨‍🔧</Text>
            <Text style={styles.detailText}>Мастер: {appointment.masterName}</Text>
          </View>
        )}
        
        {appointment.totalPrice > 0 && (
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Стоимость:</Text>
            <Text style={styles.priceValue}>{appointment.totalPrice.toLocaleString('ru-RU')} ₽</Text>
          </View>
        )}
      </View>
      
      {appointment.description && (
        <Text style={styles.description} numberOfLines={2}>
          {appointment.description}
        </Text>
      )}
    </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  carInfo: {
    flex: 1,
  },
  carName: {
    ...Typography.h4,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  serviceName: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  details: {
    marginTop: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  detailIcon: {
    marginRight: Spacing.sm,
    fontSize: 14,
  },
  detailText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  priceLabel: {
    ...Typography.labelSmall,
    color: Colors.textSecondary,
  },
  priceValue: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  description: {
    ...Typography.bodySmall,
    color: Colors.textTertiary,
    marginTop: Spacing.sm,
  },
});

export default AppointmentCard;
