"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddressLookupTableAccounts = void 0;
exports.isStaticWritableIndex = isStaticWritableIndex;
exports.isSignerIndex = isSignerIndex;
exports.transactionMessageToRealmsTransactionMessageBytes = transactionMessageToRealmsTransactionMessageBytes;
exports.accountsForTransactionExecute = accountsForTransactionExecute;
const web3_js_1 = require("@solana/web3.js");
const invariant_1 = __importDefault(require("../invariant"));
const compileToWrappedMessageV0_1 = require("./compileToWrappedMessageV0");
const accounts_1 = require("../../governance/accounts");
// checks if an account index is writable in the static account keys of a transaction message
function isStaticWritableIndex(message, index) {
    const numAccountKeys = message.accountKeys.length;
    const { numSigners, numWritableSigners, numWritableNonSigners } = message;
    if (index >= numAccountKeys) {
        // `index` is not a part of static `accountKeys`.
        return false;
    }
    if (index < numWritableSigners) {
        // `index` is within the range of writable signer keys.
        return true;
    }
    if (index >= numSigners) {
        // `index` is within the range of non-signer keys.
        const indexIntoNonSigners = index - numSigners;
        // Whether `index` is within the range of writable non-signer keys.
        return indexIntoNonSigners < numWritableNonSigners;
    }
    return false;
}
function isSignerIndex(message, index) {
    return index < message.numSigners;
}
/** We use custom serialization for `transaction_message` that ensures as small byte size as possible. */
function transactionMessageToRealmsTransactionMessageBytes({ message, addressLookupTableAccounts, }) {
    // Use custom implementation of `message.compileToV0Message` that allows instruction programIds
    // to also be loaded from `addressLookupTableAccounts`.
    const compiledMessage = (0, compileToWrappedMessageV0_1.compileToWrappedMessageV0)({
        payerKey: message.payerKey,
        recentBlockhash: message.recentBlockhash,
        instructions: message.instructions,
        addressLookupTableAccounts,
    });
    // Convert compiled instructions to ProposalCompiledInstruction format
    const proposalInstructions = compiledMessage.compiledInstructions.map((ix) => {
        return new accounts_1.ProposalCompiledInstruction({
            programIdIndex: ix.programIdIndex,
            accountIndexes: ix.accountKeyIndexes,
            data: ix.data,
        });
    });
    // Convert address table lookups
    const proposalAddressTableLookups = compiledMessage.addressTableLookups.map((lookup) => ({
        accountKey: lookup.accountKey,
        writableIndexes: lookup.writableIndexes,
        readonlyIndexes: lookup.readonlyIndexes,
    }));
    // Create and serialize ProposalTransactionMessage
    const proposalMessage = new accounts_1.ProposalTransactionMessage({
        numSigners: compiledMessage.header.numRequiredSignatures,
        numWritableSigners: compiledMessage.header.numRequiredSignatures - compiledMessage.header.numReadonlySignedAccounts,
        numWritableNonSigners: compiledMessage.staticAccountKeys.length -
            compiledMessage.header.numRequiredSignatures -
            compiledMessage.header.numReadonlyUnsignedAccounts,
        accountKeys: compiledMessage.staticAccountKeys,
        instructions: proposalInstructions,
        addressTableLookups: proposalAddressTableLookups,
    });
    return proposalMessage.serialize();
}
/** Populate remaining accounts required for execution of the transaction. */
async function accountsForTransactionExecute({ connection, transactionProposalPda, transactionIndex, governancePk, treasuryPk, message, ephemeralSignerCount, programId, }) {
    const ephemeralSignerPdas = Array.from({ length: ephemeralSignerCount }, (_, additionalSignerIndex) => {
        return (0, accounts_1.getEphemeralSignerPda)({
            transactionProposalPda,
            transactionIndex,
            ephemeralSignerIndex: additionalSignerIndex,
            programId,
        })[0];
    });
    const addressLookupTableKeys = message.addressTableLookups.map(({ accountKey }) => accountKey);
    // Use the new getAddressLookupTableAccounts function
    const addressLookupTableAccountsArray = await (0, exports.getAddressLookupTableAccounts)(connection, addressLookupTableKeys);
    // Convert the array of AddressLookupTableAccount into a Map for easier access
    const addressLookupTableAccounts = new Map(addressLookupTableAccountsArray.map((account) => [account.key.toBase58(), account]));
    // Populate account metas required for execution of the transaction.
    const accountMetas = [];
    // First add the lookup table accounts used by the transaction. They are needed for on-chain validation.
    accountMetas.push(...addressLookupTableKeys.map((key) => {
        return { pubkey: key, isSigner: false, isWritable: false };
    }));
    // Then add static account keys included into the message.
    for (const [accountIndex, accountKey] of message.accountKeys.entries()) {
        accountMetas.push({
            pubkey: accountKey,
            isWritable: isStaticWritableIndex(message, accountIndex),
            // NOTE: governancePk and treasuryPk and ephemeralSignerPdas cannot be marked as signers,
            // because they are PDAs and hence won't have their signatures on the transaction.
            isSigner: isSignerIndex(message, accountIndex) &&
                !accountKey.equals(treasuryPk) &&
                !accountKey.equals(governancePk) &&
                !ephemeralSignerPdas.find((k) => accountKey.equals(k)),
        });
    }
    // Then add accounts that will be loaded with address lookup tables.
    for (const lookup of message.addressTableLookups) {
        const lookupTableAccount = addressLookupTableAccounts.get(lookup.accountKey.toBase58());
        (0, invariant_1.default)(lookupTableAccount, `Address lookup table account ${lookup.accountKey.toBase58()} not found`);
        for (const accountIndex of lookup.writableIndexes) {
            if (!lookupTableAccount)
                continue;
            const pubkey = lookupTableAccount.state.addresses[accountIndex];
            (0, invariant_1.default)(pubkey, `Address lookup table account ${lookup.accountKey.toBase58()} does not contain address at index ${accountIndex}`);
            accountMetas.push({
                pubkey,
                isWritable: true,
                // Accounts in address lookup tables can not be signers.
                isSigner: false,
            });
        }
        for (const accountIndex of lookup.readonlyIndexes) {
            if (!lookupTableAccount)
                continue;
            const pubkey = lookupTableAccount.state.addresses[accountIndex];
            (0, invariant_1.default)(pubkey, `Address lookup table account ${lookup.accountKey.toBase58()} does not contain address at index ${accountIndex}`);
            accountMetas.push({
                pubkey,
                isWritable: false,
                // Accounts in address lookup tables can not be signers.
                isSigner: false,
            });
        }
    }
    return {
        accountMetas,
        lookupTableAccounts: [...addressLookupTableAccounts.values()],
    };
}
/** Fetches address lookup table accounts from the Solana blockchain in one go. */
const getAddressLookupTableAccounts = async (connection, keys) => {
    const addressLookupTableAccountInfos = await connection.getMultipleAccountsInfo(keys.map((key) => key));
    return addressLookupTableAccountInfos.reduce((acc, accountInfo, index) => {
        const addressLookupTableAddress = keys[index];
        if (accountInfo) {
            const addressLookupTableAccount = new web3_js_1.AddressLookupTableAccount({
                key: addressLookupTableAddress,
                state: web3_js_1.AddressLookupTableAccount.deserialize(Uint8Array.from(accountInfo.data)),
            });
            acc.push(addressLookupTableAccount);
        }
        return acc;
    }, new Array());
};
exports.getAddressLookupTableAccounts = getAddressLookupTableAccounts;
//# sourceMappingURL=transactionMessage.js.map