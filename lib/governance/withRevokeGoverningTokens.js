"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withRevokeGoverningTokens = void 0;
const web3_js_1 = require("@solana/web3.js");
const serialisation_1 = require("./serialisation");
const borsh_1 = require("borsh");
const instructions_1 = require("./instructions");
const accounts_1 = require("./accounts");
const splToken_1 = require("../tools/sdk/splToken");
const withRevokeGoverningTokens = async (instructions, programId, programVersion, realm, governingTokenOwner, governingTokenMint, revokeAuthority, amount, tokenProgram = splToken_1.TOKEN_PROGRAM_ID) => {
    const args = new instructions_1.RevokeGoverningTokensArgs({ amount });
    const data = Buffer.from((0, borsh_1.serialize)((0, serialisation_1.getGovernanceInstructionSchema)(programVersion), args));
    const tokenOwnerRecordAddress = await (0, accounts_1.getTokenOwnerRecordAddress)(programId, realm, governingTokenMint, governingTokenOwner);
    const governingTokenHoldingAddress = await (0, accounts_1.getGoverningTokenHoldingAddress)(programId, realm, governingTokenMint);
    const realmConfigAddress = await (0, accounts_1.getRealmConfigAddress)(programId, realm);
    const keys = [
        {
            pubkey: realm,
            isWritable: false,
            isSigner: false,
        },
        {
            pubkey: governingTokenHoldingAddress,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: tokenOwnerRecordAddress,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: governingTokenMint,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: revokeAuthority,
            isWritable: false,
            isSigner: true,
        },
        {
            pubkey: realmConfigAddress,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: tokenProgram,
            isWritable: false,
            isSigner: false,
        },
    ];
    instructions.push(new web3_js_1.TransactionInstruction({
        keys,
        programId,
        data,
    }));
};
exports.withRevokeGoverningTokens = withRevokeGoverningTokens;
//# sourceMappingURL=withRevokeGoverningTokens.js.map