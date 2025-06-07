import { type Connection, PublicKey } from "@solana/web3.js";
import type { ProgramAccountWithType } from "./accounts";
import type { Schema } from "borsh";
import type { ProgramAccount } from "../tools/sdk/runtime";
import type { Transaction } from "@solana/web3.js";
export type WalletSigner = {
    publicKey: PublicKey | null;
    signTransaction(transaction: Transaction): Promise<Transaction>;
    signAllTransactions(transaction: Transaction[]): Promise<Transaction[]>;
};
export declare class WalletError extends Error {
    error: any;
    constructor(message?: string, error?: any);
}
export declare class WalletNotConnectedError extends WalletError {
    name: string;
}
export declare function isWalletNotConnectedError(error: any): error is WalletNotConnectedError;
export declare class RpcContext {
    programId: PublicKey;
    programVersion: number;
    wallet: WalletSigner;
    connection: Connection;
    endpoint: string;
    constructor(programId: PublicKey, programVersion: number, wallet: WalletSigner, connection: Connection, endpoint: string);
    get walletPubkey(): PublicKey;
    get programIdBase58(): string;
}
export declare class MemcmpFilter {
    offset: number;
    bytes: Buffer;
    constructor(offset: number, bytes: Buffer);
    isMatch(buffer: Buffer): boolean;
}
export declare const pubkeyFilter: (offset: number, pubkey: PublicKey | undefined | null) => MemcmpFilter | undefined;
export declare const booleanFilter: (offset: number, value: boolean) => MemcmpFilter;
export declare function getBorshProgramAccounts<TAccount extends ProgramAccountWithType>(connection: Connection, programId: PublicKey, getSchema: (accountType: number) => Schema, accountFactory: new (args: any) => TAccount, filters?: MemcmpFilter[], accountType?: number): Promise<ProgramAccount<TAccount>[]>;
//# sourceMappingURL=api.d.ts.map