"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withInsertTransaction = void 0;
const web3_js_1 = require("@solana/web3.js");
const serialisation_1 = require("./serialisation");
const borsh_1 = require("borsh");
const instructions_1 = require("./instructions");
const accounts_1 = require("./accounts");
const runtime_1 = require("../tools/sdk/runtime");
const constants_1 = require("../registry/constants");
const withInsertTransaction = async (instructions, programId, programVersion, governance, proposal, tokenOwnerRecord, governanceAuthority, index, optionIndex, holdUpTime, transactionInstructions, payer) => {
    const args = new instructions_1.InsertTransactionArgs({
        index,
        optionIndex,
        holdUpTime,
        instructionData: programVersion === constants_1.PROGRAM_VERSION_V1 ? transactionInstructions[0] : undefined,
        instructions: programVersion >= constants_1.PROGRAM_VERSION_V2 ? transactionInstructions : undefined,
    });
    const data = Buffer.from((0, borsh_1.serialize)((0, serialisation_1.getGovernanceInstructionSchema)(programVersion), args));
    const proposalTransactionAddress = await (0, accounts_1.getProposalTransactionAddress)(programId, programVersion, proposal, optionIndex, index);
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
            isWritable: false,
            isSigner: false,
        },
        {
            pubkey: governanceAuthority,
            isWritable: false,
            isSigner: true,
        },
        {
            pubkey: proposalTransactionAddress,
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
        {
            pubkey: web3_js_1.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
    ];
    instructions.push(new web3_js_1.TransactionInstruction({
        keys,
        programId,
        data,
    }));
    return proposalTransactionAddress;
};
exports.withInsertTransaction = withInsertTransaction;
//# sourceMappingURL=withInsertTransaction.js.map