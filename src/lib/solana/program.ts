import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { Program, AnchorProvider, Idl, BN } from '@project-serum/anchor';
import idl from '@/idl/idl.json';


const PROGRAM_ID = new PublicKey("Agm9NHABSZkPx2kZWwKxxnLDf1RNrFnAfBSerkvsfdnY");

export async function registerUserOnChain(
  connection: any,
  wallet: { publicKey: PublicKey; signTransaction: any },
  name: string
): Promise<string> {
  const provider = new AnchorProvider(connection, wallet as any, {});
  const program = new Program(idl as any, PROGRAM_ID, provider);

  // Encontrar la PDA del estudiante
  const [studentPda] = await PublicKey.findProgramAddress(
    [Buffer.from("student"), wallet.publicKey.toBuffer()],
    PROGRAM_ID
  );

  console.log("📝 Registrando usuario:", name);
  console.log("Student PDA:", studentPda.toString());

  const tx = await program.methods
    .registerUser(name)
    .accounts({
      user: wallet.publicKey,
      studentAccount: studentPda,
      systemProgram: SystemProgram.programId,
    })
    .transaction();

  const signature = await provider.sendAndConfirm(tx);
  console.log("✅ Usuario registrado:", signature);
  return signature;
}

export const addSteamPointsOnChain = async (wallet: any, connection: Connection, amount: number) => {
  console.log(`💰 Demo: Agregando ${amount} puntos STEAM a ${wallet.publicKey?.toString()}`);
  return { success: true, message: `Demo: ${amount} puntos` };
};

export const getUserPointsFromChain = async (wallet: any, connection: Connection) => {
  return { success: true, points: "0", nftCount: "0" };
};