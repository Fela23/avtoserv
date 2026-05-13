# React Native App - Автосервис

Полнофункциональное мобильное приложение для записи на автосервис, управления автомобилями, участия в тендерах и общения с мастерами.

## 📋 Требования к окружению

### Обязательные компоненты:
- **Node.js** >= 18.x ([скачать](https://nodejs.org/))
- **npm** или **yarn** (поставляется с Node.js)
- **React Native CLI**: `npm install -g react-native-cli`

### Для iOS разработки (только macOS):
- **Xcode** 14+ из Mac App Store
- **CocoaPods**: `sudo gem install cocoapods`

### Для Android разработки:
- **Android Studio** ([скачать](https://developer.android.com/studio))
- **Android SDK** (устанавливается через Android Studio)
- **Java Development Kit (JDK)** 17

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
cd avtoservis-native
npm install
```

### 2. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```bash
# API Base URL
API_BASE_URL=https://localhost:7002/api

# SignalR Hub URL
SIGNALR_HUB_URL=https://localhost:7002/hubs
```

### 3. Запуск приложения

#### Вариант A: Запуск Metro Bundler

```bash
npm start
```

В новом терминале запустите на устройстве:

#### Для Android:
```bash
npm run android
```

#### Для iOS (macOS):
```bash
cd ios
pod install
cd ..
npm run ios
```

## 📱 Эмуляторы и устройства

### Android
1. Откройте Android Studio
2. Создайте виртуальное устройство (AVD) через Device Manager
3. Запустите эмулятор перед запуском приложения

### iOS (macOS)
1. Откройте Xcode
2. Выберите симулятор из списка устройств
3. Запустите симулятор перед запуском приложения

## 🏗️ Структура проекта

```
avtoservis-native/
├── src/
│   ├── components/     # Переиспользуемые UI компоненты
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── LoadingSpinner.tsx
│   ├── pages/          # Экраны приложения
│   │   ├── LoginPage.tsx
│   │   └── DashboardPage.tsx
│   ├── navigation/     # Навигация
│   │   └── AppNavigator.tsx
│   ├── services/       # API и SignalR сервисы
│   │   ├── api.ts
│   │   ├── apiServices.ts
│   │   └── signalR.ts
│   ├── store/          # State management (Zustand)
│   │   └── index.ts
│   ├── types/          # TypeScript типы
│   │   └── index.ts
│   ├── hooks/          # Кастомные хуки
│   ├── assets/         # Изображения, шрифты
│   ├── utils/          # Утилиты
│   ├── theme.ts        # Тема, цвета, типографика
│   └── App.tsx         # Главный компонент
├── .env                # Переменные окружения
├── app.json            # Конфигурация приложения
├── babel.config.js     # Babel конфигурация
├── metro.config.js     # Metro bundler конфигурация
├── tsconfig.json       # TypeScript конфигурация
└── package.json        # Зависимости и скрипты
```

## 🔧 Доступные команды

| Команда | Описание |
|---------|----------|
| `npm start` | Запуск Metro bundler |
| `npm run android` | Запуск на Android |
| `npm run ios` | Запуск на iOS |
| `npm run test` | Запуск тестов |
| `npm run lint` | Проверка кода ESLint |
| `npm run typecheck` | Проверка типов TypeScript |

## 📦 Основные технологии

- **React Native** 0.73 - Кроссплатформенная разработка
- **TypeScript** - Типизация
- **Zustand** - State management
- **React Navigation** - Навигация
- **Axios** - HTTP клиент
- **SignalR** - Real-time коммуникация
- **AsyncStorage** - Локальное хранилище

## 🔐 Тестовые учетные данные

Используйте данные из файла `TEST_ENVIRONMENTS.md` в корне репозитория.

## 🐛 Решение проблем

### Ошибка: "Unrecognized command"
```bash
npx react-native start
```

### Ошибка iOS: "Command PhaseScriptExecution failed"
```bash
cd ios
pod deintegrate
pod install
```

### Ошибка Android: "SDK location not found"
Создайте файл `local.properties` в папке `android/`:
```
sdk.dir=/Users/username/Library/Android/sdk
```

### Метро не видит изменения
```bash
npm start -- --reset-cache
```

## 📝 Следующие шаги

Приложение имеет базовую структуру. Для полной реализации необходимо:

1. ✅ Настроено окружение и зависимости
2. ✅ Создана архитектура проекта
3. ✅ Реализованы базовые компоненты
4. ✅ Настроена навигация
5. ✅ Подключены API сервисы
6. ✅ Настроен SignalR для real-time обновлений
7. ⏳ Реализовать все экраны согласно SPEC.md
8. ⏳ Добавить обработку ошибок и лоадеры
9. ⏳ Протестировать на реальных устройствах
10. ⏳ Собрать релизные билды

## 📞 Поддержка

При возникновении проблем обратитесь к документации:
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
