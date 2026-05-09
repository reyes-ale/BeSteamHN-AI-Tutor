import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';

const STEAM_MINT = import.meta.env.VITE_STEAM_MINT_ADDRESS as string | undefined;

export function useSteamBalance() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!publicKey || !STEAM_MINT) {
      setBalance(0);
      return;
    }

    let cancelled = false;
    setLoading(true);

    async function fetch() {
      try {
        const mint = new PublicKey(STEAM_MINT!);
        const ata = await getAssociatedTokenAddress(mint, publicKey!);
        const account = await getAccount(connection, ata);
        if (!cancelled) setBalance(Number(account.amount));
      } catch {
        // Token account doesn't exist yet means balance is 0
        if (!cancelled) setBalance(0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch();

    const interval = setInterval(fetch, 30_000);
    // Allow any component to trigger an immediate refresh
    window.addEventListener('steam-balance-update', fetch);
    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener('steam-balance-update', fetch);
    };
  }, [publicKey?.toString(), connection]);

  return { balance, loading };
}
