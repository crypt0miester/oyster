"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withCreateMintGovernance = void 0;
const web3_js_1 = require("@solana/web3.js");
const serialisation_1 = require("./serialisation");
const borsh_1 = require("borsh");
const instructions_1 = require("./instructions");
const splToken_1 = require("../tools/sdk/splToken");
const runtime_1 = require("../tools/sdk/runtime");
const withRealmConfigPluginAccounts_1 = require("./withRealmConfigPluginAccounts");
const constants_1 = require("../registry/constants");
/** @deprecated */
const withCreateMintGovernance = async (instructions, programId, programVersion, realm, governedMint, config, transferMintAuthorities, mintAuthority, tokenOwnerRecord, payer, governanceAuthority, voterWeightRecord, tokenProgram = splToken_1.TOKEN_PROGRAM_ID) => {
    const args = new instructions_1.CreateMintGovernanceArgs({
        config,
        transferMintAuthorities: transferMintAuthorities,
    });
    const data = Buffer.from((0, borsh_1.serialize)((0, serialisation_1.getGovernanceInstructionSchema)(programVersion), args));
    const [governanceAddress] = await web3_js_1.PublicKey.findProgramAddress([Buffer.from("mint-governance"), realm.toBuffer(), governedMint.toBuffer()], programId);
    const keys = [
        {
            pubkey: realm, // 0
            isWritable: false,
            isSigner: false,
        },
        {
            pubkey: governanceAddress, // 1
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: governedMint, // 2
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: mintAuthority, // 3
            isWritable: false,
            isSigner: true,
        },
        {
            pubkey: tokenOwnerRecord, // 4
            isWritable: false,
            isSigner: false,
        },
        {
            pubkey: payer, // 5
            isWritable: true,
            isSigner: true,
        },
        {
            pubkey: tokenProgram, // 6
            isWritable: false,
            isSigner: false,
        },
        {
            pubkey: runtime_1.SYSTEM_PROGRAM_ID, // 7
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
    keys.push({
        pubkey: governanceAuthority,
        isWritable: false,
        isSigner: true,
    });
    await (0, withRealmConfigPluginAccounts_1.withRealmConfigPluginAccounts)(keys, programId, realm, voterWeightRecord);
    instructions.push(new web3_js_1.TransactionInstruction({
        keys,
        programId,
        data,
    }));
    return governanceAddress;
};
exports.withCreateMintGovernance = withCreateMintGovernance;
//# sourceMappingURL=withCreateMintGovernance.js.map