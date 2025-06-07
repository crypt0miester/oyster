import type { AccountInfo, PublicKey } from "@solana/web3.js";
import type { Schema } from "borsh";
import type { ProgramAccount } from "../tools/sdk/runtime";
export declare function BorshAccountParser(classFactory: any, getSchema: (accountType: number) => Schema): (pubKey: PublicKey, info: AccountInfo<Buffer>) => ProgramAccount<any>;
//# sourceMappingURL=serialisation.d.ts.map