import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { colors, typography, spacing } from '../theme';
import { Card, LoadingSpinner } from '../components';
import { useAuthStore, useAppStore } from '../store';
import { appointmentService, carService } from '../services/apiServices';
import { ServiceAppointment, Car } from '../types';

export const DashboardPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const cars = useAppStore((state) => state.cars);
  const setCars = useAppStore((state) => state.setCars);
  
  const [appointments, setAppointments] = useState<ServiceAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [carsData, appointmentsData] = await Promise.all([
        carService.getAll(),
        appointmentService.getAll({ page: 1, pageSize: 5 }),
      ]);
      
      setCars(carsData);
      setAppointments(appointmentsData.items || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return colors.warning;
      case 'confirmed':
        return colors.info;
      case 'in_progress':
        return colors.primary;
      case 'completed':
        return colors.success;
      case 'cancelled':
        return colors.error;
      default:
        return colors.gray500;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Ожидает подтверждения';
      case 'confirmed':
        return 'Подтверждено';
      case 'in_progress':
        return 'В работе';
      case 'completed':
        return 'Завершено';
      case 'cancelled':
        return 'Отменено';
      default:
        return status;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Здравствуйте,</Text>
        <Text style={styles.userName}>{user?.firstName || 'Пользователь'}!</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{cars.length}</Text>
          <Text style={styles.statLabel}>Автомобилей</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>
            {appointments.filter((a) => a.status === 'pending').length}
          </Text>
          <Text style={styles.statLabel}>Ожидают</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>
            {appointments.filter((a) => a.status === 'in_progress').length}
          </Text>
          <Text style={styles.statLabel}>В работе</Text>
        </Card>
      </View>

      {/* My Cars */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Мои автомобили</Text>
        {cars.length === 0 ? (
          <Card>
            <Text style={styles.emptyText}>У вас пока нет автомобилей</Text>
            <TouchableOpacity>
              <Text style={styles.addCarLink}>Добавить автомобиль</Text>
            </TouchableOpacity>
          </Card>
        ) : (
          cars.map((car) => (
            <Card key={car.id} variant="outlined">
              <Text style={styles.carName}>
                {car.make} {car.model}
              </Text>
              {car.year && <Text style={styles.carDetail}>{car.year} г.</Text>}
              {car.licensePlate && (
                <Text style={styles.carDetail}>{car.licensePlate}</Text>
              )}
            </Card>
          ))
        )}
      </View>

      {/* Recent Appointments */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Последние записи</Text>
        {appointments.length === 0 ? (
          <Card>
            <Text style={styles.emptyText}>Нет активных записей</Text>
            <TouchableOpacity>
              <Text style={styles.addAppointmentLink}>Записаться на сервис</Text>
            </TouchableOpacity>
          </Card>
        ) : (
          appointments.map((appointment) => (
            <Card key={appointment.id} variant="outlined">
              <View style={styles.appointmentHeader}>
                <Text style={styles.appointmentDate}>
                  {new Date(appointment.dateTime).toLocaleDateString('ru-RU')}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(appointment.status) },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {getStatusText(appointment.status)}
                  </Text>
                </View>
              </View>
              <Text style={styles.serviceName}>
                Услуга ID: {appointment.serviceId}
              </Text>
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  greeting: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
  },
  userName: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  statValue: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
  },
  statLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  addCarLink: {
    fontSize: typography.fontSizes.sm,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: typography.fontWeights.semibold,
  },
  addAppointmentLink: {
    fontSize: typography.fontSizes.sm,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: typography.fontWeights.semibold,
  },
  carName: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
  },
  carDetail: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  appointmentDate: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
  statusText: {
    fontSize: typography.fontSizes.xs,
    color: colors.white,
    fontWeight: typography.fontWeights.medium,
  },
  serviceName: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
  },
});
