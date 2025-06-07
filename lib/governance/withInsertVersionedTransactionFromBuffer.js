"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withInsertVersionedTransactionFromBuffer = void 0;
const web3_js_1 = require("@solana/web3.js");
const serialisation_1 = require("./serialisation");
const borsh_1 = require("borsh");
const instructions_1 = require("./instructions");
const accounts_1 = require("./accounts");
const tools_1 = require("../tools");
const withInsertVersionedTransactionFromBuffer = (instructions, programId, governance, proposal, tokenOwnerRecord, governanceAuthority, payer, optionIndex, ephemeralSigners, transactionIndex, bufferIndex) => {
    const args = new instructions_1.InsertVersionedTransactionFromBufferArgs({
        optionIndex,
        ephemeralSigners,
        transactionIndex,
        bufferIndex,
    });
    const data = Buffer.from((0, borsh_1.serialize)(serialisation_1.GOVERNANCE_INSTRUCTION_SCHEMA_V3, args));
    const proposalVersionedTxAddress = (0, accounts_1.getProposalVersionedTransactionAddress)(programId, proposal, optionIndex, transactionIndex);
    const proposalTransactionBufferAddress = (0, accounts_1.getProposalTransactionBufferAddress)(programId, proposal, payer, bufferIndex);
    const keys = [
        { pubkey: governance, isWritable: false, isSigner: false },
        { pubkey: proposal, isWritable: true, isSigner: false },
        { pubkey: tokenOwnerRecord, isWritable: false, isSigner: false },
        { pubkey: governanceAuthority, isWritable: false, isSigner: true },
        { pubkey: proposalVersionedTxAddress, isWritable: true, isSigner: false },
        { pubkey: proposalTransactionBufferAddress, isWritable: true, isSigner: false },
        { pubkey: payer, isWritable: true, isSigner: true },
        { pubkey: tools_1.SYSTEM_PROGRAM_ID, isWritable: false, isSigner: false },
        { pubkey: web3_js_1.SYSVAR_RENT_PUBKEY, isWritable: false, isSigner: false },
    ];
    instructions.push(new web3_js_1.TransactionInstruction({ keys, programId, data }));
    return proposalVersionedTxAddress;
};
exports.withInsertVersionedTransactionFromBuffer = withInsertVersionedTransactionFromBuffer;
//# sourceMappingURL=withInsertVersionedTransactionFromBuffer.js.map