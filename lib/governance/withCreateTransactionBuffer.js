"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withCreateTransactionBuffer = void 0;
const web3_js_1 = require("@solana/web3.js");
const serialisation_1 = require("./serialisation");
const borsh_1 = require("borsh");
const instructions_1 = require("./instructions");
const accounts_1 = require("./accounts");
const tools_1 = require("../tools");
const withCreateTransactionBuffer = (instructions, programId, governance, proposal, tokenOwnerRecord, governanceAuthority, payer, bufferIndex, finalBufferHash, finalBufferSize, buffer) => {
    const args = new instructions_1.CreateTransactionBufferArgs({
        bufferIndex,
        finalBufferHash,
        finalBufferSize,
        buffer,
    });
    const data = Buffer.from((0, borsh_1.serialize)(serialisation_1.GOVERNANCE_INSTRUCTION_SCHEMA_V3, args));
    const proposalTransactionBufferAddress = (0, accounts_1.getProposalTransactionBufferAddress)(programId, proposal, payer, bufferIndex);
    const keys = [
        { pubkey: governance, isWritable: false, isSigner: false },
        { pubkey: proposal, isWritable: true, isSigner: false },
        { pubkey: tokenOwnerRecord, isWritable: false, isSigner: false },
        { pubkey: governanceAuthority, isWritable: false, isSigner: true },
        { pubkey: proposalTransactionBufferAddress, isWritable: true, isSigner: false },
        { pubkey: payer, isWritable: true, isSigner: true },
        { pubkey: tools_1.SYSTEM_PROGRAM_ID, isWritable: false, isSigner: false },
        { pubkey: web3_js_1.SYSVAR_RENT_PUBKEY, isWritable: false, isSigner: false },
    ];
    instructions.push(new web3_js_1.TransactionInstruction({ keys, programId, data }));
    return proposalTransactionBufferAddress;
};
exports.withCreateTransactionBuffer = withCreateTransactionBuffer;
//# sourceMappingURL=withCreateTransactionBuffer.js.map