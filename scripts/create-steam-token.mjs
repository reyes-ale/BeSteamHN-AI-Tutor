/**
 * Run once to create the STEAM SPL token on Solana Devnet.
 * Usage: node scripts/create-steam-token.mjs
 *
 * After running, add the printed values to your .env and Supabase secrets.
 */

import { Connection, Keypair, LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js';
import { createMint } from '@solana/spl-token';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const KEYPAIR_FILE = join(__dirname, '.mint-authority.json');
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

// Reuse an existing keypair if one was already saved, otherwise generate a new one
let mintAuthority;
if (existsSync(KEYPAIR_FILE)) {
  const saved = JSON.parse(readFileSync(KEYPAIR_FILE, 'utf8'));
  mintAuthority = Keypair.fromSecretKey(Uint8Array.from(saved));
  console.log('\n♻️  Reusing saved keypair');
} else {
  mintAuthority = Keypair.generate();
  writeFileSync(KEYPAIR_FILE, JSON.stringify(Array.from(mintAuthority.secretKey)));
  console.log('\n🔑 New keypair generated and saved');
}
console.log('Mint authority public key:', mintAuthority.publicKey.toString());

// Check current balance
const currentBalance = await connection.getBalance(mintAuthority.publicKey);
console.log('Current balance:', currentBalance / LAMPORTS_PER_SOL, 'SOL');

if (currentBalance < 0.5 * LAMPORTS_PER_SOL) {
  console.log('\n⏳ Requesting devnet airdrop...');
  try {
    const sig = await connection.requestAirdrop(mintAuthority.publicKey, 2 * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(sig, 'confirmed');
    console.log('✅ Airdrop confirmed');
  } catch (e) {
    console.log('\n❌ Airdrop rate-limited. Fund this address manually:');
    console.log('   👉 https://faucet.solana.com');
    console.log('   Address:', mintAuthority.publicKey.toString());
    console.log('\nThen re-run: node scripts/create-steam-token.mjs');
    process.exit(1);
  }
} else {
  console.log('✅ Balance sufficient, skipping airdrop');
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
