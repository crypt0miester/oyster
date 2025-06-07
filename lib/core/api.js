"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.booleanFilter = exports.pubkeyFilter = exports.MemcmpFilter = exports.RpcContext = void 0;
exports.isWalletNotConnectedError = isWalletNotConnectedError;
exports.getBorshProgramAccounts = getBorshProgramAccounts;
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
const script_1 = require("../tools/script");
const borsh_1 = require("../tools/borsh");
function isWalletNotConnectedError(error) {
    return error instanceof WalletNotConnectedError;
}
// Context to make RPC calls for given clone programId, current connection, endpoint and wallet
class RpcContext {
    constructor(programId, programVersion, wallet, connection, endpoint) {
        this.programId = programId;
        this.wallet = wallet;
        this.connection = connection;
        this.endpoint = endpoint;
        this.programVersion = programVersion;
    }
    get walletPubkey() {
        var _a;
        if (!((_a = this.wallet) === null || _a === void 0 ? void 0 : _a.publicKey)) {
            throw new WalletNotConnectedError();
        }
        return this.wallet.publicKey;
    }
    get programIdBase58() {
        return this.programId.toBase58();
    }
}
exports.RpcContext = RpcContext;
class MemcmpFilter {
    constructor(offset, bytes) {
        this.offset = offset;
        this.bytes = bytes;
    }
    isMatch(buffer) {
        if (this.offset + this.bytes.length > buffer.length) {
            return false;
        }
        for (let i = 0; i < this.bytes.length; i++) {
            if (this.bytes[i] !== buffer[this.offset + i])
                return false;
        }
        return true;
    }
}
exports.MemcmpFilter = MemcmpFilter;
// PublicKey MemcmpFilter
const pubkeyFilter = (offset, pubkey) => !pubkey ? undefined : new MemcmpFilter(offset, pubkey.toBuffer());
exports.pubkeyFilter = pubkeyFilter;
// Boolean MemcmpFilter
const booleanFilter = (offset, value) => new MemcmpFilter(offset, Buffer.from(value ? [1] : [0]));
exports.booleanFilter = booleanFilter;
async function getBorshProgramAccounts(connection, programId, getSchema, accountFactory, filters = [], accountType) {
    const accountTypeFixed = accountType !== null && accountType !== void 0 ? accountType : new accountFactory({}).accountType;
    const programAccounts = await connection.getProgramAccounts(programId, {
        commitment: connection.commitment,
        filters: [
            {
                memcmp: {
                    offset: 0,
                    bytes: bs58_1.default.encode([accountTypeFixed]),
                },
            },
            ...filters.map((f) => ({
                memcmp: { offset: f.offset, bytes: bs58_1.default.encode(f.bytes) },
            })),
        ],
    });
    const accounts = [];
    for (const rawAccount of programAccounts) {
        try {
            const data = rawAccount.account.data;
            const accountType = data[0];
            const account = {
                pubkey: new web3_js_1.PublicKey(rawAccount.pubkey),
                account: (0, borsh_1.deserializeBorsh)(getSchema(accountType), accountFactory, data),
                owner: rawAccount.account.owner,
            };
            accounts.push(account);
        }
        catch (ex) {
            console.info(`Can't deserialize ${accountFactory.name} @ ${rawAccount.pubkey}.`, (0, script_1.getErrorMessage)(ex));
        }
    }
    return accounts;
}
//# sourceMappingURL=api.js.map