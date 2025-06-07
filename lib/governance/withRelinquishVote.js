"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withRelinquishVote = void 0;
const web3_js_1 = require("@solana/web3.js");
const serialisation_1 = require("./serialisation");
const borsh_1 = require("borsh");
const instructions_1 = require("./instructions");
const constants_1 = require("../registry/constants");
const withRelinquishVote = async (instructions, programId, programVersion, realm, governance, proposal, tokenOwnerRecord, governingTokenMint, voteRecord, governanceAuthority, beneficiary) => {
    const args = new instructions_1.RelinquishVoteArgs();
    const data = Buffer.from((0, borsh_1.serialize)((0, serialisation_1.getGovernanceInstructionSchema)(programVersion), args));
    const v3Keys = programVersion >= constants_1.PROGRAM_VERSION_V3
        ? [
            {
                pubkey: realm,
                isWritable: false,
                isSigner: false,
            },
        ]
        : [];
    const keys = [
        {
            pubkey: governance,
            isWritable: false,
            isSigner: false,
        },
        {
            pubkey: proposal,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: tokenOwnerRecord,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: voteRecord,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: governingTokenMint,
            isWritable: false,
            isSigner: false,
        },
    ];
    const existingVoteKeys = governanceAuthority && beneficiary
        ? [
            {
                pubkey: governanceAuthority,
                isWritable: false,
                isSigner: true,
            },
            {
                pubkey: beneficiary,
                isWritable: true,
                isSigner: false,
            },
        ]
        : [];
    instructions.push(new web3_js_1.TransactionInstruction({
        keys: [...v3Keys, ...keys, ...existingVoteKeys],
        programId,
        data,
    }));
};
exports.withRelinquishVote = withRelinquishVote;
//# sourceMappingURL=withRelinquishVote.js.map