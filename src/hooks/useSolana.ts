import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { registerUserOnChain, addSteamPointsOnChain, getUserPointsFromChain } from '@/lib/solana/program';

export function useSolana() {
  const { publicKey, connected, wallet } = useWallet();
  const { connection } = useConnection();

  const register = async () => {
    if (!connected || !publicKey || !wallet) {
      throw new Error("Wallet no conectada");
    }
    return registerUserOnChain({ publicKey }, connection);
  };

  const addPoints = async (amount: number) => {
    if (!connected || !publicKey || !wallet) {
      throw new Error("Wallet no conectada");
    }
    return addSteamPointsOnChain({ publicKey }, connection, amount);
  };

  const getPoints = async () => {
    if (!connected || !publicKey || !wallet) {
      throw new Error("Wallet no conectada");
    }
    return getUserPointsFromChain({ publicKey }, connection);
  };

  return {
    connected,
    publicKey,
    register,
    addPoints,
    getPoints,
  };
}