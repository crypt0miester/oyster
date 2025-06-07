"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withCloseTransactionBuffer = void 0;
const web3_js_1 = require("@solana/web3.js");
const serialisation_1 = require("./serialisation");
const borsh_1 = require("borsh");
const instructions_1 = require("./instructions");
const accounts_1 = require("./accounts");
const withCloseTransactionBuffer = (instructions, programId, governance, proposal, tokenOwnerRecord, governanceAuthority, beneficiary, bufferIndex) => {
    const args = new instructions_1.CloseTransactionBufferArgs({ bufferIndex });
    const data = Buffer.from((0, borsh_1.serialize)(serialisation_1.GOVERNANCE_INSTRUCTION_SCHEMA_V3, args));
    const proposalTransactionBufferAddress = (0, accounts_1.getProposalTransactionBufferAddress)(programId, proposal, beneficiary, bufferIndex);
    const keys = [
        { pubkey: governance, isWritable: false, isSigner: false },
        { pubkey: proposal, isWritable: true, isSigner: false },
        { pubkey: tokenOwnerRecord, isWritable: false, isSigner: false },
        { pubkey: governanceAuthority, isWritable: false, isSigner: true },
        { pubkey: proposalTransactionBufferAddress, isWritable: true, isSigner: false },
        { pubkey: beneficiary, isWritable: true, isSigner: true },
    ];
    instructions.push(new web3_js_1.TransactionInstruction({ keys, programId, data }));
    return proposalTransactionBufferAddress;
};
exports.withCloseTransactionBuffer = withCloseTransactionBuffer;
//# sourceMappingURL=withCloseTransactionBuffer.js.map