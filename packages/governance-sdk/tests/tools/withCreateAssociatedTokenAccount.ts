import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import { PublicKey, TransactionInstruction } from '@solana/web3.js'

export const withCreateAssociatedTokenAccount = async (
  instructions: TransactionInstruction[],
  mintPk: PublicKey,
  ownerPk: PublicKey,
  payerPk: PublicKey
) => {
  const ataPk = await getAssociatedTokenAddress(
    mintPk,
    ownerPk, // owner
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  )

  instructions.push(
    createAssociatedTokenAccountInstruction(
      payerPk,
      ataPk,
      ownerPk,
      mintPk,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    )
  )

  return ataPk
}
