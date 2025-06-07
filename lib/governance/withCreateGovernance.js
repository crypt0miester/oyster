"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withCreateGovernance = void 0;
const web3_js_1 = require("@solana/web3.js");
const serialisation_1 = require("./serialisation");
const borsh_1 = require("borsh");
const instructions_1 = require("./instructions");
const runtime_1 = require("../tools/sdk/runtime");
const withRealmConfigPluginAccounts_1 = require("./withRealmConfigPluginAccounts");
const constants_1 = require("../registry/constants");
const withCreateGovernance = async (instructions, programId, programVersion, realm, governedAccount, config, tokenOwnerRecord, payer, createAuthority, voterWeightRecord) => {
    const args = new instructions_1.CreateGovernanceArgs({ config });
    if (args.config.baseVotingTime < 3600) {
        throw new Error("baseVotingTime should be at least 1 hour");
    }
    const data = Buffer.from((0, borsh_1.serialize)((0, serialisation_1.getGovernanceInstructionSchema)(programVersion), args));
    const governedAccountFixed = governedAccount !== null && governedAccount !== void 0 ? governedAccount : new web3_js_1.Keypair().publicKey;
    const [governanceAddress] = await web3_js_1.PublicKey.findProgramAddress([Buffer.from("account-governance"), realm.toBuffer(), governedAccountFixed.toBuffer()], programId);
    const keys = [
        {
            pubkey: realm,
            isWritable: false,
            isSigner: false,
        },
        {
            pubkey: governanceAddress,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: governedAccountFixed,
            isWritable: false,
            isSigner: false,
        },
        {
            pubkey: tokenOwnerRecord,
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
        pubkey: createAuthority,
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
exports.withCreateGovernance = withCreateGovernance;
//# sourceMappingURL=withCreateGovernance.js.map