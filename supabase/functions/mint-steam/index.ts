import { Connection, Keypair, PublicKey, clusterApiUrl } from "npm:@solana/web3.js@1.87.6";
import {
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "npm:@solana/spl-token@0.3.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
};

function respond(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return respond({ error: "Method not allowed" }, 405);
  }

  try {
    const mintAddress = Deno.env.get("STEAM_MINT_ADDRESS");
    const mintAuthorityB64 = Deno.env.get("STEAM_MINT_AUTHORITY");

    if (!mintAddress || !mintAuthorityB64) {
      return respond({ error: "STEAM token not configured" }, 500);
    }

    const { walletAddress, amount } = await req.json();

    if (!walletAddress || typeof amount !== "number" || amount <= 0) {
      return respond({ error: "walletAddress and a positive amount are required" }, 400);
    }

    // Reconstruct the mint authority keypair from the stored base64 secret key
    const authorityBytes = Uint8Array.from(
      atob(mintAuthorityB64).split("").map((c) => c.charCodeAt(0))
    );
    const mintAuthority = Keypair.fromSecretKey(authorityBytes);

    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const mint = new PublicKey(mintAddress);
    const recipient = new PublicKey(walletAddress);

    // Get or create the recipient's associated token account
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      mintAuthority, // payer for account creation fees
      mint,
      recipient
    );

    // Mint the tokens
    const signature = await mintTo(
      connection,
      mintAuthority,        // payer
      mint,
      tokenAccount.address, // destination
      mintAuthority,        // mint authority
      amount
    );

    return respond({
      success: true,
      signature,
      tokenAccount: tokenAccount.address.toString(),
      amount,
    });
  } catch (err) {
    console.error("Mint error:", err);
    return respond({ error: "Minting failed", detail: String(err) }, 500);
  }
});
