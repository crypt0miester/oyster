import type { PublicKey, TransactionInstruction } from "@solana/web3.js";
import type { SetRealmAuthorityAction } from "./instructions";
export declare function createSetRealmAuthority(programId: PublicKey, programVersion: number, realm: PublicKey, realmAuthority: PublicKey, newRealmAuthority: PublicKey | undefined, action: SetRealmAuthorityAction | undefined): TransactionInstruction;
//# sourceMappingURL=createSetRealmAuthority.d.ts.map