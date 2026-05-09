import { toast } from '@/hooks/use-toast';

const NOTIFICATIONS_KEY = 'besteamhn-notifications';
export const NOTIFICATIONS_EVENT = 'besteamhn-notifications-updated';

export type NotificationType = 'course' | 'progress' | 'reward' | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
  href?: string;
}

function readNotifications(): AppNotification[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    return stored ? (JSON.parse(stored) as AppNotification[]) : [];
  } catch {
    return [];
  }
}

function writeNotifications(notifications: AppNotification[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  window.dispatchEvent(new Event(NOTIFICATIONS_EVENT));
}

export function getNotifications() {
  return readNotifications();
}

export function addNotification(notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) {
  const nextNotification: AppNotification = {
    ...notification,
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
    read: false,
  };

  writeNotifications([nextNotification, ...readNotifications()].slice(0, 30));
  toast({
    title: nextNotification.title,
    description: nextNotification.description,
  });

  return nextNotification;
}

export function markNotificationRead(notificationId: string) {
  writeNotifications(
    readNotifications().map((notification) =>
      notification.id === notificationId ? { ...notification, read: true } : notification,
    ),
  );
}

export function markAllNotificationsRead() {
  writeNotifications(readNotifications().map((notification) => ({ ...notification, read: true })));
}

export function removeNotification(notificationId: string) {
  writeNotifications(readNotifications().filter((notification) => notification.id !== notificationId));
}

export function clearNotifications() {
  writeNotifications([]);
}

export function seedNotificationsIfEmpty(locale: 'es' | 'en') {
  if (readNotifications().length > 0) return;

  const now = new Date();
  writeNotifications([
    {
      id: 'welcome',
      type: 'system',
      title: locale === 'es' ? 'Centro de notificaciones activo' : 'Notification center active',
      description: locale === 'es' ? 'Aqui veras cursos, progreso y recompensas.' : 'Courses, progress, and rewards will appear here.',
      createdAt: now.toISOString(),
      read: false,
      href: '/dashboard',
    },
  ]);
}
