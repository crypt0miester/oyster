"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withRemoveTransaction = void 0;
const web3_js_1 = require("@solana/web3.js");
const serialisation_1 = require("./serialisation");
const borsh_1 = require("borsh");
const instructions_1 = require("./instructions");
const withRemoveTransaction = async (instructions, programId, programVersion, proposal, tokenOwnerRecord, governanceAuthority, proposalTransaction, beneficiary) => {
    const args = new instructions_1.RemoveTransactionArgs();
    const data = Buffer.from((0, borsh_1.serialize)((0, serialisation_1.getGovernanceInstructionSchema)(programVersion), args));
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
            pubkey: proposalTransaction,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: beneficiary,
            isWritable: true,
            isSigner: false,
        },
    ];
    instructions.push(new web3_js_1.TransactionInstruction({
        keys,
        programId,
        data,
    }));
};
exports.withRemoveTransaction = withRemoveTransaction;
//# sourceMappingURL=withRemoveTransaction.js.map