"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withRealmConfigPluginAccounts = withRealmConfigPluginAccounts;
const accounts_1 = require("./accounts");
async function withRealmConfigPluginAccounts(keys, programId, realm, voterWeightRecord, maxVoterWeightRecord) {
    const realmConfigAddress = await (0, accounts_1.getRealmConfigAddress)(programId, realm);
    keys.push({
        pubkey: realmConfigAddress,
        isWritable: false,
        isSigner: false,
    });
    if (voterWeightRecord) {
        keys.push({
            pubkey: voterWeightRecord,
            isWritable: false,
            isSigner: false,
        });
    }
    if (maxVoterWeightRecord) {
        keys.push({
            pubkey: maxVoterWeightRecord,
            isWritable: false,
            isSigner: false,
        });
    }
}
//# sourceMappingURL=withRealmConfigPluginAccounts.js.map