import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@shared/constants/theme';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  variant = 'rounded',
}) => {
  const getBorderRadius = () => {
    switch (variant) {
      case 'circular':
        return BorderRadius.full;
      case 'rounded':
        return BorderRadius.md;
      case 'rectangular':
        return BorderRadius.none;
      default:
        return BorderRadius.md;
    }
  };

  return (
    <View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius: getBorderRadius(),
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: Colors.background,
  },
});

export default Skeleton;
