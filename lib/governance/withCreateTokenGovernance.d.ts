import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import type { GovernanceConfig } from "./accounts";
/** @deprecated */
export declare const withCreateTokenGovernance: (instructions: TransactionInstruction[], programId: PublicKey, programVersion: number, realm: PublicKey, governedToken: PublicKey, config: GovernanceConfig, transferAccountAuthorities: boolean, tokenOwner: PublicKey, tokenOwnerRecord: PublicKey, payer: PublicKey, governanceAuthority: PublicKey, voterWeightRecord?: PublicKey, tokenProgram?: PublicKey) => Promise<PublicKey>;
//# sourceMappingURL=withCreateTokenGovernance.d.ts.map