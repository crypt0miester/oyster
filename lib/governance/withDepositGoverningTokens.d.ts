import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import type BN from "bn.js";
export declare const withDepositGoverningTokens: (instructions: TransactionInstruction[], programId: PublicKey, programVersion: number, realm: PublicKey, governingTokenSource: PublicKey, governingTokenMint: PublicKey, governingTokenOwner: PublicKey, governingTokenSourceAuthority: PublicKey, payer: PublicKey, amount: BN, governingTokenOwnerIsSigner?: boolean, tokenProgram?: PublicKey) => Promise<PublicKey>;
//# sourceMappingURL=withDepositGoverningTokens.d.ts.map