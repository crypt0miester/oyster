"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withPostChatMessage = withPostChatMessage;
const web3_js_1 = require("@solana/web3.js");
const serialisation_1 = require("./serialisation");
const borsh_1 = require("borsh");
const instructions_1 = require("./instructions");
const runtime_1 = require("../tools/sdk/runtime");
const withRealmConfigPluginAccounts_1 = require("../governance/withRealmConfigPluginAccounts");
async function withPostChatMessage(instructions, signers, chatProgramId, governanceProgramId, realm, governance, proposal, tokenOwnerRecord, governanceAuthority, payer, replyTo, body, voterWeightRecord) {
    const args = new instructions_1.PostChatMessageArgs({
        body,
    });
    const data = Buffer.from((0, borsh_1.serialize)(serialisation_1.GOVERNANCE_CHAT_SCHEMA, args));
    const chatMessage = new web3_js_1.Keypair();
    signers.push(chatMessage);
    const keys = [
        {
            pubkey: governanceProgramId,
            isWritable: false,
            isSigner: false,
        },
        {
            pubkey: realm,
            isWritable: false,
            isSigner: false,
        },
        {
            pubkey: governance,
            isWritable: false,
            isSigner: false,
        },
        {
            pubkey: proposal,
            isWritable: false,
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
            pubkey: chatMessage.publicKey,
            isWritable: true,
            isSigner: true,
        },
        {
            pubkey: payer,
            isWritable: false,
            isSigner: true,
        },
        {
            pubkey: runtime_1.SYSTEM_PROGRAM_ID,
            isWritable: false,
            isSigner: false,
        },
    ];
    if (replyTo) {
        keys.push({
            pubkey: replyTo,
            isWritable: false,
            isSigner: false,
        });
    }
    await (0, withRealmConfigPluginAccounts_1.withRealmConfigPluginAccounts)(keys, governanceProgramId, realm, voterWeightRecord);
    instructions.push(new web3_js_1.TransactionInstruction({
        keys,
        programId: chatProgramId,
        data,
    }));
    return chatMessage.publicKey;
}
//# sourceMappingURL=withPostChatMessage.js.map