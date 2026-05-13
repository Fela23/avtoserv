import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@shared/constants/theme';
import { Car } from '@shared/types';

interface CarCardProps {
  car: Car;
  onPress?: () => void;
  onEdit?: () => void;
}

export const CarCard: React.FC<CarCardProps> = ({ car, onPress, onEdit }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        {car.imageUrl ? (
          <Image source={{ uri: car.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderIcon}>🚗</Text>
          </View>
        )}
        {car.isPrimary && (
          <View style={styles.primaryBadge}>
            <Text style={styles.primaryBadgeText}>Основной</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.brand}>{car.brand} {car.model}</Text>
          {onEdit && (
            <TouchableOpacity onPress={onEdit}>
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.details}>
          <Text style={styles.detail}>{car.year} г.</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.detail}>{car.licensePlate}</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.detail}>{car.currentMileage.toLocaleString()} км</Text>
        </View>
        
        {car.color && (
          <Text style={styles.color}>Цвет: {car.color}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    width: 120,
    height: 120,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 40,
  },
  primaryBadge: {
    position: 'absolute',
    bottom: Spacing.xs,
    left: Spacing.xs,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  primaryBadgeText: {
    ...Typography.captionBold,
    color: Colors.white,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  brand: {
    ...Typography.h4,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  editIcon: {
    fontSize: 18,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  detail: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  separator: {
    ...Typography.bodySmall,
    color: Colors.textTertiary,
    marginHorizontal: Spacing.xs,
  },
  color: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
  },
});

export default CarCard;
