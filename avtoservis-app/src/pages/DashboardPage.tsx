import React from 'react';
import { Card } from '@/components/Card';
import { useAppStore } from '@/store/appStore';

export const DashboardPage: React.FC = () => {
  const { user, cars, appointments, tenders } = useAppStore();

  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'Confirmed' || a.status === 'Pending'
  ).slice(0, 3);

  const activeTenders = tenders.filter((t) => t.status === 'Open').slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Добро пожаловать, {user?.firstName || 'Пользователь'}!
        </h2>
        <p className="text-blue-100">
          У вас {upcomingAppointments.length} предстоящих записей и {activeTenders.length} активных тендеров
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-3xl font-bold text-blue-600">{cars.length}</div>
          <div className="text-gray-600 mt-1">Автомобилей</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-green-600">
            {appointments.filter((a) => a.status === 'Completed').length}
          </div>
          <div className="text-gray-600 mt-1">Завершено</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-yellow-600">
            {upcomingAppointments.length}
          </div>
          <div className="text-gray-600 mt-1">Предстоящих</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-purple-600">{activeTenders.length}</div>
          <div className="text-gray-600 mt-1">Тендеров</div>
        </Card>
      </div>

      {/* Upcoming appointments */}
      <Card title="📅 Предстоящие записи" className="lg:col-span-2">
        {upcomingAppointments.length > 0 ? (
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-medium text-gray-900">
                    Запись на сервис
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(appointment.dateTime).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    appointment.status === 'Confirmed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {appointment.status === 'Confirmed' ? 'Подтверждено' : 'Ожидает'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Нет предстоящих записей</p>
        )}
      </Card>

      {/* Active tenders */}
      <Card title="📋 Активные тендеры" className="lg:col-span-2">
        {activeTenders.length > 0 ? (
          <div className="space-y-3">
            {activeTenders.map((tender) => (
              <div
                key={tender.id}
                className="p-3 bg-gray-50 rounded-lg"
              >
                <div className="font-medium text-gray-900 mb-1">
                  {tender.description}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Бюджет: {tender.budget ? `${tender.budget} ₽` : 'Не указан'}</span>
                  <span>{tender.offers.length} предложений</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Нет активных тендеров</p>
        )}
      </Card>

      {/* Quick actions */}
      <Card title="⚡ Быстрые действия">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <a
            href="/appointments/new"
            className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <span className="text-2xl mb-2">📅</span>
            <span className="text-sm font-medium text-gray-700">Записаться</span>
          </a>
          <a
            href="/cars/new"
            className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <span className="text-2xl mb-2">🚗</span>
            <span className="text-sm font-medium text-gray-700">Добавить авто</span>
          </a>
          <a
            href="/tenders/new"
            className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <span className="text-2xl mb-2">📋</span>
            <span className="text-sm font-medium text-gray-700">Создать тендер</span>
          </a>
          <a
            href="/chat"
            className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            <span className="text-2xl mb-2">💬</span>
            <span className="text-sm font-medium text-gray-700">Чат</span>
          </a>
        </div>
      </Card>
    </div>
  );
};
