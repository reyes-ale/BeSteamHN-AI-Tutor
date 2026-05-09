import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

const STEAM_MINT = import.meta.env.VITE_STEAM_MINT_ADDRESS as string | undefined;

export function useSteamBalance() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { user } = useAuth();
  const [onChainBalance, setOnChainBalance] = useState(0);
  const [supabaseBalance, setSupabaseBalance] = useState(0);
  const [localBalance, setLocalBalance] = useState(() =>
    parseInt(localStorage.getItem('steam_local_balance') ?? '0')
  );
  const [loading, setLoading] = useState(false);

  // On-chain SPL token balance
  useEffect(() => {
    if (!publicKey || !STEAM_MINT) {
      setOnChainBalance(0);
      return;
    }

    let cancelled = false;
    setLoading(true);

    async function fetchOnChain() {
      try {
        const mint = new PublicKey(STEAM_MINT!);
        const ata = await getAssociatedTokenAddress(mint, publicKey!);
        const account = await getAccount(connection, ata);
        if (!cancelled) setOnChainBalance(Number(account.amount));
      } catch {
        if (!cancelled) setOnChainBalance(0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchOnChain();
    const interval = setInterval(fetchOnChain, 30_000);
    window.addEventListener('steam-balance-update', fetchOnChain);
    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener('steam-balance-update', fetchOnChain);
    };
  }, [publicKey?.toString(), connection]);

  // Supabase profile balance — always kept in sync
  useEffect(() => {
    if (!user) { setSupabaseBalance(0); return; }

    async function fetchSupabase() {
      const { data } = await supabase
        .from('profiles')
        .select('steam_balance')
        .eq('id', user!.id)
        .single();
      if (data) {
        const remote = data.steam_balance || 0;
        setSupabaseBalance(remote);
        // Keep localStorage in sync so it reflects the authoritative Supabase value
        if (remote > parseInt(localStorage.getItem('steam_local_balance') ?? '0')) {
          localStorage.setItem('steam_local_balance', String(remote));
          setLocalBalance(remote);
        }
      }
    }

    function handleLocalUpdate() {
      setLocalBalance(parseInt(localStorage.getItem('steam_local_balance') ?? '0'));
    }

    fetchSupabase();
    window.addEventListener('steam-balance-update', fetchSupabase);
    window.addEventListener('steam-balance-update', handleLocalUpdate);
    return () => {
      window.removeEventListener('steam-balance-update', fetchSupabase);
      window.removeEventListener('steam-balance-update', handleLocalUpdate);
    };
  }, [user?.id]);

  // On-chain > Supabase > localStorage optimistic fallback
  const balance = onChainBalance > 0 ? onChainBalance : supabaseBalance > 0 ? supabaseBalance : localBalance;

  return { balance, loading };
}
