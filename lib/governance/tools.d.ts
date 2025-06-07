import type { AccountMeta, PublicKey } from "@solana/web3.js";
import type BN from "bn.js";
import { type GoverningTokenConfigAccountArgs, type MintMaxVoteWeightSource, RealmConfigArgs } from "./accounts";
export declare function createRealmConfigArgs(programVersion: number, councilMint: PublicKey | undefined, communityMintMaxVoteWeightSource: MintMaxVoteWeightSource, minCommunityWeightToCreateGovernance: BN, communityTokenConfig?: GoverningTokenConfigAccountArgs | undefined, councilTokenConfig?: GoverningTokenConfigAccountArgs | undefined): RealmConfigArgs;
export declare function withTokenConfigAccounts(keys: Array<AccountMeta>, communityTokenConfig?: GoverningTokenConfigAccountArgs | undefined, councilTokenConfig?: GoverningTokenConfigAccountArgs | undefined): void;
export declare function withV3RealmConfigAccount(keys: Array<AccountMeta>, programId: PublicKey, programVersion: number, realm: PublicKey): Promise<void>;
//# sourceMappingURL=tools.d.ts.map