"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withCastVote = void 0;
const web3_js_1 = require("@solana/web3.js");
const serialisation_1 = require("./serialisation");
const borsh_1 = require("borsh");
const instructions_1 = require("./instructions");
const accounts_1 = require("./accounts");
const constants_1 = require("../registry/constants");
const runtime_1 = require("../tools/sdk/runtime");
const withRealmConfigPluginAccounts_1 = require("./withRealmConfigPluginAccounts");
const withCastVote = async (instructions, programId, programVersion, realm, governance, proposal, proposalOwnerRecord, tokenOwnerRecord, governanceAuthority, voteGoverningTokenMint, vote, payer, voterWeightRecord, maxVoterWeightRecord) => {
    const args = new instructions_1.CastVoteArgs(programVersion === constants_1.PROGRAM_VERSION_V1
        ? { yesNoVote: vote.toYesNoVote(), vote: undefined }
        : { yesNoVote: undefined, vote: vote });
    const data = Buffer.from((0, borsh_1.serialize)((0, serialisation_1.getGovernanceInstructionSchema)(programVersion), args));
    const voteRecordAddress = await (0, accounts_1.getVoteRecordAddress)(programId, proposal, tokenOwnerRecord);
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
            pubkey: tokenOwnerRecord,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: governanceAuthority,
            isWritable: false,
            isSigner: true,
        },
        {
            pubkey: voteRecordAddress,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: voteGoverningTokenMint,
            isWritable: false,
            isSigner: false,
        },
        {
            pubkey: payer,
            isWritable: true,
            isSigner: true,
        },
        {
            pubkey: runtime_1.SYSTEM_PROGRAM_ID,
            isSigner: false,
            isWritable: false,
        },
    ];
    if (programVersion === constants_1.PROGRAM_VERSION_V1) {
        keys.push({
            pubkey: web3_js_1.SYSVAR_RENT_PUBKEY,
            isWritable: false,
            isSigner: false,
        }, {
            pubkey: web3_js_1.SYSVAR_CLOCK_PUBKEY,
            isSigner: false,
            isWritable: false,
        });
    }
    await (0, withRealmConfigPluginAccounts_1.withRealmConfigPluginAccounts)(keys, programId, realm, voterWeightRecord, maxVoterWeightRecord);
    instructions.push(new web3_js_1.TransactionInstruction({
        keys,
        programId,
        data,
    }));
    return voteRecordAddress;
};
exports.withCastVote = withCastVote;
//# sourceMappingURL=withCastVote.js.map