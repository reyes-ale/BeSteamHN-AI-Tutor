import React from 'react';
import { useI18n, type Locale } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { Coins, Bell, Globe, LogOut, User } from 'lucide-react';

export default function TopBar() {
  const { locale, setLocale, t } = useI18n();
  const { publicKey } = useWallet();
  const { user, signOut } = useAuth();

  const toggleLocale = () => {
    setLocale(locale === 'es' ? 'en' : 'es');
  };

  return (
    <header className="fixed left-64 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-white/40 glass px-6">
      {/* Left: Page context */}
      <div className="flex items-center gap-3">
        {publicKey && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-700">Devnet</span>
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5">
        {/* STEAM Balance */}
        <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 px-3 py-1.5 shadow-md shadow-amber-200/60">
          <Coins className="h-4 w-4 text-white" />
          <span className="text-sm font-bold text-white">350</span>
          <span className="text-xs font-medium text-white/80">{t.common.steamTokens}</span>
        </div>

        {/* Language Switcher */}
        <button
          onClick={toggleLocale}
          className="flex items-center gap-1.5 rounded-xl border border-white/50 bg-white/60 px-3 py-1.5 text-sm font-medium text-gray-700 transition-base hover:bg-white/80 backdrop-blur-sm"
          title={locale === 'es' ? 'Switch to English' : 'Cambiar a Español'}
        >
          <Globe className="h-4 w-4 text-violet-400" />
          <span>{locale === 'es' ? '🇭🇳 ES' : '🇺🇸 EN'}</span>
        </button>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/50 bg-white/60 text-gray-500 transition-base hover:bg-white/80 backdrop-blur-sm">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* Wallet */}
        <WalletMultiButton />

        {/* User Menu */}
        {user && (
          <div className="flex items-center gap-2 border-l border-white/40 pl-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 shadow-sm">
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
