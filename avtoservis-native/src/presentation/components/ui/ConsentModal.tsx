import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@shared/constants/theme';
import { Button } from './Button';

interface ConsentModalProps {
  visible: boolean;
  onAccept: () => void;
  onDecline?: () => void;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({
  visible,
  onAccept,
  onDecline,
}) => {
  const [accepted, setAccepted] = useState(false);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Обработка персональных данных</Text>
          
          <Text style={styles.text}>
            Нажимая кнопку «Принять», вы соглашаетесь на обработку ваших персональных данных 
            в соответствии с Федеральным законом № 152-ФЗ «О персональных данных».
          </Text>
          
          <Text style={styles.text}>
            Мы собираем и обрабатываем следующие данные:
          </Text>
          
          <View style={styles.list}>
            <Text style={styles.listItem}>• Контактная информация (email, телефон)</Text>
            <Text style={styles.listItem}>• Информация об автомобилях</Text>
            <Text style={styles.listItem}>• История записей и обслуживания</Text>
            <Text style={styles.listItem}>• Данные о местоположении (опционально)</Text>
          </View>
          
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAccepted(!accepted)}
          >
            <View style={[styles.checkbox, accepted && styles.checkboxChecked]} />
            <Text style={styles.checkboxLabel}>
              Я принимаю условия обработки персональных данных
            </Text>
          </TouchableOpacity>
          
          <View style={styles.buttons}>
            <Button
              title="Принять"
              onPress={onAccept}
              disabled={!accepted}
              fullWidth
            />
            {onDecline && (
              <Button
                title="Отклонить"
                onPress={onDecline}
                variant="outline"
                fullWidth
                style={styles.declineButton}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modal: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    width: Dimensions.get('window').width - Spacing.xxl * 2,
    maxHeight: Dimensions.get('window').height * 0.8,
  },
  title: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  text: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    lineHeight: 22,
  },
  list: {
    marginVertical: Spacing.md,
    marginLeft: Spacing.md,
  },
  listItem: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxLabel: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    flex: 1,
  },
  buttons: {
    gap: Spacing.md,
  },
  declineButton: {
    marginTop: Spacing.sm,
  },
});

export default ConsentModal;
