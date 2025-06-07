"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withCreateRealm = withCreateRealm;
const web3_js_1 = require("@solana/web3.js");
const serialisation_1 = require("./serialisation");
const borsh_1 = require("borsh");
const instructions_1 = require("./instructions");
const accounts_1 = require("./accounts");
const constants_1 = require("../registry/constants");
const sdk_1 = require("../tools/sdk");
const tools_1 = require("./tools");
async function withCreateRealm(instructions, programId, programVersion, name, realmAuthority, communityMint, payer, councilMint, communityMintMaxVoteWeightSource, minCommunityWeightToCreateGovernance, communityTokenConfig, councilTokenConfig, communityTokenProgram = sdk_1.TOKEN_PROGRAM_ID, councilTokenProgram = sdk_1.TOKEN_PROGRAM_ID) {
    const configArgs = (0, tools_1.createRealmConfigArgs)(programVersion, councilMint, communityMintMaxVoteWeightSource, minCommunityWeightToCreateGovernance, communityTokenConfig, councilTokenConfig);
    const args = new instructions_1.CreateRealmArgs({
        configArgs,
        name,
    });
    const data = Buffer.from((0, borsh_1.serialize)((0, serialisation_1.getGovernanceInstructionSchema)(programVersion), args));
    const [realmAddress] = await web3_js_1.PublicKey.findProgramAddress([Buffer.from(accounts_1.GOVERNANCE_PROGRAM_SEED), Buffer.from(args.name)], programId);
    const communityTokenHoldingAddress = await (0, accounts_1.getTokenHoldingAddress)(programId, realmAddress, communityMint);
    let keys = [
        {
            pubkey: realmAddress,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: realmAuthority,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: communityMint,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: communityTokenHoldingAddress,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: payer,
            isSigner: true,
            isWritable: true,
        },
        {
            pubkey: sdk_1.SYSTEM_PROGRAM_ID,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: communityTokenProgram,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: web3_js_1.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
    ];
    if (councilMint) {
        const councilTokenHoldingAddress = await (0, accounts_1.getTokenHoldingAddress)(programId, realmAddress, councilMint);
        keys = [
            ...keys,
            {
                pubkey: councilMint,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: councilTokenHoldingAddress,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: councilTokenProgram,
                isSigner: false,
                isWritable: false,
            },
        ];
    }
    const realmConfigMeta = {
        pubkey: await (0, accounts_1.getRealmConfigAddress)(programId, realmAddress),
        isSigner: false,
        isWritable: true,
    };
    if (programVersion >= constants_1.PROGRAM_VERSION_V3) {
        keys.push(realmConfigMeta);
    }
    (0, tools_1.withTokenConfigAccounts)(keys, communityTokenConfig, councilTokenConfig);
    if (programVersion === constants_1.PROGRAM_VERSION_V2 &&
        ((communityTokenConfig === null || communityTokenConfig === void 0 ? void 0 : communityTokenConfig.voterWeightAddin) || (communityTokenConfig === null || communityTokenConfig === void 0 ? void 0 : communityTokenConfig.maxVoterWeightAddin))) {
        keys.push(realmConfigMeta);
    }
    instructions.push(new web3_js_1.TransactionInstruction({
        keys,
        programId,
        data,
    }));
    return realmAddress;
}
//# sourceMappingURL=withCreateRealm.js.map