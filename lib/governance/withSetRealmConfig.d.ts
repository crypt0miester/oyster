import { type PublicKey, TransactionInstruction } from "@solana/web3.js";
import { type GoverningTokenConfigAccountArgs, type MintMaxVoteWeightSource } from "./accounts";
import type BN from "bn.js";
export declare function withSetRealmConfig(instructions: TransactionInstruction[], programId: PublicKey, programVersion: number, realm: PublicKey, realmAuthority: PublicKey, councilMint: PublicKey | undefined, communityMintMaxVoteWeightSource: MintMaxVoteWeightSource, minCommunityWeightToCreateGovernance: BN, communityTokenConfig: GoverningTokenConfigAccountArgs | undefined, councilTokenConfig: GoverningTokenConfigAccountArgs | undefined, payer: PublicKey | undefined): Promise<void>;
//# sourceMappingURL=withSetRealmConfig.d.ts.map