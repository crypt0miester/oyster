import type { PublicKey, TransactionInstruction } from "@solana/web3.js";
import type BN from "bn.js";
export declare function createRevokeGoverningTokens(programId: PublicKey, programVersion: number, realm: PublicKey, governingTokenOwner: PublicKey, governingTokenMint: PublicKey, revokeAuthority: PublicKey, amount: BN): Promise<TransactionInstruction>;
//# sourceMappingURL=createRevokeGoverningTokens.d.ts.map