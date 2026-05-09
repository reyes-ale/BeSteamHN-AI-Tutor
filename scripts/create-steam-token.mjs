/**
 * Run once to create the STEAM SPL token on Solana Devnet.
 * Usage: node scripts/create-steam-token.mjs
 *
 * After running, add the printed values to your .env and Supabase secrets.
 */

import { Connection, Keypair, LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js';
import { createMint } from '@solana/spl-token';

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

// Generate a new keypair — this will be the mint authority (the key that can mint tokens)
const mintAuthority = Keypair.generate();
console.log('\n🔑 Mint authority public key:', mintAuthority.publicKey.toString());

// Fund the keypair with devnet SOL for transaction fees
console.log('⏳ Requesting devnet airdrop (this can take 10-30 seconds)...');
try {
  const sig = await connection.requestAirdrop(mintAuthority.publicKey, 2 * LAMPORTS_PER_SOL);
  await connection.confirmTransaction(sig, 'confirmed');
  console.log('✅ Airdrop confirmed');
} catch (e) {
  console.error('❌ Airdrop failed. Try again or fund manually via https://faucet.solana.com');
  process.exit(1);
}

// Create the STEAM token mint (0 decimals = whole tokens only)
console.log('⏳ Creating STEAM token mint...');
const mint = await createMint(
  connection,
  mintAuthority,           // payer
  mintAuthority.publicKey, // mint authority
  null,                    // freeze authority (null = disabled)
  0                        // decimals
);

const authorityB64 = Buffer.from(mintAuthority.secretKey).toString('base64');

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅  STEAM Token Created on Devnet!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\n📋 Add this to your .env file:');
console.log(`VITE_STEAM_MINT_ADDRESS=${mint.toString()}`);
console.log('\n📋 Add these to Supabase secrets (Project Settings → Edge Functions → Secrets):');
console.log(`STEAM_MINT_ADDRESS=${mint.toString()}`);
console.log(`STEAM_MINT_AUTHORITY=${authorityB64}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\n⚠️  Save the STEAM_MINT_AUTHORITY value — it cannot be recovered!');
