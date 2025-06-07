import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import type { GovernanceConfig } from "./accounts";
/** @deprecated */
export declare const withCreateProgramGovernance: (instructions: TransactionInstruction[], programId: PublicKey, programVersion: number, realm: PublicKey, governedProgram: PublicKey, config: GovernanceConfig, transferUpgradeAuthority: boolean, programUpgradeAuthority: PublicKey, tokenOwnerRecord: PublicKey, payer: PublicKey, governanceAuthority: PublicKey, voterWeightRecord?: PublicKey) => Promise<PublicKey>;
//# sourceMappingURL=withCreateProgramGovernance.d.ts.map