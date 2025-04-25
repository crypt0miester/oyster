import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from '@solana/web3.js';
import { GOVERNANCE_INSTRUCTION_SCHEMA_V3 } from './serialisation';
import { serialize } from 'borsh';
import { ExecuteVersionedTransactionArgs } from './instructions';

export const withExecuteVersionedTransaction = async (
  instructions: TransactionInstruction[],
  programId: PublicKey,
  governance: PublicKey,
  proposal: PublicKey,
  proposalTransaction: PublicKey,
  remainingAccountKeys: AccountMeta[],
) => {
  const args = new ExecuteVersionedTransactionArgs();
  const data = Buffer.from(serialize(GOVERNANCE_INSTRUCTION_SCHEMA_V3, args));

  const keys = [
    { pubkey: governance, isWritable: false, isSigner: false },
    { pubkey: proposal, isWritable: true, isSigner: false },
    { pubkey: proposalTransaction, isWritable: true, isSigner: false },
  ];
  keys.push(...remainingAccountKeys);

  instructions.push(new TransactionInstruction({ keys, programId, data }));
  return proposalTransaction;
};