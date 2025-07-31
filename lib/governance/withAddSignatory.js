"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAddSignatory = void 0;
const web3_js_1 = require("@solana/web3.js");
const serialisation_1 = require("./serialisation");
const borsh_1 = require("borsh");
const instructions_1 = require("./instructions");
const accounts_1 = require("./accounts");
const runtime_1 = require("../tools/sdk/runtime");
const constants_1 = require("../registry/constants");
const withAddSignatory = async (instructions, programId, programVersion, proposal, tokenOwnerRecord, governanceAuthority, signatory, payer) => {
    const args = new instructions_1.AddSignatoryArgs({ signatory });
    const data = Buffer.from((0, borsh_1.serialize)((0, serialisation_1.getGovernanceInstructionSchema)(programVersion), args));
    const signatoryRecordAddress = await (0, accounts_1.getSignatoryRecordAddress)(programId, proposal, signatory);
    const keys = [
        {
            pubkey: proposal,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: tokenOwnerRecord,
            isWritable: false,
            isSigner: false,
        },
        {
            pubkey: governanceAuthority,
            isWritable: false,
            isSigner: true,
        },
        {
            pubkey: signatoryRecordAddress,
            isWritable: true,
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
            isSigner: false,
            isWritable: false,
        });
    }
    instructions.push(new web3_js_1.TransactionInstruction({
        keys,
        programId,
        data,
    }));
    return signatoryRecordAddress;
};
exports.withAddSignatory = withAddSignatory;
//# sourceMappingURL=withAddSignatory.js.map