# 🔗 Backend Integration Guide: Мобильное приложение «Автосервис»

**Версия:** 1.1 | **Дата:** 14.05.2026 | **Источник:** ТЗ §3 + SPEC §7 + ARCHITECTURE §5 + GAP-ANALYSIS v3.2

---

## 1. Общая информация

### 1.1 Базовый URL

```typescript
// .env
EXPO_PUBLIC_API_URL=https://api.avtoserv.com
EXPO_PUBLIC_WS_URL=wss://api.avtoserv.com
```

### 1.2 Формат ответов

**Успешный ответ:**
```json
{
  "data": { ... },
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 150,
    "hasNextPage": true,
    "nextPage": 2
  }
}
```

**Ошибка:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Некорректные данные",
    "details": {
      "email": ["Некорректный формат email"]
    }
  }
}
```

### 1.3 Авторизация

Все запросы к защищённым endpoints содержат заголовок:
```
Authorization: Bearer <accessToken>
```

При `401 Unauthorized`:
1. Автоматически вызвать `POST /api/auth/refresh`
2. При успехе — обновить токен и повторить запрос
3. При ошибке refresh — редирект на LoginScreen

---

## 2. Auth Endpoints

### 2.1 POST /api/auth/login

| Параметр | Значение |
|----------|----------|
| **Экран** | LoginScreen |
| **React Query** | `useMutation(['auth', 'login'])` |
| **Кэш** | Нет |
| **Retry** | 0 (не повторять) |

**Request:**
```json
{
  "email": "user@example.com",
  "password": "string"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2g...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "Иван",
    "lastName": "Петров",
    "role": "client",
    "phone": "+79991234567",
    "avatarUrl": "https://..."
  }
}
```

**Ошибки:**
| Код | Описание | UI |
|-----|----------|-----|
| `AUTH_INVALID_CREDENTIALS` | Неверный email/пароль | Toast error |
| `AUTH_ACCOUNT_LOCKED` | Аккаунт заблокирован | Modal |
| `AUTH_EMAIL_NOT_CONFIRMED` | Email не подтверждён | Toast warning |

---

### 2.2 POST /api/auth/refresh

| Параметр | Значение |
|----------|----------|
| **Вызывается** | Автоматически (interceptor) |
| **React Query** | Нет (прямой вызов) |
| **Кэш** | Нет |

**Request:**
```json
{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2g..."
}
```

**Response (200):**
```json
{
  "token": "новый-access-token",
  "refreshToken": "новый-refresh-token",
  "user": { ... }
}
```

**Поведение:**
- При успехе: обновить оба токена в SecureStorage, повторить оригинальный запрос
- При ошибке: очистить SecureStorage, перейти на LoginScreen

---

### 2.3 POST /api/auth/logout

| Параметр | Значение |
|----------|----------|
| **Экран** | ProfileScreen, Sidebar |
| **React Query** | `useMutation(['auth', 'logout'])` |
| **Кэш** | Очистить все query кэши |

**Request:**
```json
{}
```

**Response (200):**
```json
{
  "message": "Вы вышли из аккаунта"
}
```

---

### 2.4 POST /api/auth/forgot-password

| Параметр | Значение |
|----------|----------|
| **Экран** | ForgotPasswordScreen |
| **React Query** | `useMutation(['auth', 'forgot'])` |
| **Кэш** | Нет |

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "Письмо для восстановления отправлено"
}
```

---

## 3. Profile Endpoints

### 3.1 GET /api/v1/users/me

| Параметр | Значение |
|----------|----------|
| **Экран** | ProfileScreen, HomeScreen |
| **React Query** | `useQuery(['user', 'me'])` |
| **Кэш** | staleTime: 30 мин |
| **Offline** | Кэш 30 мин |

**Response (200):**
```json
{
  "id": "uuid",
  "firstName": "Иван",
  "lastName": "Петров",
  "email": "user@example.com",
  "phone": "+79991234567",
  "role": "client",
  "twoFactorEnabled": false,
  "createdAt": "2024-01-15T10:00:00Z"
}
```

---

### 3.2 PUT /api/v1/users/me

| Параметр | Значение |
|----------|----------|
| **Экран** | ProfileScreen |
| **React Query** | `useMutation(['user', 'update'])` |
| **Инвалидация** | `['user', 'me']` |

**Request:**
```json
{
  "firstName": "Иван",
  "lastName": "Петров",
  "phone": "+79991234567",
  "avatarUrl": "https://..."
}
```

---

### 3.3 DELETE /api/v1/users/me

| Параметр | Значение |
|----------|----------|
| **Экран** | ProfileScreen (опасная зона) |
| **React Query** | `useMutation(['user', 'delete'])` |
| **Подтверждение** | Модальное окно: ввести пароль + чекбокс |

**Request:**
```json
{
  "password": "current-password"
}
```

**Поведение:** Очистка токенов → редирект на LoginScreen

---

## 4. Cars Endpoints

### 4.1 GET /api/v1/cars

| Параметр | Значение |
|----------|----------|
| **Экран** | CarsListScreen, HomeScreen |
| **React Query** | `useQuery(['cars', 'list'])` |
| **Кэш** | staleTime: 15 мин |
| **Offline** | Кэш 15 мин |

**Response (200):**
```json
{
  "cars": [
    {
      "id": "uuid",
      "brand": "Porsche",
      "model": "Cayenne S",
      "year": 2021,
      "licensePlate": "А123БВ777",
      "vin": "WP1ZZZ92ZMLA12345",
      "currentMileage": 45000,
      "color": "Чёрный",
      "isPrimary": true,
      "imageUrl": "https://..."
    }
  ]
}
```

---

### 4.2 POST /api/v1/cars

| Параметр | Значение |
|----------|----------|
| **Экран** | AddEditCarScreen |
| **React Query** | `useMutation(['cars', 'create'])` |
| **Инвалидация** | `['cars', 'list']` |

**Request:**
```json
{
  "brand": "Porsche",
  "model": "Cayenne S",
  "year": 2021,
  "licensePlate": "А123БВ777",
  "vin": "WP1ZZZ92ZMLA12345",
  "currentMileage": 45000,
  "color": "Чёрный",
  "isPrimary": true
}
```

**Валидация VIN:**
- Ровно 17 символов
- Допустимые символы: `A-HJ-NPR-Z0-9`
- Без O, I, Q

---

### 4.3 PUT /api/v1/cars/{id}

| Параметр | Значение |
|----------|----------|
| **Экран** | AddEditCarScreen |
| **React Query** | `useMutation(['cars', 'update', id])` |
| **Инвалидация** | `['cars', 'list']`, `['cars', id]` |

---

### 4.4 DELETE /api/v1/cars/{id}

| Параметр | Значение |
|----------|----------|
| **Экран** | CarsListScreen (модалка удаления) |
| **React Query** | `useMutation(['cars', 'delete', id])` |
| **Инвалидация** | `['cars', 'list']` |
| **Ограничение** | Нельзя удалить, если есть активные записи |

**Ошибки:**
| Код | Описание | UI |
|-----|----------|-----|
| `CONFLICT_CAR_HAS_APPOINTMENTS` | Есть активные записи | Toast error с текстом |

---

## 5. Appointments Endpoints

### 5.1 GET /api/v1/appointments

| Параметр | Значение |
|----------|----------|
| **Экран** | AppointmentsScreen, HomeScreen |
| **React Query** | `useInfiniteQuery(['appointments', 'list'])` |
| **Кэш** | staleTime: 5 мин |
| **Offline** | Кэш 5 мин |
| **Пагинация** | 20 элементов на страницу |

**Query params:**
```
?status=upcoming&carId=uuid&page=1&pageSize=20
```

**Response (200):**
```json
{
  "appointments": [
    {
      "id": "uuid",
      "carId": "uuid",
      "carBrand": "Porsche",
      "carModel": "Cayenne S",
      "serviceId": "uuid",
      "serviceName": "Техобслуживание",
      "scheduledDate": "2026-05-24",
      "scheduledTime": "15:00:00",
      "status": "Confirmed",
      "totalPrice": 8500,
      "description": "Посторонний шум при торможении",
      "masterName": "Алексей С."
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 45,
    "hasNextPage": true
  }
}
```

**Статусы:**
| Статус | Цвет бейджа | Описание |
|--------|------------|----------|
| `Draft` | Серый | Черновик |
| `New` | Жёлтый | Новая |
| `Confirmed` | Зелёный | Подтверждена |
| `InProgress` | Синий | В работе |
| `Completed` | Зелёный | Завершена |
| `Cancelled` | Красный | Отменена |

---

### 5.2 POST /api/v1/appointments

| Параметр | Значение |
|----------|----------|
| **Экран** | NewAppointmentScreen |
| **React Query** | `useMutation(['appointments', 'create'])` |
| **Инвалидация** | `['appointments']` |

**Request:**
```json
{
  "carId": "uuid",
  "serviceId": "uuid",
  "masterId": "uuid",  // необязательно
  "scheduledDate": "2026-05-25",
  "scheduledTime": "10:00:00",
  "description": "Посторонний шум при торможении"
}
```

---

### 5.3 PATCH /api/v1/appointments/{id}/reschedule

| Параметр | Значение |
|----------|----------|
| **Экран** | RescheduleModal |
| **React Query** | `useMutation(['appointments', 'reschedule', id])` |
| **Инвалидация** | `['appointments']` |

**Request:**
```json
{
  "newDate": "2026-05-27",
  "newTime": "14:00:00",
  "reason": "Не могу в указанное время"
}
```

---

### 5.4 PATCH /api/v1/appointments/{id}/cancel

| Параметр | Значение |
|----------|----------|
| **Экран** | CancelModal |
| **React Query** | `useMutation(['appointments', 'cancel', id])` |
| **Инвалидация** | `['appointments']` |

**Request:**
```json
{
  "reason": "Не подходит время",
  "comment": ""
}
```

**Причины отмены (выбор из списка):**
- Не подходит время
- Передумал
- Выбрал другой сервис
- Другое

---

## 6. Tenders Endpoints

### 6.1 GET /api/v1/tenders/my

| Параметр | Значение |
|----------|----------|
| **Экран** | TendersScreen |
| **React Query** | `useQuery(['tenders', 'list'])` |
| **Кэш** | staleTime: 5 мин |

**Response (200):**
```json
{
  "tenders": [
    {
      "id": "uuid",
      "carId": "uuid",
      "carBrand": "Porsche",
      "carModel": "Cayenne S",
      "status": "PendingApproval",
      "description": "Диагностика и ТО",
      "minBudget": 10000,
      "maxBudget": 15000,
      "deadline": "2026-05-28T00:00:00Z",
      "createdAt": "2026-05-10T10:00:00Z",
      "offers": [
        {
          "id": "uuid",
          "works": [
            { "name": "Техобслуживание", "price": 8500, "quantity": 1 }
          ],
          "parts": [
            { "name": "Масляный фильтр", "price": 1200, "quantity": 1 },
            { "name": "Моторное масло 5л", "price": 4800, "quantity": 1 }
          ],
          "totalPrice": 14500
        }
      ]
    }
  ]
}
```

**Статусы тендеров:**
| Статус | Цвет | Описание |
|--------|------|----------|
| `PendingApproval` | Жёлтый | На согласовании |
| `Approved` | Зелёный | Одобрено |
| `Rejected` | Красный | Отклонено |
| `Expired` | Серый | Срок истёк |
| `Completed` | Зелёный | Завершено |

---

### 6.2 POST /api/v1/tenders

| Параметр | Значение |
|----------|----------|
| **Экран** | CalculatorScreen |
| **React Query** | `useMutation(['tenders', 'create'])` |

**Request:**
```json
{
  "carId": "uuid",
  "description": "Диагностика и ТО",
  "priority": "Medium",
  "minBudget": 10000,
  "maxBudget": 15000,
  "allowAlternatives": true,
  "deadline": "2026-05-28T00:00:00Z"
}
```

**Приоритеты:** `Low`, `Medium`, `High`, `Urgent`

---

### 6.3 POST /api/v1/tenders/{id}/accept

| Параметр | Значение |
|----------|----------|
| **Экран** | TenderDetailScreen |
| **React Query** | `useMutation(['tenders', 'accept', id])` |
| **Инвалидация** | `['tenders']` |

---

### 6.4 POST /api/v1/tenders/{id}/decline

| Параметр | Значение |
|----------|----------|
| **Экран** | TenderDetailScreen |
| **React Query** | `useMutation(['tenders', 'decline', id])` |
| **Инвалидация** | `['tenders']` |

---

### 6.5 POST /api/v1/tenders/{id}/convert

| Параметр | Значение |
|----------|----------|
| **Экран** | TenderToAppointmentWizard |
| **React Query** | `useMutation(['tenders', 'convert', id])` |
| **Инвалидация** | `['tenders']`, `['appointments']` |

**Поведение:** Конвертирует одобренный тендер в запись на обслуживание. Автоматически переносит работы и запчасти из тендера.

---

## 7. Chat Endpoints

### 7.1 GET /api/v1/chat/conversations

| Параметр | Значение |
|----------|----------|
| **Экран** | ChatListScreen |
| **React Query** | `useQuery(['chat', 'conversations'])` |
| **Кэш** | staleTime: 2 мин |

**Response (200):**
```json
{
  "conversations": [
    {
      "id": "uuid",
      "subject": "Сервис-центр",
      "lastMessage": "Запись подтверждена",
      "unreadCount": 2,
      "updatedAt": "2026-05-12T10:30:00Z",
      "participantName": "Алексей С.",
      "participantAvatar": "https://..."
    }
  ]
}
```

---

### 7.2 GET /api/v1/chat/conversations/{id}/messages

| Параметр | Значение |
|----------|----------|
| **Экран** | ChatScreen |
| **React Query** | `useInfiniteQuery(['chat', 'messages', id])` |
| **Кэш** | staleTime: 1 мин |
| **Пагинация** | 50 сообщений на страницу (старые загружаются при скролле вверх) |

**Response (200):**
```json
{
  "messages": [
    {
      "id": "uuid",
      "conversationId": "uuid",
      "senderId": "uuid",
      "senderType": "manager",
      "senderName": "Алексей С.",
      "text": "Здравствуйте! Чем могу помочь?",
      "sentAt": "2026-05-12T10:30:00Z",
      "status": "Read",
      "attachments": []
    }
  ],
  "meta": {
    "hasMore": true,
    "oldestMessageId": "uuid"
  }
}
```

**Статусы сообщений:**
| Статус | Иконка | Описание |
|--------|--------|----------|
| `Sent` | Одна галочка | Отправлено |
| `Delivered` | Две галочки | Доставлено |
| `Read` | Две галочки (синие) | Прочитано |

---

### 7.3 POST /api/v1/chat/conversations/{id}/messages

| Параметр | Значение |
|----------|----------|
| **Экран** | ChatScreen |
| **React Query** | Optimistic update (без useMutation) |
| **Real-time** | SignalR `/hubs/chat` |

**Request:**
```json
{
  "text": "Фото проблемы",
  "attachmentIds": ["uuid-файла"]
}
```

**Поведение (Optimistic UI):**
1. Добавить сообщение в UI со статусом `pending`
2. Отправить через SignalR
3. При успехе: статус → `sent`
4. При ошибке: статус → `error` + кнопка «Повторить»

---

### 7.4 POST /api/v1/upload

| Параметр | Значение |
|----------|----------|
| **Экран** | ChatScreen (кнопка «Скрепка») |
| **Тип** | multipart/form-data |

**Request:**
```
file: [binary data]
```

**Response (200):**
```json
{
  "id": "uuid",
  "url": "https://...",
  "mimeType": "image/jpeg",
  "size": 1024000
}
```

**Ограничения:**
- Максимальный размер: 10 МБ
- Форматы: jpg, png, pdf

---

## 8. SignalR Hub

### 8.1 /hubs/chat

| Параметр | Значение |
|----------|----------|
| **Транспорт** | WebSockets + fallback LongPolling |
| **Авто-переподключение** | Да (exponential backoff) |
| **Heartbeat** | 30 сек |

**События:**
| Событие | Описание | UI-эффект |
|---------|----------|-----------|
| `ReceiveMessage` | Новое сообщение | Добавить в UI + badge |
| `TypingIndicator` | Пользователь печатает | Показать «Печатает...» |
| `MessageStatusUpdate` | Статус сообщения | Обновить галочки |
| `UserOnline` | Пользователь онлайн | Зелёная точка |
| `UserOffline` | Пользователь оффлайн | Серая точка |

**Методы:**
```typescript
hub.invoke('SendMessage', conversationId, text);
hub.invoke('SendTypingIndicator', conversationId);
hub.invoke('MarkAsRead', conversationId, messageId);
```

---

### 8.2 /notificationHub

| Параметр | Значение |
|----------|----------|
| **Транспорт** | WebSockets + fallback LongPolling |
| **Использование** | Real-time уведомления в приложении |

**События:**
| Событие | Описание | UI-эффект |
|---------|----------|-----------|
| `ReceiveNotification` | Новое уведомление | Badge + Toast |
| `NotificationRead` | Уведомление прочитано | Обновить badge |

---

## 9. Reminders Endpoints

### 9.1 GET /api/v1/reminders

| Параметр | Значение |
|----------|----------|
| **Экран** | RemindersListScreen |
| **React Query** | `useQuery(['reminders', 'my'])` |
| **Кэш** | staleTime: 10 мин |

**Response (200):**
```json
{
  "reminders": [
    {
      "id": "uuid",
      "carId": "uuid",
      "carBrand": "Porsche",
      "carModel": "Cayenne S",
      "title": "Замена масла в двигателе",
      "triggerType": "Combined",
      "intervalKm": 60000,
      "intervalMonths": 12,
      "currentMileage": 45000,
      "nextDueKm": 48000,
      "nextDueDate": "2026-06-15",
      "status": "Active",
      "advanceNoticeDays": 14,
      "advanceNoticeKm": 2000
    }
  ]
}
```

---

### 9.2 POST /api/v1/reminders

| Параметр | Значение |
|----------|----------|
| **Экран** | AddEditReminderScreen |
| **React Query** | `useMutation(['reminders', 'create'])` |
| **Инвалидация** | `['reminders']` |

**Request:**
```json
{
  "carId": "uuid",
  "title": "Замена ГРМ",
  "triggerType": "Combined",
  "intervalKm": 90000,
  "intervalMonths": 48,
  "advanceNoticeDays": 14,
  "advanceNoticeKm": 2000
}
```

**Типы триггеров:**
| Тип | Описание |
|-----|----------|
| `DateOnly` | Только по дате |
| `MileageOnly` | Только по пробегу |
| `Combined` | Комбинированный (что наступит раньше) |

---

### 9.3 GET /api/v1/notifications/templates

| Параметр | Значение |
|----------|----------|
| **Экран** | AddEditReminderScreen |
| **React Query** | `useQuery(['reminders', 'templates'])` |
| **Кэш** | staleTime: 60 мин |

**Response (200):**
```json
{
  "templates": [
    {
      "id": "uuid",
      "name": "Масло в АКПП",
      "icon": "⚙️",
      "recommendedIntervalKm": 60000,
      "recommendedIntervalMonths": 48,
      "description": "Замена масла в автоматической коробке передач"
    }
  ]
}
```

---

### 9.4 PUT /api/v1/driving-profile

| Параметр | Значение |
|----------|----------|
| **Экран** | DrivingProfileScreen |
| **React Query** | `useMutation(['driving-profile', 'update'])` |

**Request:**
```json
{
  "carId": "uuid",
  "profileType": "Preset",
  "preset": "Medium",
  "avgKmPerMonth": null
}
```

**Пресеты:**
| Значение | Описание | Км/мес |
|----------|----------|--------|
| `Low` | Редко | ~500 |
| `Medium` | Средне | ~1500 |
| `High` | Часто | ~3000+ |
| `Custom` | Точный ввод | Значение `avgKmPerMonth` |

---

## 10. Bonuses Endpoints

### 10.1 GET /api/v1/bonuses/balance

| Параметр | Значение |
|----------|----------|
| **Экран** | HomeScreen, BonusesScreen |
| **React Query** | `useQuery(['bonuses', 'balance'])` |
| **Кэш** | staleTime: 10 мин |

**Response (200):**
```json
{
  "balance": 2450,
  "currency": "RUB",
  "level": "Silver",
  "nextLevel": "Gold",
  "amountToNextLevel": 550,
  "cashbackPercent": 5,
  "totalEarned": 12450,
  "totalSpent": 10000
}
```

---

### 10.2 GET /api/v1/bonuses/history

| Параметр | Значение |
|----------|----------|
| **Экран** | BonusesScreen |
| **React Query** | `useQuery(['bonuses', 'history'])` |
| **Кэш** | staleTime: 10 мин |

**Response (200):**
```json
{
  "operations": [
    {
      "id": "uuid",
      "type": "credit",
      "amount": 200,
      "description": "За запись №1245",
      "createdAt": "2026-05-24T15:00:00Z"
    }
  ]
}
```

**Типы операций:**
| Тип | Знак | Описание |
|-----|------|----------|
| `credit` | + | Начисление |
| `debit` | - | Списание |

---

### 10.3 POST /api/v1/bonuses/promo

| Параметр | Значение |
|----------|----------|
| **Экран** | BonusesScreen |
| **React Query** | `useMutation(['bonuses', 'promo'])` |
| **Инвалидация** | `['bonuses', 'balance']`, `['bonuses', 'history']` |

**Request:**
```json
{
  "code": "FRIEND2026"
}
```

---

### 10.4 GET /api/v1/bonuses/referral-code

| Параметр | Значение |
|----------|----------|
| **Экран** | BonusesScreen |
| **React Query** | `useQuery(['bonuses', 'referralCode'])` |
| **Кэш** | staleTime: 60 мин |

**Response (200):**
```json
{
  "code": "IVAN2026",
  "referralLink": "https://avtoserv.com/ref/IVAN2026"
}
```

---

## 11. Notifications Endpoints

### 11.1 GET /api/v1/notifications

| Параметр | Значение |
|----------|----------|
| **Экран** | NotificationsScreen |
| **React Query** | `useInfiniteQuery(['notifications'])` |
| **Кэш** | staleTime: 2 мин |

**Response (200):**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "type": "appointment_confirmed",
      "title": "Запись подтверждена",
      "text": "Ваша запись на 24 мая подтверждена",
      "isRead": false,
      "createdAt": "2026-05-12T10:00:00Z",
      "deepLink": "/appointments/uuid"
    }
  ]
}
```

**Типы уведомлений:**
| Тип | Иконка | Цвет | Deep Link |
|-----|--------|------|-----------|
| `appointment_confirmed` | 📅 | Синий | `/appointments/{id}` |
| `appointment_cancelled` | 📅 | Красный | `/appointments/{id}` |
| `tender_offer` | 📋 | Синий | `/tenders/{id}` |
| `chat_message` | 💬 | Синий | `/chat/{id}` |
| `bonus_earned` | 🎁 | Зелёный | `/bonuses` |
| `reminder_due` | 🔔 | Жёлтый | `/reminders` |
| `system` | ℹ️ | Серый | — |

---

### 11.2 PATCH /api/v1/notifications/{id}/read

| Параметр | Значение |
|----------|----------|
| **Экран** | NotificationsScreen |
| **React Query** | `useMutation(['notifications', 'markRead'])` |

---

### 11.3 POST /api/v1/notifications/read-all

| Параметр | Значение |
|----------|----------|
| **Экран** | NotificationsScreen (кнопка «Прочитать все») |
| **React Query** | `useMutation(['notifications', 'markAllRead'])` |

---

## 12. Settings Endpoints

### 12.1 GET /api/v1/clients/{id}/settings

| Параметр | Значение |
|----------|----------|
| **Экран** | SettingsScreen |
| **React Query** | `useQuery(['settings'])` |
| **Кэш** | staleTime: 30 мин |

**Response (200):**
```json
{
  "notifications": {
    "pushEnabled": true,
    "emailEnabled": true,
    "smsEnabled": false,
    "statusChangeEnabled": true,
    "marketingEnabled": false
  },
  "appearance": {
    "theme": "system"
  },
  "language": "ru",
  "privacy": {
    "hideProfile": false,
    "maskVin": false,
    "allowAnalytics": true
  }
}
```

---

### 12.2 PUT /api/v1/clients/{id}/settings

| Параметр | Значение |
|----------|----------|
| **Экран** | SettingsScreen |
| **React Query** | `useMutation(['settings', 'update'])` |
| **Инвалидация** | `['settings']` |

---

## 13. History & Documents Endpoints

### 13.1 GET /api/v1/service-history

| Параметр | Значение |
|----------|----------|
| **Экран** | HistoryScreen |
| **React Query** | `useInfiniteQuery(['history', 'list'])` |
| **Кэш** | staleTime: 10 мин |

**Query params:**
```
?carId=uuid&serviceType=string&dateFrom=2026-01-01&dateTo=2026-05-12&page=1
```

---

### 13.2 GET /api/v1/service-history/export

| Параметр | Значение |
|----------|----------|
| **Экран** | HistoryScreen |
| **React Query** | `useQuery(['history', 'export'])` |
| **Ответ** | PDF или CSV файл |

**Query params:**
```
?format=pdf&carId=uuid
```

---

### 13.3 GET /api/v1/clients/{id}/documents

| Параметр | Значение |
|----------|----------|
| **Экран** | HistoryScreen |
| **React Query** | `useQuery(['documents', 'list'])` |
| **Кэш** | staleTime: 30 мин |

---

### 13.4 GET /api/v1/clients/{id}/documents/{docId}/download

| Параметр | Значение |
|----------|----------|
| **Экран** | HistoryScreen |
| **React Query** | `useQuery(['documents', 'download', docId])` |
| **Ответ** | PDF файл |
| **Кэш** | `FileSystem.documentDirectory` (30 дней) |

---

## 14. Push Notifications Registration

### 14.1 POST /api/v1/notifications/register

| Параметр | Значение |
|----------|----------|
| **Вызывается** | При запуске приложения |
| **React Query** | Нет (прямой вызов) |

**Request:**
```json
{
  "token": "expo-push-token",
  "platform": "ios",
  "deviceInfo": {
    "model": "iPhone 15",
    "osVersion": "17.4"
  }
}
```

---

## 15. Сводная таблица: Endpoint → Экран → React Query Key

| # | Endpoint | Метод | Экран | React Query Key | Кэш |
|---|----------|-------|-------|-----------------|-----|
| 1 | `/api/auth/login` | POST | LoginScreen | `['auth', 'login']` | Нет |
| 2 | `/api/auth/refresh` | POST | (автоматически) | — | Нет |
| 3 | `/api/auth/logout` | POST | ProfileScreen | `['auth', 'logout']` | Очистить |
| 4 | `/api/auth/forgot-password` | POST | ForgotPassword | `['auth', 'forgot']` | Нет |
| 5 | `/api/v1/users/me` | GET | ProfileScreen | `['user', 'me']` | 30 мин |
| 6 | `/api/v1/users/me` | PUT | ProfileScreen | `['user', 'update']` | Инв. |
| 7 | `/api/v1/users/me` | DELETE | ProfileScreen | `['user', 'delete']` | — |
| 8 | `/api/v1/cars` | GET | CarsListScreen | `['cars', 'list']` | 15 мин |
| 9 | `/api/v1/cars` | POST | AddEditCar | `['cars', 'create']` | Инв. |
| 10 | `/api/v1/cars/{id}` | PUT | AddEditCar | `['cars', 'update']` | Инв. |
| 11 | `/api/v1/cars/{id}` | DELETE | CarsList | `['cars', 'delete']` | Инв. |
| 12 | `/api/v1/appointments` | GET | AppointmentsScreen | `['appointments', 'list']` | 5 мин |
| 13 | `/api/v1/appointments` | POST | NewAppointment | `['appointments', 'create']` | Инв. |
| 14 | `/api/v1/appointments/{id}/reschedule` | PATCH | RescheduleModal | `['appointments', 'reschedule']` | Инв. |
| 15 | `/api/v1/appointments/{id}/cancel` | PATCH | CancelModal | `['appointments', 'cancel']` | Инв. |
| 16 | `/api/v1/tenders/my` | GET | TendersScreen | `['tenders', 'list']` | 5 мин |
| 17 | `/api/v1/tenders` | POST | CalculatorScreen | `['tenders', 'create']` | Инв. |
| 18 | `/api/v1/tenders/{id}/accept` | POST | TenderDetail | `['tenders', 'accept']` | Инв. |
| 19 | `/api/v1/tenders/{id}/decline` | POST | TenderDetail | `['tenders', 'decline']` | Инв. |
| 20 | `/api/v1/tenders/{id}/convert` | POST | TenderWizard | `['tenders', 'convert']` | Инв. |
| 21 | `/api/v1/reminders` | GET | RemindersList | `['reminders', 'my']` | 10 мин |
| 22 | `/api/v1/reminders` | POST | AddEditReminder | `['reminders', 'create']` | Инв. |
| 23 | `/api/v1/notifications/templates` | GET | AddEditReminder | `['reminders', 'templates']` | 60 мин |
| 24 | `/api/v1/driving-profile` | GET | DrivingProfile | `['driving-profile']` | 30 мин |
| 25 | `/api/v1/driving-profile` | PUT | DrivingProfile | `['driving-profile', 'update']` | Инв. |
| 26 | `/api/v1/chat/conversations` | GET | ChatListScreen | `['chat', 'conversations']` | 2 мин |
| 27 | `/api/v1/chat/conversations/{id}/messages` | GET | ChatScreen | `['chat', 'messages']` | 1 мин |
| 28 | `/api/v1/upload` | POST | ChatScreen | — | Нет |
| 29 | `/api/v1/users/me` | GET | HomeScreen | `['user', 'me']` | 30 мин |
| 30 | `/api/v1/bonuses/balance` | GET | HomeScreen/Bonuses | `['bonuses', 'balance']` | 10 мин |
| 31 | `/api/v1/bonuses/history` | GET | BonusesScreen | `['bonuses', 'history']` | 10 мин |
| 32 | `/api/v1/bonuses/promo` | POST | BonusesScreen | `['bonuses', 'promo']` | Инв. |
| 33 | `/api/v1/bonuses/referral-code` | GET | BonusesScreen | `['bonuses', 'referralCode']` | 60 мин |
| 34 | `/api/v1/service-history` | GET | HistoryScreen | `['history', 'list']` | 10 мин |
| 35 | `/api/v1/service-history/export` | GET | HistoryScreen | `['history', 'export']` | Нет |
| 36 | `/api/v1/clients/{id}/documents` | GET | HistoryScreen | `['documents', 'list']` | 30 мин |
| 37 | `/api/v1/clients/{id}/documents/{docId}/download` | GET | HistoryScreen | `['documents', 'download']` | Файл |
| 38 | `/api/v1/clients/{id}/settings` | GET | SettingsScreen | `['settings']` | 30 мин |
| 39 | `/api/v1/clients/{id}/settings` | PUT | SettingsScreen | `['settings', 'update']` | Инв. |
| 40 | `/api/v1/notifications` | GET | NotificationsScreen | `['notifications']` | 2 мин |
| 41 | `/api/v1/notifications/{id}/read` | PATCH | NotificationsScreen | `['notifications', 'markRead']` | Инв. |
| 42 | `/api/v1/notifications/read-all` | POST | NotificationsScreen | `['notifications', 'markAllRead']` | Инв. |
| 43 | `/api/v1/notifications/register` | POST | (при запуске) | — | Нет |
| 44 | SignalR `/hubs/chat` | WS | ChatScreen | — | Event |
| 45 | SignalR `/notificationHub` | WS | (все экраны) | — | Event |
| 46 | `expo-local-authentication` | Local | LoginScreen | — | Нет |

---

### 13.5 POST /api/v1/service-history/manual

| Параметр | Значение |
|----------|----------|
| **Экран** | AddManualRecordScreen |
| **React Query** | `useMutation(['history', 'create'])` |
| **Инвалидация** | `['history', 'list']` |
| **Описание** | Ручное добавление записи обслуживания с другого СТО |

**Request (multipart/form-data):**

| Поле | Тип | Описание | Валидация |
|------|-----|----------|-----------|
| `carId` | UUID | ID автомобиля | Обязательно |
| `date` | ISO8601 | Дата обслуживания | ≤ сегодня |
| `provider` | string | Название СТО | Обязательно, 2-200 символов |
| `service` | string | Описание услуги | Обязательно, 2-500 символов |
| `price` | number | Стоимость | ≥ 0 |
| `mileage` | number | Пробег на момент обслуживания | ≥ 0 |
| `attachments` | File[] | Фото акта/чека | До 3 файлов, JPG/PDF, макс 10 МБ каждый |

**Response (201):**
```json
{
  "id": "uuid",
  "carId": "uuid",
  "date": "2026-05-10T00:00:00Z",
  "provider": "СТО АвтоМастер",
  "service": "Замена масла",
  "price": 3500,
  "mileage": 45000,
  "status": "pending_review",
  "isExternal": true,
  "createdAt": "2026-05-12T10:00:00Z"
}
```

**Статусы:**
| Статус | Описание |
|--------|----------|
| `pending_review` | Ожидает проверки менеджером |
| `approved` | Одобрено и добавлено в историю |
| `rejected` | Отклонено (менеджером) |

**Примечания:**
- Записи с внешних СТО проходят модерацию (`isExternal: true`)
- Прикреплённые файлы загружаются через `multipart/form-data`
- После проверки менеджером статус меняется на `approved` или `rejected`

---

## 16. Сводная таблица: Endpoint → Экран → React Query Key

| # | Endpoint | Метод | Экран | React Query Key | Кэш |
|---|----------|-------|-------|-----------------|-----|
| 1 | `/api/auth/login` | POST | LoginScreen | `['auth', 'login']` | Нет |
| 2 | `/api/auth/refresh` | POST | (автоматически) | — | Нет |
| 3 | `/api/auth/logout` | POST | ProfileScreen | `['auth', 'logout']` | Очистить |
| 4 | `/api/auth/forgot-password` | POST | ForgotPassword | `['auth', 'forgot']` | Нет |
| 5 | `/api/v1/users/me` | GET | ProfileScreen | `['user', 'me']` | 30 мин |
| 6 | `/api/v1/users/me` | PUT | ProfileScreen | `['user', 'update']` | Инв. |
| 7 | `/api/v1/users/me` | DELETE | ProfileScreen | `['user', 'delete']` | — |
| 8 | `/api/v1/cars` | GET | CarsListScreen | `['cars', 'list']` | 15 мин |
| 9 | `/api/v1/cars` | POST | AddEditCar | `['cars', 'create']` | Инв. |
| 10 | `/api/v1/cars/{id}` | PUT | AddEditCar | `['cars', 'update']` | Инв. |
| 11 | `/api/v1/cars/{id}` | DELETE | CarsList | `['cars', 'delete']` | Инв. |
| 12 | `/api/v1/appointments` | GET | AppointmentsScreen | `['appointments', 'list']` | 5 мин |
| 13 | `/api/v1/appointments` | POST | NewAppointment | `['appointments', 'create']` | Инв. |
| 14 | `/api/v1/appointments/{id}/reschedule` | PATCH | RescheduleModal | `['appointments', 'reschedule']` | Инв. |
| 15 | `/api/v1/appointments/{id}/cancel` | PATCH | CancelModal | `['appointments', 'cancel']` | Инв. |
| 16 | `/api/v1/tenders/my` | GET | TendersScreen | `['tenders', 'list']` | 5 мин |
| 17 | `/api/v1/tenders` | POST | CalculatorScreen | `['tenders', 'create']` | Инв. |
| 18 | `/api/v1/tenders/{id}/accept` | POST | TenderDetail | `['tenders', 'accept']` | Инв. |
| 19 | `/api/v1/tenders/{id}/decline` | POST | TenderDetail | `['tenders', 'decline']` | Инв. |
| 20 | `/api/v1/tenders/{id}/convert` | POST | TenderWizard | `['tenders', 'convert']` | Инв. |
| 21 | `/api/v1/reminders` | GET | RemindersList | `['reminders', 'my']` | 10 мин |
| 22 | `/api/v1/reminders` | POST | AddEditReminder | `['reminders', 'create']` | Инв. |
| 23 | `/api/v1/notifications/templates` | GET | AddEditReminder | `['reminders', 'templates']` | 60 мин |
| 24 | `/api/v1/driving-profile` | GET | DrivingProfile | `['driving-profile']` | 30 мин |
| 25 | `/api/v1/driving-profile` | PUT | DrivingProfile | `['driving-profile', 'update']` | Инв. |
| 26 | `/api/v1/chat/conversations` | GET | ChatListScreen | `['chat', 'conversations']` | 2 мин |
| 27 | `/api/v1/chat/conversations/{id}/messages` | GET | ChatScreen | `['chat', 'messages']` | 1 мин |
| 28 | `/api/v1/upload` | POST | ChatScreen | — | Нет |
| 29 | `/api/v1/users/me` | GET | HomeScreen | `['user', 'me']` | 30 мин |
| 30 | `/api/v1/bonuses/balance` | GET | HomeScreen/Bonuses | `['bonuses', 'balance']` | 10 мин |
| 31 | `/api/v1/bonuses/history` | GET | BonusesScreen | `['bonuses', 'history']` | 10 мин |
| 32 | `/api/v1/bonuses/promo` | POST | BonusesScreen | `['bonuses', 'promo']` | Инв. |
| 33 | `/api/v1/bonuses/referral-code` | GET | BonusesScreen | `['bonuses', 'referralCode']` | 60 мин |
| 34 | `/api/v1/service-history` | GET | HistoryScreen | `['history', 'list']` | 10 мин |
| 35 | `/api/v1/service-history/export` | GET | HistoryScreen | `['history', 'export']` | Нет |
| 36 | `/api/v1/service-history/manual` | POST | AddManualRecord | `['history', 'create']` | Инв. |
| 37 | `/api/v1/clients/{id}/documents` | GET | HistoryScreen | `['documents', 'list']` | 30 мин |
| 38 | `/api/v1/clients/{id}/documents/{docId}/download` | GET | HistoryScreen | `['documents', 'download']` | Файл |
| 39 | `/api/v1/clients/{id}/settings` | GET | SettingsScreen | `['settings']` | 30 мин |
| 40 | `/api/v1/clients/{id}/settings` | PUT | SettingsScreen | `['settings', 'update']` | Инв. |
| 41 | `/api/v1/notifications` | GET | NotificationsScreen | `['notifications']` | 2 мин |
| 42 | `/api/v1/notifications/{id}/read` | PATCH | NotificationsScreen | `['notifications', 'markRead']` | Инв. |
| 43 | `/api/v1/notifications/read-all` | POST | NotificationsScreen | `['notifications', 'markAllRead']` | Инв. |
| 44 | `/api/v1/notifications/register` | POST | (при запуске) | — | Нет |
| 45 | SignalR `/hubs/chat` | WS | ChatScreen | — | Event |
| 46 | SignalR `/notificationHub` | WS | (все экраны) | — | Event |
| 47 | `expo-local-authentication` | Local | LoginScreen | — | Нет |

---

*Конец Backend Integration Guide. 47 endpoints, 16 секций, полный маппинг на компоненты.*
