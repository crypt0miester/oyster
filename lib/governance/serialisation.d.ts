import type { AccountMeta, AddressLookupTableAccount, Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { InstructionData, type GovernanceAccountClass, type GovernanceAccountType, ProposalVersionedTransaction } from "./accounts";
export declare const serializeInstructionToBase64: (instruction: TransactionInstruction) => string;
export declare const createInstructionData: (instruction: TransactionInstruction) => InstructionData;
export declare const GOVERNANCE_INSTRUCTION_SCHEMA_V1: Map<Function, any>;
export declare const GOVERNANCE_INSTRUCTION_SCHEMA_V2: Map<Function, any>;
export declare const GOVERNANCE_INSTRUCTION_SCHEMA_V3: Map<Function, any>;
export declare function getGovernanceInstructionSchema(programVersion: number): Map<Function, any>;
export declare const GOVERNANCE_ACCOUNT_SCHEMA_V1: Map<Function, any>;
export declare const GOVERNANCE_ACCOUNT_SCHEMA_V2: Map<Function, any>;
export declare function getGovernanceAccountSchema(accountVersion: number): Map<Function, any>;
export declare function getGovernanceSchemaForAccount(accountType: GovernanceAccountType): Map<Function, any>;
export declare const GovernanceAccountParser: (classType: GovernanceAccountClass) => (pubKey: PublicKey, info: import("@solana/web3.js").AccountInfo<Buffer>) => import("../tools").ProgramAccount<any>;
export declare function getInstructionDataFromBase64(instructionDataBase64: string): InstructionData;
export declare function getVersionedTransactionProposalData(connection: Connection, vtxPk: PublicKey): Promise<ProposalVersionedTransaction | null>;
/**
 * Retrieves the account meta and address lookup table accounts required for executing a versioned transaction.
 *
 * @param connection - The Solana connection object to interact with the blockchain.
 * @param proposalVersionedTxPk - The public key of the proposal versioned transaction account.
 * @param transactionIndex - The index of the transaction within the proposal.
 * @param governancePk - The public key of the governance account.
 * @param treasuryPk - The public key of the native treasury account.
 * @param programId - The public key of the governance program.
 * @param ephemeralSignerBumps - An array of ephemeral signer bumps used for generating ephemeral signer PDAs.
 *
 * @returns A promise that resolves to an object containing:
 * - `accountMetas`: The account metadata required for the transaction execution.
 * - `lookupTableAccounts`: The address lookup table accounts required for the transaction execution.
 *
 * This function:
 * 1. Fetches the versioned transaction data using the `getVersionedTransactionProposalData` function.
 * 2. Extracts the `message` from the versioned transaction data, which contains the transaction's account keys and instructions.
 * 3. Calls `accountsForTransactionExecute` to generate the required account metadata and lookup table accounts.
 *
 * Note:
 * - This function is **deterministic** for the execution of a versioned transaction.
 * - The returned `accountMetas` and `lookupTableAccounts` must be used to construct a `VersionedTransaction` from `@solana/web3.js`.
 */
export declare function getAccountMetasAndLookupTableAccountsForExecuteTransaction(connection: Connection, proposalVersionedTxPk: PublicKey, transactionIndex: number, governancePk: PublicKey, treasuryPk: PublicKey, programId: PublicKey, ephemeralSignerCount: number): Promise<{
    /** Account metas used in the `message`. */
    accountMetas: AccountMeta[];
    /** Address lookup table accounts used in the `message`. */
    lookupTableAccounts: AddressLookupTableAccount[];
}>;
//# sourceMappingURL=serialisation.d.ts.map