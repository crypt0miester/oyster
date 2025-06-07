"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRealmConfigArgs = createRealmConfigArgs;
exports.withTokenConfigAccounts = withTokenConfigAccounts;
exports.withV3RealmConfigAccount = withV3RealmConfigAccount;
const constants_1 = require("../registry/constants");
const accounts_1 = require("./accounts");
const enums_1 = require("./enums");
function assertValidTokenConfigArgs(programVersion, tokenConfigArgs, tokenKind) {
    if (tokenConfigArgs) {
        if (programVersion < constants_1.PROGRAM_VERSION_V2) {
            throw new Error(`Governing token config is not supported in version ${programVersion}`);
        }
        if (programVersion === constants_1.PROGRAM_VERSION_V2) {
            if (tokenKind === enums_1.GoverningTokenRole.Council) {
                throw new Error(`Council token config is not supported in version ${programVersion}`);
            }
            if (tokenConfigArgs.tokenType !== accounts_1.GoverningTokenType.Liquid) {
                throw new Error(`Community token type ${tokenConfigArgs.tokenType} is not supported in veriosn ${programVersion}`);
            }
        }
    }
}
function createRealmConfigArgs(programVersion, councilMint, communityMintMaxVoteWeightSource, minCommunityWeightToCreateGovernance, communityTokenConfig, councilTokenConfig) {
    var _a, _b;
    assertValidTokenConfigArgs(programVersion, communityTokenConfig, enums_1.GoverningTokenRole.Community);
    assertValidTokenConfigArgs(programVersion, councilTokenConfig, enums_1.GoverningTokenRole.Council);
    return new accounts_1.RealmConfigArgs({
        useCouncilMint: councilMint !== undefined,
        minCommunityTokensToCreateGovernance: minCommunityWeightToCreateGovernance,
        communityMintMaxVoteWeightSource,
        // VERSION == 2
        useCommunityVoterWeightAddin: (communityTokenConfig === null || communityTokenConfig === void 0 ? void 0 : communityTokenConfig.voterWeightAddin) !== undefined,
        useMaxCommunityVoterWeightAddin: (communityTokenConfig === null || communityTokenConfig === void 0 ? void 0 : communityTokenConfig.maxVoterWeightAddin) !== undefined,
        // VERSION >= 3
        communityTokenConfigArgs: new accounts_1.GoverningTokenConfigArgs({
            useVoterWeightAddin: (communityTokenConfig === null || communityTokenConfig === void 0 ? void 0 : communityTokenConfig.voterWeightAddin) !== undefined,
            useMaxVoterWeightAddin: (communityTokenConfig === null || communityTokenConfig === void 0 ? void 0 : communityTokenConfig.maxVoterWeightAddin) !== undefined,
            tokenType: (_a = communityTokenConfig === null || communityTokenConfig === void 0 ? void 0 : communityTokenConfig.tokenType) !== null && _a !== void 0 ? _a : accounts_1.GoverningTokenType.Liquid,
        }),
        councilTokenConfigArgs: new accounts_1.GoverningTokenConfigArgs({
            useVoterWeightAddin: (councilTokenConfig === null || councilTokenConfig === void 0 ? void 0 : councilTokenConfig.voterWeightAddin) !== undefined,
            useMaxVoterWeightAddin: (councilTokenConfig === null || councilTokenConfig === void 0 ? void 0 : councilTokenConfig.maxVoterWeightAddin) !== undefined,
            tokenType: (_b = councilTokenConfig === null || councilTokenConfig === void 0 ? void 0 : councilTokenConfig.tokenType) !== null && _b !== void 0 ? _b : accounts_1.GoverningTokenType.Liquid,
        }),
    });
}
function withTokenConfigAccounts(keys, communityTokenConfig, councilTokenConfig) {
    if (communityTokenConfig === null || communityTokenConfig === void 0 ? void 0 : communityTokenConfig.voterWeightAddin) {
        keys.push({
            pubkey: communityTokenConfig.voterWeightAddin,
            isWritable: false,
            isSigner: false,
        });
    }
    if (communityTokenConfig === null || communityTokenConfig === void 0 ? void 0 : communityTokenConfig.maxVoterWeightAddin) {
        keys.push({
            pubkey: communityTokenConfig.maxVoterWeightAddin,
            isWritable: false,
            isSigner: false,
        });
    }
    if (councilTokenConfig === null || councilTokenConfig === void 0 ? void 0 : councilTokenConfig.voterWeightAddin) {
        keys.push({
            pubkey: councilTokenConfig.voterWeightAddin,
            isWritable: false,
            isSigner: false,
        });
    }
    if (councilTokenConfig === null || councilTokenConfig === void 0 ? void 0 : councilTokenConfig.maxVoterWeightAddin) {
        keys.push({
            pubkey: councilTokenConfig.maxVoterWeightAddin,
            isWritable: false,
            isSigner: false,
        });
    }
}
async function withV3RealmConfigAccount(keys, programId, programVersion, realm) {
    if (programVersion >= constants_1.PROGRAM_VERSION_V3) {
        const realmConfigMeta = {
            pubkey: await (0, accounts_1.getRealmConfigAddress)(programId, realm),
            isSigner: false,
            isWritable: true,
        };
        keys.push(realmConfigMeta);
    }
}
//# sourceMappingURL=tools.js.map