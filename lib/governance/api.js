"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRealm = getRealm;
exports.getRealms = getRealms;
exports.tryGetRealmConfig = tryGetRealmConfig;
exports.getRealmConfig = getRealmConfig;
exports.getVoteRecord = getVoteRecord;
exports.getVoteRecordsByVoter = getVoteRecordsByVoter;
exports.getTokenOwnerRecordForRealm = getTokenOwnerRecordForRealm;
exports.getTokenOwnerRecord = getTokenOwnerRecord;
exports.getTokenOwnerRecordsByOwner = getTokenOwnerRecordsByOwner;
exports.getAllTokenOwnerRecords = getAllTokenOwnerRecords;
exports.getGovernance = getGovernance;
exports.getAllGovernances = getAllGovernances;
exports.getProposal = getProposal;
exports.getProposalsByGovernance = getProposalsByGovernance;
exports.getAllProposals = getAllProposals;
exports.getProposalDepositsByDepositPayer = getProposalDepositsByDepositPayer;
exports.getGovernanceAccounts = getGovernanceAccounts;
exports.getGovernanceAccount = getGovernanceAccount;
exports.tryGetGovernanceAccount = tryGetGovernanceAccount;
const web3_js_1 = require("@solana/web3.js");
const serialisation_1 = require("./serialisation");
const accounts_1 = require("./accounts");
const api_1 = require("../core/api");
const bs58_1 = __importDefault(require("bs58"));
const borsh_1 = require("../tools/borsh");
const tools_1 = require("../tools");
async function getRealm(connection, realm) {
    return getGovernanceAccount(connection, realm, accounts_1.Realm);
}
async function getRealms(connection, programIds) {
    if (programIds instanceof web3_js_1.PublicKey) {
        return getGovernanceAccounts(connection, programIds, accounts_1.Realm);
    }
    return _getRealms(connection, programIds);
}
async function _getRealms(connection, programIds) {
    var _a;
    const accountTypes = (0, accounts_1.getAccountTypes)(accounts_1.Realm);
    const rpcEndpoint = connection.rpcEndpoint;
    const rawProgramAccounts = [];
    for (const accountType of accountTypes) {
        const response = await fetch(rpcEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify([
                ...programIds.map((x) => {
                    return {
                        jsonrpc: "2.0",
                        id: x.toBase58(),
                        method: "getProgramAccounts",
                        params: [
                            x.toBase58(),
                            {
                                commitment: connection.commitment,
                                encoding: "base64",
                                filters: [
                                    {
                                        memcmp: {
                                            offset: 0,
                                            bytes: bs58_1.default.encode([accountType]),
                                        },
                                    },
                                ],
                            },
                        ],
                    };
                }),
            ]),
        });
        const programAccountsJson = { data: await response.json() };
        // biome-ignore lint: multi account raw program accounts that will be fixed below
        rawProgramAccounts.push(...(_a = programAccountsJson === null || programAccountsJson === void 0 ? void 0 : programAccountsJson.data) === null || _a === void 0 ? void 0 : _a.filter((x) => x.result).flatMap((x) => x.result));
    }
    const accounts = [];
    for (const rawAccount of rawProgramAccounts) {
        try {
            const data = Buffer.from(rawAccount.account.data[0], "base64");
            const accountType = data[0];
            const account = {
                pubkey: new web3_js_1.PublicKey(rawAccount.pubkey),
                account: (0, borsh_1.deserializeBorsh)((0, serialisation_1.getGovernanceSchemaForAccount)(accountType), accounts_1.Realm, data),
                owner: rawAccount.account.owner,
            };
            accounts.push(account);
        }
        catch (ex) {
            console.info(`Can't deserialize Realm @ ${rawAccount.pubkey}.`, (0, tools_1.getErrorMessage)(ex));
        }
    }
    return accounts;
}
// Realm config
async function tryGetRealmConfig(connection, programId, realmPk) {
    try {
        const realmConfigPk = await (0, accounts_1.getRealmConfigAddress)(programId, realmPk);
        return await getGovernanceAccount(connection, realmConfigPk, accounts_1.RealmConfigAccount);
    }
    catch (_a) {
        // RealmConfigAccount didn't exist in V1 and was optional in V2 and hence it doesn't have to exist
    }
}
async function getRealmConfig(connection, realmConfigPk) {
    return getGovernanceAccount(connection, realmConfigPk, accounts_1.RealmConfigAccount);
}
// VoteRecords
async function getVoteRecord(connection, voteRecordPk) {
    return getGovernanceAccount(connection, voteRecordPk, accounts_1.VoteRecord);
}
async function getVoteRecordsByVoter(connection, programId, voter) {
    return getGovernanceAccounts(connection, programId, accounts_1.VoteRecord, [(0, api_1.pubkeyFilter)(33, voter)]);
}
// TokenOwnerRecords
async function getTokenOwnerRecordForRealm(connection, programId, realm, governingTokenMint, governingTokenOwner) {
    const tokenOwnerRecordPk = await (0, accounts_1.getTokenOwnerRecordAddress)(programId, realm, governingTokenMint, governingTokenOwner);
    return getGovernanceAccount(connection, tokenOwnerRecordPk, accounts_1.TokenOwnerRecord);
}
async function getTokenOwnerRecord(connection, tokenOwnerRecordPk) {
    return getGovernanceAccount(connection, tokenOwnerRecordPk, accounts_1.TokenOwnerRecord);
}
/**
 * Returns TokenOwnerRecords for the given token owner (voter)
 * Note: The function returns TokenOwnerRecords for both council and community token holders
 *
 * @param connection
 * @param programId
 * @param governingTokenOwner
 * @returns
 */
async function getTokenOwnerRecordsByOwner(connection, programId, governingTokenOwner) {
    return getGovernanceAccounts(connection, programId, accounts_1.TokenOwnerRecord, [
        (0, api_1.pubkeyFilter)(1 + 32 + 32, governingTokenOwner),
    ]);
}
/**
 * Returns all TokenOwnerRecords for all members for the given Realm
 * Note: The function returns TokenOwnerRecords for both council and community token holders
 *
 * @param connection
 * @param programId
 * @param realmPk
 * @returns
 */
async function getAllTokenOwnerRecords(connection, programId, realmPk) {
    return getGovernanceAccounts(connection, programId, accounts_1.TokenOwnerRecord, [(0, api_1.pubkeyFilter)(1, realmPk)]);
}
// Governances
async function getGovernance(connection, governance) {
    return getGovernanceAccount(connection, governance, accounts_1.Governance);
}
/**
 * Returns all governances for the given program instance and realm
 *
 * @param connection
 * @param programId
 * @param realmPk
 * @returns
 */
async function getAllGovernances(connection, programId, realmPk) {
    return getGovernanceAccounts(connection, programId, accounts_1.Governance, [(0, api_1.pubkeyFilter)(1, realmPk)]);
}
// Proposal
async function getProposal(connection, proposal) {
    return getGovernanceAccount(connection, proposal, accounts_1.Proposal);
}
/**
 * Returns all Proposals for the given Governance
 *
 * @param connection
 * @param programId
 * @param governancePk
 * @returns
 */
async function getProposalsByGovernance(connection, programId, governancePk) {
    return getGovernanceAccounts(connection, programId, accounts_1.Proposal, [(0, api_1.pubkeyFilter)(1, governancePk)]);
}
/**
 * Returns all Proposals for the given Realm
 *
 * @param connection
 * @param programId
 * @param realmPk
 * @returns
 */
async function getAllProposals(connection, programId, realmPk) {
    return getAllGovernances(connection, programId, realmPk).then((gs) => Promise.all(gs.map((g) => getProposalsByGovernance(connection, programId, g.pubkey))));
}
// ProposalDeposit api
/**
 * Returns all ProposalDeposits for the given deposit payer
 * @param connection
 * @param programId
 * @param depositPayer
 * @returns
 */
async function getProposalDepositsByDepositPayer(connection, programId, depositPayer) {
    return getGovernanceAccounts(connection, programId, accounts_1.ProposalDeposit, [(0, api_1.pubkeyFilter)(1 + 32, depositPayer)]);
}
// Generic API
async function getGovernanceAccounts(connection, programId, accountClass, filters = []) {
    const accountTypes = (0, accounts_1.getAccountTypes)(accountClass);
    let all = [];
    for (const accountType of accountTypes) {
        const accounts = await (0, api_1.getBorshProgramAccounts)(connection, programId, (at) => (0, serialisation_1.getGovernanceSchemaForAccount)(at), accountClass, filters, accountType);
        all = all.concat(accounts);
    }
    return all;
}
async function getGovernanceAccount(connection, accountPk, accountClass) {
    const accountInfo = await connection.getAccountInfo(accountPk);
    if (!accountInfo) {
        throw new Error(`Account ${accountPk} of type ${accountClass.name} not found`);
    }
    return (0, serialisation_1.GovernanceAccountParser)(accountClass)(accountPk, accountInfo);
}
async function tryGetGovernanceAccount(connection, accountPk, accountClass) {
    const accountInfo = await connection.getAccountInfo(accountPk);
    if (accountInfo) {
        return (0, serialisation_1.GovernanceAccountParser)(accountClass)(accountPk, accountInfo);
    }
}
//# sourceMappingURL=api.js.map