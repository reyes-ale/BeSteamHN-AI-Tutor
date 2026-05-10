// src/components/WalletSync.tsx
import { useEffect, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletName } from '@solana/wallet-adapter-base';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export function WalletSync() {
  const { publicKey, select, connected } = useWallet();
  const { connection } = useConnection();
  const { user } = useAuth();

  // Cuando el usuario inicia sesión y tiene wallet guardada, seleccionar Phantom
  useEffect(() => {
    if (user?.walletAddress && !publicKey) {
      select('Phantom' as WalletName);
    }
  }, [user?.id]);

  // Cuando se conecta una wallet, guardar la dirección en Supabase
  useEffect(() => {
    if (!user || !publicKey) return;
    const address = publicKey.toString();
    if (address === user.walletAddress) return;
    supabase.auth.updateUser({ data: { wallet_address: address } });
  }, [publicKey?.toString(), user?.id]);

  return null;
}