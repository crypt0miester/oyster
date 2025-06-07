"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withCreateTokenOwnerRecord = void 0;
const web3_js_1 = require("@solana/web3.js");
const serialisation_1 = require("./serialisation");
const borsh_1 = require("borsh");
const instructions_1 = require("./instructions");
const accounts_1 = require("./accounts");
const runtime_1 = require("../tools/sdk/runtime");
const withCreateTokenOwnerRecord = async (instructions, programId, programVersion, realm, governingTokenOwner, governingTokenMint, payer) => {
    const args = new instructions_1.CreateTokenOwnerRecordArgs();
    const data = Buffer.from((0, borsh_1.serialize)((0, serialisation_1.getGovernanceInstructionSchema)(programVersion), args));
    const tokenOwnerRecordAddress = await (0, accounts_1.getTokenOwnerRecordAddress)(programId, realm, governingTokenMint, governingTokenOwner);
    const keys = [
        {
            pubkey: realm,
            isWritable: false,
            isSigner: false,
        },
        {
            pubkey: governingTokenOwner,
            isWritable: false,
            isSigner: false,
        },
        {
            pubkey: tokenOwnerRecordAddress,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: governingTokenMint,
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
    instructions.push(new web3_js_1.TransactionInstruction({
        keys,
        programId,
        data,
    }));
    return tokenOwnerRecordAddress;
};
exports.withCreateTokenOwnerRecord = withCreateTokenOwnerRecord;
//# sourceMappingURL=withCreateTokenOwnerRecord.js.map