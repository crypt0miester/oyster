"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withFinalizeVote = void 0;
const web3_js_1 = require("@solana/web3.js");
const serialisation_1 = require("./serialisation");
const borsh_1 = require("borsh");
const instructions_1 = require("./instructions");
const constants_1 = require("../registry/constants");
const withRealmConfigPluginAccounts_1 = require("./withRealmConfigPluginAccounts");
const withFinalizeVote = async (instructions, programId, programVersion, realm, governance, proposal, proposalOwnerRecord, governingTokenMint, maxVoterWeightRecord) => {
    const args = new instructions_1.FinalizeVoteArgs();
    const data = Buffer.from((0, borsh_1.serialize)((0, serialisation_1.getGovernanceInstructionSchema)(programVersion), args));
    const [realmIsWritable, governanceIsWritable] = programVersion === constants_1.PROGRAM_VERSION_V1 ? [false, false] : [true, true];
    const keys = [
        {
            pubkey: realm,
            isWritable: realmIsWritable,
            isSigner: false,
        },
        {
            pubkey: governance,
            isWritable: governanceIsWritable,
            isSigner: false,
        },
        {
            pubkey: proposal,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: proposalOwnerRecord,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: governingTokenMint,
            isWritable: false,
            isSigner: false,
        },
    ];
    if (programVersion === constants_1.PROGRAM_VERSION_V1) {
        keys.push({
            pubkey: web3_js_1.SYSVAR_CLOCK_PUBKEY,
            isSigner: false,
            isWritable: false,
        });
    }
    await (0, withRealmConfigPluginAccounts_1.withRealmConfigPluginAccounts)(keys, programId, realm, undefined, maxVoterWeightRecord);
    instructions.push(new web3_js_1.TransactionInstruction({
        keys,
        programId,
        data,
    }));
};
exports.withFinalizeVote = withFinalizeVote;
//# sourceMappingURL=withFinalizeVote.js.map