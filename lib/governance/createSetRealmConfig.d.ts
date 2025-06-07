import type { PublicKey, TransactionInstruction } from "@solana/web3.js";
import type { GoverningTokenConfigAccountArgs, MintMaxVoteWeightSource } from "./accounts";
import type BN from "bn.js";
export declare function createSetRealmConfig(programId: PublicKey, programVersion: number, realm: PublicKey, realmAuthority: PublicKey, councilMint: PublicKey | undefined, communityMintMaxVoteWeightSource: MintMaxVoteWeightSource, minCommunityTokensToCreateGovernance: BN, communityTokenConfig: GoverningTokenConfigAccountArgs | undefined, councilTokenConfig: GoverningTokenConfigAccountArgs | undefined, payer: PublicKey | undefined): Promise<TransactionInstruction>;
//# sourceMappingURL=createSetRealmConfig.d.ts.map