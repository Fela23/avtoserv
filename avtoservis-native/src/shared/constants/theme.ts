/**
 * Цветовая палитра приложения «Автосервис»
 * На основе SPEC.md §2.1
 */

export const Colors = {
  // Primary
  primary: '#2563EB',        // Синий — основной акцент
  primaryLight: '#3B82F6',   // Светлый синий
  primaryDark: '#1D4ED8',    // Тёмный синий
  primaryBg: '#EFF6FF',      // Фон primary (светлая тема)

  // Semantic
  success: '#22C55E',        // Зелёный — завершено, онлайн
  warning: '#F59E0B',        // Жёлтый — предупреждение
  error: '#EF4444',          // Красный — ошибка, удаление
  info: '#3B82F6',           // Информация

  // Status badges
  statusConfirmed: '#22C55E',
  statusPending: '#F59E0B',
  statusCompleted: '#22C55E',
  statusCancelled: '#EF4444',
  statusInProgress: '#3B82F6',

  // Neutral (светлая тема)
  white: '#FFFFFF',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E2E8F0',
  divider: '#F1F5F9',

  // Text
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  textInverse: '#FFFFFF',
  textLink: '#2563EB',

  // Dark theme
  darkBackground: '#0F172A',
  darkSurface: '#1E293B',
  darkCard: '#1E293B',
  darkBorder: '#334155',
  darkTextPrimary: '#F8FAFC',
  darkTextSecondary: '#94A3B8',
};

/**
 * Типографика приложения
 * На основе SPEC.md §2.2
 */
export const Typography = {
  // Headings
  h1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34 },
  h2: { fontSize: 24, fontWeight: '600' as const, lineHeight: 30 },
  h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 26 },
  h4: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },

  // Body
  bodyLarge: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  body: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  bodySmall: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },

  // Labels
  label: { fontSize: 14, fontWeight: '500' as const, lineHeight: 20 },
  labelSmall: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16 },

  // Captions
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  captionBold: { fontSize: 12, fontWeight: '600' as const, lineHeight: 16 },

  // Buttons
  button: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
  buttonSmall: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
};

/**
 * Spacing (8pt grid)
 * На основе SPEC.md §2.3
 */
export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
  section: 48,
};

/**
 * Border Radius
 * На основе SPEC.md §2.4
 */
export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 9999,
};

/**
 * Тени
 * На основе SPEC.md §2.5
 */
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 } as const,
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 } as const,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 } as const,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};
