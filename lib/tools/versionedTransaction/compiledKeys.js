"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompiledKeys = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
const web3_js_1 = require("@solana/web3.js");
/**
 *  This is almost completely copy-pasted from solana-web3.js and slightly adapted to work with "wrapped" transaction messaged such as in ProposalVersionedTransaction.
 *  @see https://github.com/solana-labs/solana-web3.js/blob/87d33ac68e2453b8a01cf8c425aa7623888434e8/packages/library-legacy/src/message/compiled-keys.ts
 */
class CompiledKeys {
    constructor(payer, keyMetaMap) {
        this.payer = payer;
        this.keyMetaMap = keyMetaMap;
    }
    /**
     * The only difference between this and the original is that we don't mark the instruction programIds as invoked.
     * It makes sense to do because the instructions will be called via CPI, so the programIds can come from Address Lookup Tables.
     * This allows to compress the message size and avoid hitting the tx size limit during process_insert_versioned_transaction instruction calls.
     */
    static compile(instructions, payer) {
        const keyMetaMap = new Map();
        const getOrInsertDefault = (pubkey) => {
            const address = pubkey.toBase58();
            let keyMeta = keyMetaMap.get(address);
            if (keyMeta === undefined) {
                keyMeta = {
                    isSigner: false,
                    isWritable: false,
                    isInvoked: false,
                };
                keyMetaMap.set(address, keyMeta);
            }
            return keyMeta;
        };
        const payerKeyMeta = getOrInsertDefault(payer);
        payerKeyMeta.isSigner = true;
        payerKeyMeta.isWritable = true;
        for (const ix of instructions) {
            // This is the only difference from the original.
            // getOrInsertDefault(ix.programId).isInvoked = true;
            getOrInsertDefault(ix.programId).isInvoked = false;
            for (const accountMeta of ix.keys) {
                const keyMeta = getOrInsertDefault(accountMeta.pubkey);
                keyMeta.isSigner || (keyMeta.isSigner = accountMeta.isSigner);
                keyMeta.isWritable || (keyMeta.isWritable = accountMeta.isWritable);
            }
        }
        return new CompiledKeys(payer, keyMetaMap);
    }
    getMessageComponents() {
        const mapEntries = [...this.keyMetaMap.entries()];
        (0, node_assert_1.default)(mapEntries.length <= 256, "Max static account keys length exceeded");
        const writableSigners = mapEntries.filter(([, meta]) => meta.isSigner && meta.isWritable);
        const readonlySigners = mapEntries.filter(([, meta]) => meta.isSigner && !meta.isWritable);
        const writableNonSigners = mapEntries.filter(([, meta]) => !meta.isSigner && meta.isWritable);
        const readonlyNonSigners = mapEntries.filter(([, meta]) => !meta.isSigner && !meta.isWritable);
        const header = {
            numRequiredSignatures: writableSigners.length + readonlySigners.length,
            numReadonlySignedAccounts: readonlySigners.length,
            numReadonlyUnsignedAccounts: readonlyNonSigners.length,
        };
        // sanity checks
        {
            (0, node_assert_1.default)(writableSigners.length > 0, "Expected at least one writable signer key");
            const [payerAddress] = writableSigners[0];
            (0, node_assert_1.default)(payerAddress === this.payer.toBase58(), "Expected first writable signer key to be the fee payer");
        }
        const staticAccountKeys = [
            ...writableSigners.map(([address]) => new web3_js_1.PublicKey(address)),
            ...readonlySigners.map(([address]) => new web3_js_1.PublicKey(address)),
            ...writableNonSigners.map(([address]) => new web3_js_1.PublicKey(address)),
            ...readonlyNonSigners.map(([address]) => new web3_js_1.PublicKey(address)),
        ];
        return [header, staticAccountKeys];
    }
    extractTableLookup(lookupTable) {
        const [writableIndexes, drainedWritableKeys] = this.drainKeysFoundInLookupTable(lookupTable.state.addresses, (keyMeta) => !keyMeta.isSigner && !keyMeta.isInvoked && keyMeta.isWritable);
        const [readonlyIndexes, drainedReadonlyKeys] = this.drainKeysFoundInLookupTable(lookupTable.state.addresses, (keyMeta) => !keyMeta.isSigner && !keyMeta.isInvoked && !keyMeta.isWritable);
        // Don't extract lookup if no keys were found
        if (writableIndexes.length === 0 && readonlyIndexes.length === 0) {
            return;
        }
        return [
            {
                accountKey: lookupTable.key,
                writableIndexes,
                readonlyIndexes,
            },
            {
                writable: drainedWritableKeys,
                readonly: drainedReadonlyKeys,
            },
        ];
    }
    /** @internal */
    drainKeysFoundInLookupTable(lookupTableEntries, keyMetaFilter) {
        const lookupTableIndexes = new Array();
        const drainedKeys = new Array();
        for (const [address, keyMeta] of this.keyMetaMap.entries()) {
            if (keyMetaFilter(keyMeta)) {
                const key = new web3_js_1.PublicKey(address);
                const lookupTableIndex = lookupTableEntries.findIndex((entry) => entry.equals(key));
                if (lookupTableIndex >= 0) {
                    (0, node_assert_1.default)(lookupTableIndex < 256, "Max lookup table index exceeded");
                    lookupTableIndexes.push(lookupTableIndex);
                    drainedKeys.push(key);
                    this.keyMetaMap.delete(address);
                }
            }
        }
        return [lookupTableIndexes, drainedKeys];
    }
}
exports.CompiledKeys = CompiledKeys;
//# sourceMappingURL=compiledKeys.js.map