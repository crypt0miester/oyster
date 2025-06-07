"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withDepositGoverningTokens = void 0;
const web3_js_1 = require("@solana/web3.js");
const serialisation_1 = require("./serialisation");
const borsh_1 = require("borsh");
const instructions_1 = require("./instructions");
const accounts_1 = require("./accounts");
const runtime_1 = require("../tools/sdk/runtime");
const splToken_1 = require("../tools/sdk/splToken");
const constants_1 = require("../registry/constants");
const tools_1 = require("./tools");
const withDepositGoverningTokens = async (instructions, programId, programVersion, realm, governingTokenSource, governingTokenMint, governingTokenOwner, governingTokenSourceAuthority, payer, amount, governingTokenOwnerIsSigner, tokenProgram = splToken_1.TOKEN_PROGRAM_ID) => {
    const args = new instructions_1.DepositGoverningTokensArgs({ amount });
    const data = Buffer.from((0, borsh_1.serialize)((0, serialisation_1.getGovernanceInstructionSchema)(programVersion), args));
    const tokenOwnerRecordAddress = await (0, accounts_1.getTokenOwnerRecordAddress)(programId, realm, governingTokenMint, governingTokenOwner);
    const governingTokenOwnerIsSignerFixed = governingTokenOwnerIsSigner !== null && governingTokenOwnerIsSigner !== void 0 ? governingTokenOwnerIsSigner : 
    // If we are minting the tokens directly into the DAO then governingTokenOwner doesn't have to sign the tx
    !governingTokenSource.equals(governingTokenMint);
    const [governingTokenHoldingAddress] = await web3_js_1.PublicKey.findProgramAddress([Buffer.from(accounts_1.GOVERNANCE_PROGRAM_SEED), realm.toBuffer(), governingTokenMint.toBuffer()], programId);
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
            pubkey: governingTokenSource,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: governingTokenOwner,
            isWritable: false,
            isSigner: governingTokenOwnerIsSignerFixed,
        },
        {
            pubkey: governingTokenSourceAuthority,
            isWritable: false,
            isSigner: true,
        },
        {
            pubkey: tokenOwnerRecordAddress,
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
            isWritable: false,
            isSigner: false,
        },
        {
            pubkey: tokenProgram,
            isWritable: false,
            isSigner: false,
        },
    ];
    if (programVersion === constants_1.PROGRAM_VERSION_V1) {
        keys.push({
            pubkey: web3_js_1.SYSVAR_RENT_PUBKEY,
            isWritable: false,
            isSigner: false,
        });
    }
    await (0, tools_1.withV3RealmConfigAccount)(keys, programId, programVersion, realm);
    instructions.push(new web3_js_1.TransactionInstruction({
        keys,
        programId,
        data,
    }));
    return tokenOwnerRecordAddress;
};
exports.withDepositGoverningTokens = withDepositGoverningTokens;
//# sourceMappingURL=withDepositGoverningTokens.js.map