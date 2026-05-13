# BESTEAMHN Solana Smart Contract

This Anchor program stores student registration data and course certificates on Solana Devnet.

## Program ID

```text
Agm9NHABSZkPx2kZWwKxxnLDf1RNrFnAfBSerkvsfdnY
```

## Instructions

- `register_user(name)`: creates a student PDA using `["student", user]`.
- `complete_course(course_id, course_title, steam_amount)`: creates a certificate PDA and updates the student's certificate count and total STEAM rewards.

The frontend IDL is located at:

```text
src/idl/idl.json
```

## Build And Deploy

```bash
anchor build
anchor deploy --provider.cluster devnet
```

After deployment, keep the frontend program ID in sync in:

```text
src/lib/solana/program.ts
```

## Note About STEAM Tokens

This smart contract tracks certificate rewards on-chain. The actual STEAM SPL token minting is handled by the Supabase Edge Function:

```text
supabase/functions/mint-steam/index.ts
```

That keeps the mint authority private and out of browser code.
