import React from 'react';
import { useI18n, type Locale } from '@/lib/i18n';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { Coins, Bell, Globe } from 'lucide-react';

export default function TopBar() {
  const { locale, setLocale, t } = useI18n();
  const { publicKey } = useWallet();

  const toggleLocale = () => {
    setLocale(locale === 'es' ? 'en' : 'es');
  };

  return (
    <header className="fixed left-64 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-md">
      {/* Left: Page context */}
      <div className="flex items-center gap-3">
        {publicKey && (
          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground">Devnet</span>
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* STEAM Balance */}
        <div className="flex items-center gap-2 rounded-lg bg-gradient-steam px-3 py-1.5">
          <Coins className="h-4 w-4 text-steam-foreground" />
          <span className="text-sm font-bold text-steam-foreground">350</span>
          <span className="text-xs font-medium text-steam-foreground/80">{t.common.steamTokens}</span>
        </div>

        {/* Language Switcher */}
        <button
          onClick={toggleLocale}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-base hover:bg-muted"
          title={locale === 'es' ? 'Switch to English' : 'Cambiar a Español'}
        >
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span>{locale === 'es' ? '🇭🇳 ES' : '🇺🇸 EN'}</span>
        </button>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-base hover:bg-muted hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            3
          </span>
        </button>

        {/* Wallet */}
        <WalletMultiButton />
      </div>
    </header>
  );
}
