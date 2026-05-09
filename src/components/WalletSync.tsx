import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletName } from '@solana/wallet-adapter-base';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export function WalletSync() {
  const { publicKey, select } = useWallet();
  const { user } = useAuth();

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

  return null;
}
