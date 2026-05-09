// src/components/WalletSync.tsx
import { useEffect, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletName } from '@solana/wallet-adapter-base';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { registerUserOnChain } from '@/lib/solana/program';

export function WalletSync() {
  const { publicKey, select } = useWallet();
  const { connection } = useConnection();
  const { user } = useAuth();
  const [registered, setRegistered] = useState(false); // Evita registros múltiples

  // When the user logs in and has a saved wallet, select it so autoConnect fires
  useEffect(() => {
    if (user?.walletAddress && !publicKey) {
      select('Phantom' as WalletName);
    }
  }, [user?.id]);

  // When a wallet connects, save its address to the user's Supabase metadata
  useEffect(() => {
    if (!user || !publicKey) return;
    const address = publicKey.toString();
    if (address === user.walletAddress) return;
    supabase.auth.updateUser({ data: { wallet_address: address } });
  }, [publicKey?.toString(), user?.id]);

  // Register user on Solana blockchain when wallet connects (solo una vez)
  useEffect(() => {
    if (!user || !publicKey || !connection || registered) return;
    
    const registerOnBlockchain = async () => {
      try {
        const wallet = { publicKey };
        const result = await registerUserOnChain(wallet, connection);
        if (result.success) {
          console.log("✅ Registro en blockchain Solana completado");
          setRegistered(true);
        } else {
          console.log("⚠️ Registro en blockchain:");
        }
      } catch (error) {
        console.error("❌ Error en registro Solana:", error);
        // No falla la app, solo loguea
      }
    };
    
    registerOnBlockchain();
  }, [publicKey?.toString(), connection, user?.id, registered]);

  return null;
}