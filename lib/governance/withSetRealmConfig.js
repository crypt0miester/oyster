"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withSetRealmConfig = withSetRealmConfig;
const web3_js_1 = require("@solana/web3.js");
const accounts_1 = require("./accounts");
const instructions_1 = require("./instructions");
const serialisation_1 = require("./serialisation");
const borsh_1 = require("borsh");
const runtime_1 = require("../tools/sdk/runtime");
const constants_1 = require("../registry/constants");
const tools_1 = require("./tools");
async function withSetRealmConfig(instructions, programId, programVersion, realm, realmAuthority, councilMint, communityMintMaxVoteWeightSource, minCommunityWeightToCreateGovernance, communityTokenConfig, councilTokenConfig, payer) {
    const configArgs = (0, tools_1.createRealmConfigArgs)(programVersion, councilMint, communityMintMaxVoteWeightSource, minCommunityWeightToCreateGovernance, communityTokenConfig, councilTokenConfig);
    const args = new instructions_1.SetRealmConfigArgs({ configArgs });
    const data = Buffer.from((0, borsh_1.serialize)((0, serialisation_1.getGovernanceInstructionSchema)(programVersion), args));
    let keys = [
        {
            pubkey: realm,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: realmAuthority,
            isWritable: false,
            isSigner: true,
        },
    ];
    if (councilMint) {
        const councilTokenHoldingAddress = await (0, accounts_1.getTokenHoldingAddress)(programId, realm, councilMint);
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
        ];
    }
    if (programVersion > constants_1.PROGRAM_VERSION_V1) {
        keys.push({
            pubkey: runtime_1.SYSTEM_PROGRAM_ID,
            isSigner: false,
            isWritable: false,
        });
        const realmConfigAddress = await (0, accounts_1.getRealmConfigAddress)(programId, realm);
        keys.push({
            pubkey: realmConfigAddress,
            isSigner: false,
            isWritable: true,
        });
        (0, tools_1.withTokenConfigAccounts)(keys, communityTokenConfig, councilTokenConfig);
        if (payer &&
            (programVersion >= constants_1.PROGRAM_VERSION_V3 ||
                (communityTokenConfig === null || communityTokenConfig === void 0 ? void 0 : communityTokenConfig.voterWeightAddin) ||
                (communityTokenConfig === null || communityTokenConfig === void 0 ? void 0 : communityTokenConfig.maxVoterWeightAddin))) {
            keys.push({
                pubkey: payer,
                isSigner: true,
                isWritable: true,
            });
        }
    }
    instructions.push(new web3_js_1.TransactionInstruction({
        keys,
        programId,
        data,
    }));
}
//# sourceMappingURL=withSetRealmConfig.js.map