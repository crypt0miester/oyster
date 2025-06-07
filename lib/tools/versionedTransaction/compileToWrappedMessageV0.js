"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileToWrappedMessageV0 = compileToWrappedMessageV0;
const web3_js_1 = require("@solana/web3.js");
const compiledKeys_1 = require("./compiledKeys");
/// This function compiles a set of transaction instructions into a wrapped message format
/// for version 0 of the Solana transaction message. It extracts address lookup table accounts
/// and compiles the instructions into a format suitable for the message to be used in
/// transactionMessageToRealmsTransactionMessageBytes function.
function compileToWrappedMessageV0({ payerKey, recentBlockhash, instructions, addressLookupTableAccounts, }) {
    const compiledKeys = compiledKeys_1.CompiledKeys.compile(instructions, payerKey);
    const addressTableLookups = new Array();
    const accountKeysFromLookups = {
        writable: [],
        readonly: [],
    };
    const lookupTableAccounts = addressLookupTableAccounts || [];
    for (const lookupTable of lookupTableAccounts) {
        const extractResult = compiledKeys.extractTableLookup(lookupTable);
        if (extractResult !== undefined) {
            const [addressTableLookup, { writable, readonly }] = extractResult;
            addressTableLookups.push(addressTableLookup);
            accountKeysFromLookups.writable.push(...writable);
            accountKeysFromLookups.readonly.push(...readonly);
        }
    }
    const [header, staticAccountKeys] = compiledKeys.getMessageComponents();
    const accountKeys = new web3_js_1.MessageAccountKeys(staticAccountKeys, accountKeysFromLookups);
    const compiledInstructions = accountKeys.compileInstructions(instructions);
    return new web3_js_1.MessageV0({
        header,
        staticAccountKeys,
        recentBlockhash,
        compiledInstructions,
        addressTableLookups,
    });
}
//# sourceMappingURL=compileToWrappedMessageV0.js.map