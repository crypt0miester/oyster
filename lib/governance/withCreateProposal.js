"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withCreateProposal = void 0;
const web3_js_1 = require("@solana/web3.js");
const serialisation_1 = require("./serialisation");
const borsh_1 = require("borsh");
const instructions_1 = require("./instructions");
const accounts_1 = require("./accounts");
const constants_1 = require("../registry/constants");
const runtime_1 = require("../tools/sdk/runtime");
const withRealmConfigPluginAccounts_1 = require("./withRealmConfigPluginAccounts");
const withCreateProposal = async (instructions, programId, programVersion, realm, governance, tokenOwnerRecord, name, descriptionLink, governingTokenMint, governanceAuthority, 
// Proposal index is not used from V3
proposalIndex, voteType, options, useDenyOption, payer, voterWeightRecord, proposalSeed) => {
    const optionalProposalSeed = proposalSeed !== null && proposalSeed !== void 0 ? proposalSeed : new web3_js_1.Keypair().publicKey;
    const args = new instructions_1.CreateProposalArgs({
        name,
        descriptionLink,
        governingTokenMint,
        voteType,
        options,
        useDenyOption,
        proposalSeed: optionalProposalSeed,
    });
    const data = Buffer.from((0, borsh_1.serialize)((0, serialisation_1.getGovernanceInstructionSchema)(programVersion), args));
    let proposalSeedBuffer = optionalProposalSeed.toBuffer();
    if (programVersion <= constants_1.PROGRAM_VERSION_V2) {
        if (proposalIndex === undefined) {
            throw new Error(`proposalIndex is required for version: ${programVersion}`);
        }
        proposalSeedBuffer = Buffer.alloc(4);
        proposalSeedBuffer.writeInt32LE(proposalIndex, 0);
    }
    const [proposalAddress] = await web3_js_1.PublicKey.findProgramAddress([Buffer.from(accounts_1.GOVERNANCE_PROGRAM_SEED), governance.toBuffer(), governingTokenMint.toBuffer(), proposalSeedBuffer], programId);
    const keys = [
        {
            pubkey: realm,
            isWritable: false,
            isSigner: false,
        },
        {
            pubkey: proposalAddress,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: governance,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: tokenOwnerRecord,
            isWritable: true,
            isSigner: false,
        },
        ...(programVersion > constants_1.PROGRAM_VERSION_V1
            ? [
                {
                    pubkey: governingTokenMint,
                    isWritable: false,
                    isSigner: false,
                },
            ]
            : []),
        {
            pubkey: governanceAuthority,
            isWritable: false,
            isSigner: true,
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
        keys.push({
            pubkey: web3_js_1.SYSVAR_CLOCK_PUBKEY,
            isWritable: false,
            isSigner: false,
        });
    }
    await (0, withRealmConfigPluginAccounts_1.withRealmConfigPluginAccounts)(keys, programId, realm, voterWeightRecord);
    if (programVersion >= constants_1.PROGRAM_VERSION_V3) {
        const proposalDepositAddress = await (0, accounts_1.getProposalDepositAddress)(programId, proposalAddress, payer);
        keys.push({
            pubkey: proposalDepositAddress,
            isWritable: true,
            isSigner: false,
        });
    }
    instructions.push(new web3_js_1.TransactionInstruction({
        keys,
        programId,
        data,
    }));
    return proposalAddress;
};
exports.withCreateProposal = withCreateProposal;
//# sourceMappingURL=withCreateProposal.js.map