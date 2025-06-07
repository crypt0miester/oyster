"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withCreateProgramGovernance = void 0;
const web3_js_1 = require("@solana/web3.js");
const serialisation_1 = require("./serialisation");
const borsh_1 = require("borsh");
const instructions_1 = require("./instructions");
const runtime_1 = require("../tools/sdk/runtime");
const bpfUpgradeableLoader_1 = require("../tools/sdk/bpfUpgradeableLoader");
const withRealmConfigPluginAccounts_1 = require("./withRealmConfigPluginAccounts");
const constants_1 = require("../registry/constants");
/** @deprecated */
const withCreateProgramGovernance = async (instructions, programId, programVersion, realm, governedProgram, config, transferUpgradeAuthority, programUpgradeAuthority, tokenOwnerRecord, payer, governanceAuthority, voterWeightRecord) => {
    const args = new instructions_1.CreateProgramGovernanceArgs({
        config,
        transferUpgradeAuthority,
    });
    const data = Buffer.from((0, borsh_1.serialize)((0, serialisation_1.getGovernanceInstructionSchema)(programVersion), args));
    const [governanceAddress] = await web3_js_1.PublicKey.findProgramAddress([Buffer.from("program-governance"), realm.toBuffer(), governedProgram.toBuffer()], programId);
    const [programDataAddress] = await web3_js_1.PublicKey.findProgramAddress([governedProgram.toBuffer()], bpfUpgradeableLoader_1.BPF_UPGRADE_LOADER_ID);
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
            pubkey: governedProgram,
            isWritable: false,
            isSigner: false,
        },
        {
            pubkey: programDataAddress,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: programUpgradeAuthority,
            isWritable: false,
            isSigner: true,
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
            pubkey: bpfUpgradeableLoader_1.BPF_UPGRADE_LOADER_ID,
            isWritable: false,
            isSigner: false,
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
exports.withCreateProgramGovernance = withCreateProgramGovernance;
//# sourceMappingURL=withCreateProgramGovernance.js.map