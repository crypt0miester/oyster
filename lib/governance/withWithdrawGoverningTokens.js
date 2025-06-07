"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withWithdrawGoverningTokens = void 0;
const web3_js_1 = require("@solana/web3.js");
const serialisation_1 = require("./serialisation");
const borsh_1 = require("borsh");
const instructions_1 = require("./instructions");
const accounts_1 = require("./accounts");
const splToken_1 = require("../tools/sdk/splToken");
const tools_1 = require("./tools");
const withWithdrawGoverningTokens = async (instructions, programId, programVersion, realm, governingTokenDestination, governingTokenMint, governingTokenOwner, tokenProgram = splToken_1.TOKEN_PROGRAM_ID) => {
    const args = new instructions_1.WithdrawGoverningTokensArgs();
    const data = Buffer.from((0, borsh_1.serialize)((0, serialisation_1.getGovernanceInstructionSchema)(programVersion), args));
    const [tokenOwnerRecordAddress] = await web3_js_1.PublicKey.findProgramAddress([
        Buffer.from(accounts_1.GOVERNANCE_PROGRAM_SEED),
        realm.toBuffer(),
        governingTokenMint.toBuffer(),
        governingTokenOwner.toBuffer(),
    ], programId);
    const [governingTokenHoldingAddress] = await web3_js_1.PublicKey.findProgramAddress([Buffer.from(accounts_1.GOVERNANCE_PROGRAM_SEED), realm.toBuffer(), governingTokenMint.toBuffer()], programId);
    const keys = [
        { pubkey: realm, isWritable: false, isSigner: false },
        {
            pubkey: governingTokenHoldingAddress,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: governingTokenDestination,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: governingTokenOwner,
            isWritable: false,
            isSigner: true,
        },
        {
            pubkey: tokenOwnerRecordAddress,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: tokenProgram,
            isWritable: false,
            isSigner: false,
        },
    ];
    await (0, tools_1.withV3RealmConfigAccount)(keys, programId, programVersion, realm);
    instructions.push(new web3_js_1.TransactionInstruction({
        keys,
        programId,
        data,
    }));
};
exports.withWithdrawGoverningTokens = withWithdrawGoverningTokens;
//# sourceMappingURL=withWithdrawGoverningTokens.js.map