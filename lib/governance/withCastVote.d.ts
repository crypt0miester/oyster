import { type PublicKey, TransactionInstruction } from "@solana/web3.js";
import { type Vote } from "./instructions";
export declare const withCastVote: (instructions: TransactionInstruction[], programId: PublicKey, programVersion: number, realm: PublicKey, governance: PublicKey, proposal: PublicKey, proposalOwnerRecord: PublicKey, tokenOwnerRecord: PublicKey, governanceAuthority: PublicKey, voteGoverningTokenMint: PublicKey, vote: Vote, payer: PublicKey, voterWeightRecord?: PublicKey, maxVoterWeightRecord?: PublicKey) => Promise<PublicKey>;
//# sourceMappingURL=withCastVote.d.ts.map