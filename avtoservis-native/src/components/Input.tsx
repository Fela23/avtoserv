import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  icon?: React.ReactNode;
  style?: any;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  icon,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputContainer,
        error && styles.inputError,
        disabled && styles.inputDisabled,
      ]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          style={[
            styles.input,
            icon && styles.inputWithIcon,
            multiline && styles.multilineInput,
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.gray400}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputDisabled: {
    backgroundColor: colors.gray100,
  },
  iconContainer: {
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSizes.md,
    color: colors.textPrimary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  multilineInput: {
    minHeight: 100,
    paddingTop: spacing.md,
  },
  errorText: {
    fontSize: typography.fontSizes.xs,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
