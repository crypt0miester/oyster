import { type PublicKey, TransactionInstruction } from "@solana/web3.js";
import type BN from "bn.js";
export declare const withRevokeGoverningTokens: (instructions: TransactionInstruction[], programId: PublicKey, programVersion: number, realm: PublicKey, governingTokenOwner: PublicKey, governingTokenMint: PublicKey, revokeAuthority: PublicKey, amount: BN, tokenProgram?: PublicKey) => Promise<void>;
//# sourceMappingURL=withRevokeGoverningTokens.d.ts.map