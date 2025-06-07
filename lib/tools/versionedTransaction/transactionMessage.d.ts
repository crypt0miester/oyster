import { type AccountMeta, AddressLookupTableAccount, type Connection, type PublicKey, type TransactionMessage } from "@solana/web3.js";
import { ProposalTransactionMessage } from "../../governance/accounts";
export declare function isStaticWritableIndex(message: ProposalTransactionMessage, index: number): boolean;
export declare function isSignerIndex(message: ProposalTransactionMessage, index: number): boolean;
/** We use custom serialization for `transaction_message` that ensures as small byte size as possible. */
export declare function transactionMessageToRealmsTransactionMessageBytes({ message, addressLookupTableAccounts, }: {
    message: TransactionMessage;
    addressLookupTableAccounts?: AddressLookupTableAccount[];
}): Uint8Array;
/** Populate remaining accounts required for execution of the transaction. */
export declare function accountsForTransactionExecute({ connection, transactionProposalPda, transactionIndex, governancePk, treasuryPk, message, ephemeralSignerCount, programId, }: {
    connection: Connection;
    message: ProposalTransactionMessage;
    ephemeralSignerCount: number;
    transactionIndex: number;
    governancePk: PublicKey;
    treasuryPk: PublicKey;
    transactionProposalPda: PublicKey;
    programId: PublicKey;
}): Promise<{
    /** Account metas used in the `message`. */
    accountMetas: AccountMeta[];
    /** Address lookup table accounts used in the `message`. */
    lookupTableAccounts: AddressLookupTableAccount[];
}>;
/** Fetches address lookup table accounts from the Solana blockchain in one go. */
export declare const getAddressLookupTableAccounts: (connection: Connection, keys: PublicKey[]) => Promise<AddressLookupTableAccount[]>;
//# sourceMappingURL=transactionMessage.d.ts.map