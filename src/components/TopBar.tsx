import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSteamBalance } from '@/hooks/useSteamBalance';
import { Coins, Bell, CheckCheck, Globe, LogOut, Trash2, User, X } from 'lucide-react';
import {
  clearNotifications,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  NOTIFICATIONS_EVENT,
  removeNotification,
  seedNotificationsIfEmpty,
  type AppNotification,
} from '@/lib/notifications';

export default function TopBar() {
  const { locale, setLocale, t } = useI18n();
  const { publicKey } = useWallet();
  const { user, signOut } = useAuth();
  const { balance } = useSteamBalance();
  const [notifications, setNotifications] = useState<AppNotification[]>(() => getNotifications());
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement | null>(null);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const toggleLocale = () => setLocale(locale === 'es' ? 'en' : 'es');

  useEffect(() => {
    seedNotificationsIfEmpty(locale);
    setNotifications(getNotifications());
    const refresh = () => setNotifications(getNotifications());
    window.addEventListener(NOTIFICATIONS_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(NOTIFICATIONS_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [locale]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!notificationsRef.current?.contains(e.target as Node)) setIsNotificationsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notificationTypeLabel: Record<AppNotification['type'], string> = {
    course:   locale === 'es' ? 'Curso'    : 'Course',
    progress: locale === 'es' ? 'Progreso' : 'Progress',
    reward:   'STEAM',
    system:   locale === 'es' ? 'Sistema'  : 'System',
  };

  const formatNotificationTime = (createdAt: string) => {
    const diffMs  = Date.now() - new Date(createdAt).getTime();
    const minutes = Math.max(1, Math.round(diffMs / 60000));
    if (minutes < 60) return locale === 'es' ? `Hace ${minutes} min` : `${minutes}m ago`;
    const hours = Math.round(minutes / 60);
    if (hours < 24)  return locale === 'es' ? `Hace ${hours} h`   : `${hours}h ago`;
    return new Date(createdAt).toLocaleDateString(locale === 'es' ? 'es-HN' : 'en-US');
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between gap-2 border-b border-pink-100/40 glass px-3 sm:px-5 lg:left-64 lg:px-6">
      {/* Left */}
      <div className="flex min-w-0 items-center gap-2">
        {publicKey && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-700">Devnet</span>
          </div>
        )}
      </div>

      {/* Right */}
      <div className="flex min-w-0 items-center gap-1.5 sm:gap-2.5">
        {/* STEAM Balance */}
        <div className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 px-3 py-1.5 shadow-md shadow-amber-200/60 sm:flex">
          <Coins className="h-4 w-4 text-white" />
          <span className="text-sm font-bold text-white">{balance}</span>
          <span className="text-xs font-medium text-white/80">{t.common.steamTokens}</span>
        </div>

        {/* Language */}
        <button
          onClick={toggleLocale}
          className="flex h-9 items-center gap-1.5 rounded-xl border border-pink-100/60 bg-white/60 px-2.5 text-xs font-medium text-gray-700 transition-base hover:bg-white/90 backdrop-blur-sm sm:px-3 sm:text-sm"
          title={locale === 'es' ? 'Switch to English' : 'Cambiar a Español'}
        >
          <Globe className="h-4 w-4 text-pink-400" />
          <span>{locale === 'es' ? '🇭🇳 ES' : '🇺🇸 EN'}</span>
        </button>

        {/* Notifications */}
        <div ref={notificationsRef} className="relative">
          <button
            onClick={() => setIsNotificationsOpen((o) => !o)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-pink-100/60 bg-white/60 text-gray-500 transition-base hover:bg-white/90 backdrop-blur-sm"
            title={locale === 'es' ? 'Notificaciones' : 'Notifications'}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink-500 px-1 text-[10px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-11 z-50 w-[calc(100vw-1.5rem)] max-w-96 overflow-hidden rounded-2xl border border-pink-100/40 bg-white/96 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">{locale === 'es' ? 'Notificaciones' : 'Notifications'}</h2>
                  <p className="text-xs text-gray-400">{unreadCount} {locale === 'es' ? 'sin leer' : 'unread'}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => { markAllNotificationsRead(); setNotifications(getNotifications()); }}
                    title={locale === 'es' ? 'Marcar todo leido' : 'Mark all read'}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-pink-50 hover:text-pink-600"
                  >
                    <CheckCheck className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => { clearNotifications(); setNotifications([]); }}
                    title={locale === 'es' ? 'Limpiar' : 'Clear'}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto p-2">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
                    <Bell className="h-8 w-8 text-gray-300" />
                    <p className="mt-3 text-sm font-semibold text-gray-500">
                      {locale === 'es' ? 'No hay notificaciones' : 'No notifications yet'}
                    </p>
                  </div>
                ) : (
                  notifications.map((notification) => {
                    const content = (
                      <div
                        className={`group flex gap-3 rounded-xl p-3 transition-colors hover:bg-pink-50 ${
                          notification.read ? 'opacity-75' : 'bg-pink-50/50'
                        }`}
                        onClick={() => {
                          markNotificationRead(notification.id);
                          setNotifications(getNotifications());
                          setIsNotificationsOpen(false);
                        }}
                      >
                        <div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${notification.read ? 'bg-gray-300' : 'bg-pink-500'}`} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-pink-600 shadow-sm">
                              {notificationTypeLabel[notification.type]}
                            </span>
                            <span className="text-[10px] font-semibold text-gray-400">{formatNotificationTime(notification.createdAt)}</span>
                          </div>
                          <p className="mt-1 truncate text-sm font-bold text-gray-900">{notification.title}</p>
                          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-gray-500">{notification.description}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeNotification(notification.id);
                            setNotifications(getNotifications());
                          }}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                          title={locale === 'es' ? 'Eliminar' : 'Delete'}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );

                    return notification.href ? (
                      <Link key={notification.id} to={notification.href} className="block">{content}</Link>
                    ) : (
                      <div key={notification.id}>{content}</div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Wallet */}
        <WalletMultiButton />

        {/* User */}
        {user && (
          <div className="flex items-center gap-2 border-l border-pink-100/50 pl-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-rose-500 shadow-sm">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="hidden xl:block">
              <p className="text-xs font-semibold text-gray-800 leading-tight">{user.name}</p>
              <p className="text-[10px] text-gray-400">{user.email}</p>
            </div>
            <button
              onClick={signOut}
              title={locale === 'es' ? 'Cerrar Sesión' : 'Sign Out'}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 transition-base hover:bg-red-50 hover:text-red-500"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
