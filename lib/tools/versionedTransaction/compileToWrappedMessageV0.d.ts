import { type AddressLookupTableAccount, MessageV0, type PublicKey, type TransactionInstruction } from "@solana/web3.js";
export declare function compileToWrappedMessageV0({ payerKey, recentBlockhash, instructions, addressLookupTableAccounts, }: {
    payerKey: PublicKey;
    recentBlockhash: string;
    instructions: TransactionInstruction[];
    addressLookupTableAccounts?: AddressLookupTableAccount[];
}): MessageV0;
//# sourceMappingURL=compileToWrappedMessageV0.d.ts.map