"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withExtendTransactionBuffer = void 0;
const web3_js_1 = require("@solana/web3.js");
const serialisation_1 = require("./serialisation");
const borsh_1 = require("borsh");
const instructions_1 = require("./instructions");
const accounts_1 = require("./accounts");
// Transaction instruction to extend the transaction buffer of a proposal
// This instruction allows the creator of a proposal to extend the transaction buffer
// by providing a new buffer of instructions. The buffer index indicates which
// transaction buffer is being extended.
// NOTE: This is only used when the transaction byte size exceeds the 800 byte safe limit
const withExtendTransactionBuffer = (instructions, programId, governance, proposal, creator, bufferIndex, buffer) => {
    const args = new instructions_1.ExtendTransactionBufferArgs({ bufferIndex, buffer });
    const data = Buffer.from((0, borsh_1.serialize)(serialisation_1.GOVERNANCE_INSTRUCTION_SCHEMA_V3, args));
    const proposalTransactionBufferAddress = (0, accounts_1.getProposalTransactionBufferAddress)(programId, proposal, creator, bufferIndex);
    const keys = [
        { pubkey: governance, isWritable: false, isSigner: false },
        { pubkey: proposal, isWritable: false, isSigner: false },
        { pubkey: proposalTransactionBufferAddress, isWritable: true, isSigner: false },
        { pubkey: creator, isWritable: false, isSigner: true },
    ];
    instructions.push(new web3_js_1.TransactionInstruction({ keys, programId, data }));
    return proposalTransactionBufferAddress;
};
exports.withExtendTransactionBuffer = withExtendTransactionBuffer;
//# sourceMappingURL=withExtendTransactionBuffer.js.map