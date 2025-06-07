"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaxVoterWeightRecord = getMaxVoterWeightRecord;
exports.getVoterWeightRecord = getVoterWeightRecord;
exports.getGovernanceAddinAccount = getGovernanceAddinAccount;
const accounts_1 = require("./accounts");
const serialisation_1 = require("./serialisation");
async function getMaxVoterWeightRecord(connection, maxVoterWeightRecordPk) {
    return getGovernanceAddinAccount(connection, maxVoterWeightRecordPk, accounts_1.MaxVoterWeightRecord);
}
async function getVoterWeightRecord(connection, voterWeightRecordPk) {
    return getGovernanceAddinAccount(connection, voterWeightRecordPk, accounts_1.VoterWeightRecord);
}
async function getGovernanceAddinAccount(connection, accountPk, accountClass) {
    const accountInfo = await connection.getAccountInfo(accountPk);
    if (!accountInfo) {
        throw new Error(`Account ${accountPk} of type ${accountClass.name} not found`);
    }
    return (0, serialisation_1.GovernanceAddinAccountParser)(accountClass)(accountPk, accountInfo);
}
//# sourceMappingURL=api.js.map