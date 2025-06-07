import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import type { GovernanceConfig } from "./accounts";
/** @deprecated */
export declare const withCreateMintGovernance: (instructions: TransactionInstruction[], programId: PublicKey, programVersion: number, realm: PublicKey, governedMint: PublicKey, config: GovernanceConfig, transferMintAuthorities: boolean, mintAuthority: PublicKey, tokenOwnerRecord: PublicKey, payer: PublicKey, governanceAuthority: PublicKey, voterWeightRecord?: PublicKey, tokenProgram?: PublicKey) => Promise<PublicKey>;
//# sourceMappingURL=withCreateMintGovernance.d.ts.map