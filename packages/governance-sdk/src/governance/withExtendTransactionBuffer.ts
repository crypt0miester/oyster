import {
  PublicKey,
  TransactionInstruction,
} from '@solana/web3.js';
import { GOVERNANCE_INSTRUCTION_SCHEMA_V3 } from './serialisation';
import { serialize } from 'borsh';
import { ExtendTransactionBufferArgs } from './instructions';
import { getProposalTransactionBufferAddress } from './accounts';

export const withExtendTransactionBuffer = async (
  instructions: TransactionInstruction[],
  programId: PublicKey,
  governance: PublicKey,
  proposal: PublicKey,
  creator: PublicKey,
  bufferIndex: number,
  buffer: Uint8Array,
) => {
  const args = new ExtendTransactionBufferArgs({ bufferIndex, buffer });
  const data = Buffer.from(serialize(GOVERNANCE_INSTRUCTION_SCHEMA_V3, args));

  const proposalTransactionBufferAddress = await getProposalTransactionBufferAddress(
    programId,
    proposal,
    creator,
    bufferIndex,
  );

  const keys = [
    { pubkey: governance, isWritable: false, isSigner: false },
    { pubkey: proposal, isWritable: false, isSigner: false },
    { pubkey: proposalTransactionBufferAddress, isWritable: true, isSigner: false },
    { pubkey: creator, isWritable: false, isSigner: true },
  ];

  instructions.push(new TransactionInstruction({ keys, programId, data }));
  return proposalTransactionBufferAddress;
};