"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovernanceAccountParser = exports.GOVERNANCE_ACCOUNT_SCHEMA_V2 = exports.GOVERNANCE_ACCOUNT_SCHEMA_V1 = exports.GOVERNANCE_INSTRUCTION_SCHEMA_V3 = exports.GOVERNANCE_INSTRUCTION_SCHEMA_V2 = exports.GOVERNANCE_INSTRUCTION_SCHEMA_V1 = exports.createInstructionData = exports.serializeInstructionToBase64 = void 0;
exports.getGovernanceInstructionSchema = getGovernanceInstructionSchema;
exports.getGovernanceAccountSchema = getGovernanceAccountSchema;
exports.getGovernanceSchemaForAccount = getGovernanceSchemaForAccount;
exports.getInstructionDataFromBase64 = getInstructionDataFromBase64;
exports.getVersionedTransactionProposalData = getVersionedTransactionProposalData;
exports.getAccountMetasAndLookupTableAccountsForExecuteTransaction = getAccountMetasAndLookupTableAccountsForExecuteTransaction;
const borsh_1 = require("borsh");
const instructions_1 = require("./instructions");
const accounts_1 = require("./accounts");
const borsh_2 = require("borsh");
const serialisation_1 = require("../core/serialisation");
const constants_1 = require("../registry/constants");
const borsh_3 = require("../tools/borsh");
const tools_1 = require("../tools");
// ------------ VoteType ------------
borsh_1.BinaryReader.prototype.readVoteType = function () {
    const reader = this;
    const value = reader.buf.readUInt8(reader.offset);
    reader.offset += 1;
    if (value === accounts_1.VoteTypeKind.SingleChoice) {
        return accounts_1.VoteType.SINGLE_CHOICE;
    }
    const choiceType = reader.buf.readUInt8(reader.offset);
    reader.offset += 1;
    const minVoterOptions = reader.buf.readUInt8(reader.offset);
    reader.offset += 1;
    const maxVoterOptions = reader.buf.readUInt8(reader.offset);
    reader.offset += 1;
    const maxWinningOptions = reader.buf.readUInt8(reader.offset);
    reader.offset += 1;
    return accounts_1.VoteType.MULTI_CHOICE(choiceType, minVoterOptions, maxVoterOptions, maxWinningOptions);
};
borsh_1.BinaryWriter.prototype.writeVoteType = function (value) {
    const writer = this;
    writer.maybeResize();
    writer.buf.writeUInt8(value.type, writer.length);
    writer.length += 1;
    if (value.type === accounts_1.VoteTypeKind.MultiChoice) {
        writer.buf.writeUInt8(value.choiceType, writer.length);
        writer.length += 1;
        writer.buf.writeUInt8(value.minVoterOptions, writer.length);
        writer.length += 1;
        writer.buf.writeUInt8(value.maxVoterOptions, writer.length);
        writer.length += 1;
        writer.buf.writeUInt8(value.maxWinningOptions, writer.length);
        writer.length += 1;
    }
};
// ------------ Vote ------------
borsh_1.BinaryReader.prototype.readVote = function () {
    const reader = this;
    const value = reader.buf.readUInt8(reader.offset);
    reader.offset += 1;
    if (value === instructions_1.VoteKind.Deny) {
        return new instructions_1.Vote({
            voteType: value,
            approveChoices: undefined,
            deny: true,
            veto: false,
        });
    }
    if (value === instructions_1.VoteKind.Veto) {
        return new instructions_1.Vote({
            voteType: value,
            approveChoices: undefined,
            deny: false,
            veto: true,
        });
    }
    const approveChoices = [];
    reader.readArray(() => {
        const rank = reader.buf.readUInt8(reader.offset);
        reader.offset += 1;
        const weightPercentage = reader.buf.readUInt8(reader.offset);
        reader.offset += 1;
        approveChoices.push(new instructions_1.VoteChoice({ rank: rank, weightPercentage: weightPercentage }));
    });
    return new instructions_1.Vote({
        voteType: value,
        approveChoices: approveChoices,
        deny: undefined,
        veto: undefined,
    });
};
borsh_1.BinaryWriter.prototype.writeVote = function (value) {
    const writer = this;
    writer.maybeResize();
    writer.buf.writeUInt8(value.voteType, writer.length);
    writer.length += 1;
    if (value.voteType === instructions_1.VoteKind.Approve) {
        writer.writeArray(value.approveChoices, (item) => {
            writer.buf.writeUInt8(item.rank, writer.length);
            writer.length += 1;
            writer.buf.writeUInt8(item.weightPercentage, writer.length);
            writer.length += 1;
        });
    }
};
// ------------ VoteThreshold ------------
borsh_1.BinaryReader.prototype.readVoteThreshold = function () {
    const reader = this;
    // Read VoteThreshold and advance the reader by 1
    const type = reader.buf.readUInt8(reader.offset);
    reader.offset += 1;
    // Read VoteThresholds with u8 value
    if (type === accounts_1.VoteThresholdType.YesVotePercentage || type === accounts_1.VoteThresholdType.QuorumPercentage) {
        const percentage = reader.buf.readUInt8(reader.offset);
        reader.offset += 1;
        return new accounts_1.VoteThreshold({ type: type, value: percentage });
    }
    // Read VoteThresholds without value
    if (type === accounts_1.VoteThresholdType.Disabled) {
        return new accounts_1.VoteThreshold({ type: type, value: undefined });
    }
    throw new Error(`VoteThresholdType ${type} is not supported`);
};
borsh_1.BinaryWriter.prototype.writeVoteThreshold = function (value) {
    const writer = this;
    writer.maybeResize();
    writer.buf.writeUInt8(value.type, writer.length);
    writer.length += 1;
    // Write value for VoteThresholds with u8 value
    if (value.type === accounts_1.VoteThresholdType.YesVotePercentage || value.type === accounts_1.VoteThresholdType.QuorumPercentage) {
        writer.buf.writeUInt8(value.value, writer.length);
        writer.length += 1;
    }
};
// Serializes sdk instruction into InstructionData and encodes it as base64 which then can be entered into the UI form
const serializeInstructionToBase64 = (instruction) => {
    const data = (0, exports.createInstructionData)(instruction);
    return Buffer.from((0, borsh_2.serialize)(exports.GOVERNANCE_INSTRUCTION_SCHEMA_V1, data)).toString("base64");
};
exports.serializeInstructionToBase64 = serializeInstructionToBase64;
// Converts TransactionInstruction to InstructionData format
const createInstructionData = (instruction) => {
    return new accounts_1.InstructionData({
        programId: instruction.programId,
        data: instruction.data,
        accounts: instruction.keys.map((k) => new accounts_1.AccountMetaData({
            pubkey: k.pubkey,
            isSigner: k.isSigner,
            isWritable: k.isWritable,
        })),
    });
};
exports.createInstructionData = createInstructionData;
// Instruction schemas
exports.GOVERNANCE_INSTRUCTION_SCHEMA_V1 = createGovernanceInstructionSchema(1);
exports.GOVERNANCE_INSTRUCTION_SCHEMA_V2 = createGovernanceInstructionSchema(2);
exports.GOVERNANCE_INSTRUCTION_SCHEMA_V3 = createGovernanceInstructionSchema(3);
function getGovernanceInstructionSchema(programVersion) {
    switch (programVersion) {
        case 1:
            return exports.GOVERNANCE_INSTRUCTION_SCHEMA_V1;
        case 2:
            return exports.GOVERNANCE_INSTRUCTION_SCHEMA_V2;
        case 3:
            return exports.GOVERNANCE_INSTRUCTION_SCHEMA_V3;
        default:
            throw new Error(`Account schema for program version: ${programVersion} doesn't exist`);
    }
}
/// Creates serialisation schema for spl-gov structs used for instructions and accounts
function createGovernanceStructSchema(programVersion, accountVersion) {
    return new Map([
        [
            instructions_1.VoteChoice,
            {
                kind: "struct",
                fields: [
                    ["rank", "u8"],
                    ["weightPercentage", "u8"],
                ],
            },
        ],
        [
            accounts_1.InstructionData,
            {
                kind: "struct",
                fields: [
                    ["programId", "pubkey"],
                    ["accounts", [accounts_1.AccountMetaData]],
                    ["data", ["u8"]],
                ],
            },
        ],
        [
            accounts_1.AccountMetaData,
            {
                kind: "struct",
                fields: [
                    ["pubkey", "pubkey"],
                    ["isSigner", "u8"],
                    ["isWritable", "u8"],
                ],
            },
        ],
        [
            accounts_1.MintMaxVoteWeightSource,
            {
                kind: "struct",
                fields: [
                    ["type", "u8"],
                    ["value", "u64"],
                ],
            },
        ],
        [
            accounts_1.GovernanceConfig,
            {
                kind: "struct",
                fields: [
                    ["communityVoteThreshold", "VoteThreshold"],
                    ["minCommunityTokensToCreateProposal", "u64"],
                    ["minInstructionHoldUpTime", "u32"],
                    ["baseVotingTime", "u32"],
                    ["communityVoteTipping", "u8"],
                    ["councilVoteThreshold", "VoteThreshold"],
                    ["councilVetoVoteThreshold", "VoteThreshold"],
                    ["minCouncilTokensToCreateProposal", "u64"],
                    // Pass the extra fields to instruction if programVersion >= 3
                    // The additional fields can't be passed to instructions for programVersion <= 2  because they were added in V3
                    // and would override the transferAuthority param which follows it
                    ...((programVersion && programVersion >= constants_1.PROGRAM_VERSION_V3) ||
                        // The account layout is backward compatible and we can read the extra fields for accountVersion >= 2
                        (accountVersion && accountVersion >= constants_1.ACCOUNT_VERSION_V2)
                        ? [
                            ["councilVoteTipping", "u8"],
                            ["communityVetoVoteThreshold", "VoteThreshold"],
                            ["votingCoolOffTime", "u32"],
                            ["depositExemptProposalCount", "u8"],
                        ]
                        : []),
                ],
            },
        ],
    ]);
}
/// Creates serialisation schema for spl-gov instructions for the given program version number
function createGovernanceInstructionSchema(programVersion) {
    return new Map([
        [
            accounts_1.RealmConfigArgs,
            {
                kind: "struct",
                fields: [
                    ["useCouncilMint", "u8"],
                    ["minCommunityTokensToCreateGovernance", "u64"],
                    ["communityMintMaxVoteWeightSource", accounts_1.MintMaxVoteWeightSource],
                    // V1 of the program used restrictive instruction deserialisation which didn't allow additional data
                    ...(programVersion === constants_1.PROGRAM_VERSION_V2
                        ? [
                            ["useCommunityVoterWeightAddin", "u8"],
                            ["useMaxCommunityVoterWeightAddin", "u8"],
                        ]
                        : programVersion >= constants_1.PROGRAM_VERSION_V3
                            ? [
                                ["communityTokenConfigArgs", accounts_1.GoverningTokenConfigArgs],
                                ["councilTokenConfigArgs", accounts_1.GoverningTokenConfigArgs],
                            ]
                            : []),
                ],
            },
        ],
        [
            instructions_1.CreateRealmArgs,
            {
                kind: "struct",
                fields: [
                    ["instruction", "u8"],
                    ["name", "string"],
                    ["configArgs", accounts_1.RealmConfigArgs],
                ],
            },
        ],
        [
            accounts_1.GoverningTokenConfigArgs,
            {
                kind: "struct",
                fields: [
                    ["useVoterWeightAddin", "u8"],
                    ["useMaxVoterWeightAddin", "u8"],
                    ["tokenType", "u8"],
                ],
            },
        ],
        [
            instructions_1.DepositGoverningTokensArgs,
            {
                kind: "struct",
                fields: [
                    ["instruction", "u8"],
                    // V1 of the program used restrictive instruction deserialisation which didn't allow additional data
                    programVersion >= constants_1.PROGRAM_VERSION_V2 ? ["amount", "u64"] : undefined,
                ].filter(Boolean),
            },
        ],
        [
            instructions_1.RevokeGoverningTokensArgs,
            {
                kind: "struct",
                fields: [
                    ["instruction", "u8"],
                    ["amount", "u64"],
                ],
            },
        ],
        [
            instructions_1.WithdrawGoverningTokensArgs,
            {
                kind: "struct",
                fields: [["instruction", "u8"]],
            },
        ],
        [
            instructions_1.SetGovernanceDelegateArgs,
            {
                kind: "struct",
                fields: [
                    ["instruction", "u8"],
                    ["newGovernanceDelegate", { kind: "option", type: "pubkey" }],
                ],
            },
        ],
        [
            instructions_1.CreateGovernanceArgs,
            {
                kind: "struct",
                fields: [
                    ["instruction", "u8"],
                    ["config", accounts_1.GovernanceConfig],
                ],
            },
        ],
        [
            instructions_1.CreateProgramGovernanceArgs,
            {
                kind: "struct",
                fields: [
                    ["instruction", "u8"],
                    ["config", accounts_1.GovernanceConfig],
                    ["transferUpgradeAuthority", "u8"],
                ],
            },
        ],
        [
            instructions_1.CreateMintGovernanceArgs,
            {
                kind: "struct",
                fields: [
                    ["instruction", "u8"],
                    ["config", accounts_1.GovernanceConfig],
                    ["transferMintAuthorities", "u8"],
                ],
            },
        ],
        [
            instructions_1.CreateTokenGovernanceArgs,
            {
                kind: "struct",
                fields: [
                    ["instruction", "u8"],
                    ["config", accounts_1.GovernanceConfig],
                    ["transferTokenOwner", "u8"],
                ],
            },
        ],
        [
            instructions_1.SetGovernanceConfigArgs,
            {
                kind: "struct",
                fields: [
                    ["instruction", "u8"],
                    ["config", accounts_1.GovernanceConfig],
                ],
            },
        ],
        [
            instructions_1.CreateProposalArgs,
            {
                kind: "struct",
                fields: [
                    ["instruction", "u8"],
                    ["name", "string"],
                    ["descriptionLink", "string"],
                    ...(programVersion === constants_1.PROGRAM_VERSION_V1
                        ? [["governingTokenMint", "pubkey"]]
                        : [
                            ["voteType", "voteType"],
                            ["options", ["string"]],
                            ["useDenyOption", "u8"],
                        ]),
                    programVersion >= constants_1.PROGRAM_VERSION_V3 ? ["proposalSeed", "pubkey"] : undefined,
                ].filter(Boolean),
            },
        ],
        [
            instructions_1.AddSignatoryArgs,
            {
                kind: "struct",
                fields: [
                    ["instruction", "u8"],
                    ["signatory", "pubkey"],
                ],
            },
        ],
        [
            instructions_1.SignOffProposalArgs,
            {
                kind: "struct",
                fields: [["instruction", "u8"]],
            },
        ],
        [
            instructions_1.CancelProposalArgs,
            {
                kind: "struct",
                fields: [["instruction", "u8"]],
            },
        ],
        [
            instructions_1.RelinquishVoteArgs,
            {
                kind: "struct",
                fields: [["instruction", "u8"]],
            },
        ],
        [
            instructions_1.FinalizeVoteArgs,
            {
                kind: "struct",
                fields: [["instruction", "u8"]],
            },
        ],
        [
            instructions_1.CastVoteArgs,
            {
                kind: "struct",
                fields: [["instruction", "u8"], programVersion === constants_1.PROGRAM_VERSION_V1 ? ["yesNoVote", "u8"] : ["vote", "vote"]],
            },
        ],
        [
            instructions_1.InsertTransactionArgs,
            {
                kind: "struct",
                fields: [
                    ["instruction", "u8"],
                    programVersion >= constants_1.PROGRAM_VERSION_V2 ? ["optionIndex", "u8"] : undefined,
                    ["index", "u16"],
                    ["holdUpTime", "u32"],
                    programVersion >= constants_1.PROGRAM_VERSION_V2
                        ? ["instructions", [accounts_1.InstructionData]]
                        : ["instructionData", accounts_1.InstructionData],
                ].filter(Boolean),
            },
        ],
        [
            instructions_1.RemoveTransactionArgs,
            {
                kind: "struct",
                fields: [["instruction", "u8"]],
            },
        ],
        [
            instructions_1.ExecuteTransactionArgs,
            {
                kind: "struct",
                fields: [["instruction", "u8"]],
            },
        ],
        [
            instructions_1.FlagTransactionErrorArgs,
            {
                kind: "struct",
                fields: [["instruction", "u8"]],
            },
        ],
        [
            instructions_1.SetRealmAuthorityArgs,
            {
                kind: "struct",
                fields: [
                    ["instruction", "u8"],
                    ...(programVersion === constants_1.PROGRAM_VERSION_V1
                        ? [["newRealmAuthority", { kind: "option", type: "pubkey" }]]
                        : [["action", "u8"]]),
                ],
            },
        ],
        [
            instructions_1.SetRealmConfigArgs,
            {
                kind: "struct",
                fields: [
                    ["instruction", "u8"],
                    ["configArgs", accounts_1.RealmConfigArgs],
                ],
            },
        ],
        [
            instructions_1.CreateTokenOwnerRecordArgs,
            {
                kind: "struct",
                fields: [["instruction", "u8"]],
            },
        ],
        [
            instructions_1.UpdateProgramMetadataArgs,
            {
                kind: "struct",
                fields: [["instruction", "u8"]],
            },
        ],
        [
            instructions_1.CreateNativeTreasuryArgs,
            {
                kind: "struct",
                fields: [["instruction", "u8"]],
            },
        ],
        [
            instructions_1.RefundProposalDepositArgs,
            {
                kind: "struct",
                fields: [["instruction", "u8"]],
            },
        ],
        [
            instructions_1.CreateTransactionBufferArgs,
            {
                kind: "struct",
                fields: [
                    ["instruction", "u8"],
                    ["bufferIndex", "u8"],
                    ["finalBufferHash", [32]], // 32-byte array
                    ["finalBufferSize", "u16"],
                    ["buffer", ["u8"]], // Vector of bytes
                ],
            },
        ],
        [
            instructions_1.ExtendTransactionBufferArgs,
            {
                kind: "struct",
                fields: [
                    ["instruction", "u8"],
                    ["bufferIndex", "u8"],
                    ["buffer", ["u8"]], // Vector of bytes
                ],
            },
        ],
        [
            instructions_1.CloseTransactionBufferArgs,
            {
                kind: "struct",
                fields: [
                    ["instruction", "u8"],
                    ["bufferIndex", "u8"],
                ],
            },
        ],
        [
            instructions_1.InsertVersionedTransactionFromBufferArgs,
            {
                kind: "struct",
                fields: [
                    ["instruction", "u8"],
                    ["optionIndex", "u8"],
                    ["ephemeralSigners", "u8"],
                    ["transactionIndex", "u16"],
                    ["bufferIndex", "u8"],
                ],
            },
        ],
        [
            instructions_1.InsertVersionedTransactionArgs,
            {
                kind: "struct",
                fields: [
                    ["instruction", "u8"],
                    ["optionIndex", "u8"],
                    ["ephemeralSigners", "u8"],
                    ["transactionIndex", "u16"],
                    ["transactionMessage", ["u8"]], // Vector of bytes
                ],
            },
        ],
        [
            instructions_1.ExecuteVersionedTransactionArgs,
            {
                kind: "struct",
                fields: [["instruction", "u8"]],
            },
        ],
        ...createGovernanceStructSchema(programVersion, undefined),
    ]);
}
// Accounts schemas
exports.GOVERNANCE_ACCOUNT_SCHEMA_V1 = createGovernanceAccountSchema(1);
exports.GOVERNANCE_ACCOUNT_SCHEMA_V2 = createGovernanceAccountSchema(2);
function getGovernanceAccountSchema(accountVersion) {
    switch (accountVersion) {
        case 1:
            return exports.GOVERNANCE_ACCOUNT_SCHEMA_V1;
        case 2:
            return exports.GOVERNANCE_ACCOUNT_SCHEMA_V2;
        default:
            throw new Error(`Account schema for account version: ${accountVersion} doesn't exist`);
    }
}
/// Creates serialisation schema for spl-gov accounts for the given account version number
function createGovernanceAccountSchema(accountVersion) {
    return new Map([
        [
            accounts_1.RealmConfig,
            {
                kind: "struct",
                fields: [
                    ["useCommunityVoterWeightAddin", "u8"],
                    ["useMaxCommunityVoterWeightAddin", "u8"],
                    ["reserved", [6]],
                    ["minCommunityTokensToCreateGovernance", "u64"],
                    ["communityMintMaxVoteWeightSource", accounts_1.MintMaxVoteWeightSource],
                    ["councilMint", { kind: "option", type: "pubkey" }],
                ],
            },
        ],
        [
            accounts_1.Realm,
            {
                kind: "struct",
                fields: [
                    ["accountType", "u8"],
                    ["communityMint", "pubkey"],
                    ["config", accounts_1.RealmConfig],
                    ["reserved", [6]],
                    ["votingProposalCount", "u16"],
                    ["authority", { kind: "option", type: "pubkey" }],
                    ["name", "string"],
                ],
            },
        ],
        [
            accounts_1.RealmConfigAccount,
            {
                kind: "struct",
                fields: [
                    ["accountType", "u8"],
                    ["realm", "pubkey"],
                    ["communityTokenConfig", accounts_1.GoverningTokenConfig],
                    ["councilTokenConfig", accounts_1.GoverningTokenConfig],
                    ["reserved", [110]],
                ],
            },
        ],
        [
            accounts_1.GoverningTokenConfig,
            {
                kind: "struct",
                fields: [
                    ["voterWeightAddin", { kind: "option", type: "pubkey" }],
                    ["maxVoterWeightAddin", { kind: "option", type: "pubkey" }],
                    ["tokenType", "u8"],
                    ["reserved", [8]],
                ],
            },
        ],
        [
            accounts_1.Governance,
            {
                kind: "struct",
                fields: [
                    ["accountType", "u8"],
                    ["realm", "pubkey"],
                    ["governedAccount", "pubkey"],
                    ["proposalCount", "u32"],
                    ["config", accounts_1.GovernanceConfig],
                    ...(accountVersion >= constants_1.ACCOUNT_VERSION_V2
                        ? [
                            ["reserved", [120]],
                            ["activeProposalCount", "u64"],
                        ]
                        : []),
                ],
            },
        ],
        [
            accounts_1.TokenOwnerRecord,
            {
                kind: "struct",
                fields: [
                    ["accountType", "u8"],
                    ["realm", "pubkey"],
                    ["governingTokenMint", "pubkey"],
                    ["governingTokenOwner", "pubkey"],
                    ["governingTokenDepositAmount", "u64"],
                    // unrelinquishedVotesCount is u64 in V3 but for backward compatibility the sdk reads it as u32
                    ["unrelinquishedVotesCount", "u32"],
                    ["totalVotesCount", "u32"],
                    ["outstandingProposalCount", "u8"],
                    ["version", "u8"],
                    ["reserved", [6]],
                    ["governanceDelegate", { kind: "option", type: "pubkey" }],
                ],
            },
        ],
        [
            accounts_1.ProposalOption,
            {
                kind: "struct",
                fields: [
                    ["label", "string"],
                    ["voteWeight", "u64"],
                    ["voteResult", "u8"],
                    ["instructionsExecutedCount", "u16"],
                    ["instructionsCount", "u16"],
                    ["instructionsNextIndex", "u16"],
                ],
            },
        ],
        [
            accounts_1.Proposal,
            {
                kind: "struct",
                fields: [
                    ["accountType", "u8"],
                    ["governance", "pubkey"],
                    ["governingTokenMint", "pubkey"],
                    ["state", "u8"],
                    ["tokenOwnerRecord", "pubkey"],
                    ["signatoriesCount", "u8"],
                    ["signatoriesSignedOffCount", "u8"],
                    ...(accountVersion === constants_1.ACCOUNT_VERSION_V1
                        ? [
                            ["yesVotesCount", "u64"],
                            ["noVotesCount", "u64"],
                            ["instructionsExecutedCount", "u16"],
                            ["instructionsCount", "u16"],
                            ["instructionsNextIndex", "u16"],
                        ]
                        : [
                            ["voteType", "voteType"],
                            ["options", [accounts_1.ProposalOption]],
                            ["denyVoteWeight", { kind: "option", type: "u64" }],
                            ["reserved1", "u8"],
                            ["abstainVoteWeight", { kind: "option", type: "u64" }],
                            ["startVotingAt", { kind: "option", type: "u64" }],
                        ]),
                    ["draftAt", "u64"],
                    ["signingOffAt", { kind: "option", type: "u64" }],
                    ["votingAt", { kind: "option", type: "u64" }],
                    ["votingAtSlot", { kind: "option", type: "u64" }],
                    ["votingCompletedAt", { kind: "option", type: "u64" }],
                    ["executingAt", { kind: "option", type: "u64" }],
                    ["closedAt", { kind: "option", type: "u64" }],
                    ["executionFlags", "u8"],
                    ["maxVoteWeight", { kind: "option", type: "u64" }],
                    ...(accountVersion === constants_1.ACCOUNT_VERSION_V1 ? [] : [["maxVotingTime", { kind: "option", type: "u32" }]]),
                    ["voteThreshold", { kind: "option", type: "VoteThreshold" }],
                    ...(accountVersion === constants_1.ACCOUNT_VERSION_V1 ? [] : [["reserved", [64]]]),
                    ["name", "string"],
                    ["descriptionLink", "string"],
                    ...(accountVersion === constants_1.ACCOUNT_VERSION_V1 ? [] : [["vetoVoteWeight", "u64"]]),
                ],
            },
        ],
        [
            accounts_1.ProposalDeposit,
            {
                kind: "struct",
                fields: [
                    ["accountType", "u8"],
                    ["proposal", "pubkey"],
                    ["depositPayer", "pubkey"],
                ],
            },
        ],
        [
            accounts_1.SignatoryRecord,
            {
                kind: "struct",
                fields: [
                    ["accountType", "u8"],
                    ["proposal", "pubkey"],
                    ["signatory", "pubkey"],
                    ["signedOff", "u8"],
                ],
            },
        ],
        [
            accounts_1.VoteWeight,
            {
                kind: "enum",
                values: [
                    ["yes", "u64"],
                    ["no", "u64"],
                ],
            },
        ],
        [
            accounts_1.VoteRecord,
            {
                kind: "struct",
                fields: [
                    ["accountType", "u8"],
                    ["proposal", "pubkey"],
                    ["governingTokenOwner", "pubkey"],
                    ["isRelinquished", "u8"],
                    ...(accountVersion === constants_1.ACCOUNT_VERSION_V1
                        ? [["voteWeight", accounts_1.VoteWeight]]
                        : [
                            ["voterWeight", "u64"],
                            ["vote", "vote"],
                        ]),
                ],
            },
        ],
        [
            accounts_1.ProposalTransaction,
            {
                kind: "struct",
                fields: [
                    ["accountType", "u8"],
                    ["proposal", "pubkey"],
                    accountVersion >= constants_1.ACCOUNT_VERSION_V2 ? ["optionIndex", "u8"] : undefined,
                    ["instructionIndex", "u16"],
                    ["holdUpTime", "u32"],
                    accountVersion >= constants_1.ACCOUNT_VERSION_V2 ? ["instructions", [accounts_1.InstructionData]] : ["instruction", accounts_1.InstructionData],
                    ["executedAt", { kind: "option", type: "u64" }],
                    ["executionStatus", "u8"],
                ].filter(Boolean),
            },
        ],
        [
            accounts_1.ProgramMetadata,
            {
                kind: "struct",
                fields: [
                    ["accountType", "u8"],
                    ["updatedAt", "u64"],
                    ["version", "string"],
                    ["reserved", [64]],
                ],
            },
        ],
        [
            accounts_1.ProposalTransactionBuffer,
            {
                kind: "struct",
                fields: [
                    ["accountType", "u8"],
                    ["proposal", "pubkey"],
                    ["creator", "pubkey"],
                    ["bufferIndex", "u8"],
                    ["finalBufferHash", [32]],
                    ["finalBufferSize", "u16"],
                    ["buffer", ["u8"]],
                ],
            },
        ],
        [
            accounts_1.ProposalCompiledInstruction,
            {
                kind: "struct",
                fields: [
                    ["programIdIndex", "u8"],
                    ["accountIndexes", ["u8"]], // Vector of u8
                    ["data", ["u8"]], // Vector of u8 (Uint8Array)
                ],
            },
        ],
        [
            accounts_1.VersionedTransactionMessageAddressTableLookup,
            {
                kind: "struct",
                fields: [
                    ["accountKey", "pubkey"],
                    ["writableIndexes", ["u8"]], // Vector of u8
                    ["readonlyIndexes", ["u8"]], // Vector of u8
                ],
            },
        ],
        [
            accounts_1.ProposalTransactionMessage,
            {
                kind: "struct",
                fields: [
                    ["numSigners", "u8"],
                    ["numWritableSigners", "u8"],
                    ["numWritableNonSigners", "u8"],
                    ["accountKeys", ["pubkey"]], // Vector of pubkeys
                    ["instructions", [accounts_1.ProposalCompiledInstruction]], // Vector of instructions
                    ["addressTableLookups", [accounts_1.VersionedTransactionMessageAddressTableLookup]], // Vector of lookups
                ],
            },
        ],
        [
            accounts_1.ProposalVersionedTransaction,
            {
                kind: "struct",
                fields: [
                    ["accountType", "u8"],
                    ["proposal", "pubkey"],
                    ["optionIndex", "u8"],
                    ["transactionIndex", "u16"],
                    ["executionIndex", "u8"],
                    ["executedAt", { kind: "option", type: "u64" }], // Using option for null possibility
                    ["executionStatus", "u8"], // Using u8 to match enum pattern
                    ["ephemeralSignerBumps", ["u8"]], // Vector of u8
                    ["message", accounts_1.ProposalTransactionMessage],
                ],
            },
        ],
        ...createGovernanceStructSchema(undefined, accountVersion),
    ]);
}
function getGovernanceSchemaForAccount(accountType) {
    return getGovernanceAccountSchema((0, accounts_1.getGovernanceAccountVersion)(accountType));
}
const GovernanceAccountParser = (classType) => (0, serialisation_1.BorshAccountParser)(classType, (accountType) => getGovernanceSchemaForAccount(accountType));
exports.GovernanceAccountParser = GovernanceAccountParser;
function getInstructionDataFromBase64(instructionDataBase64) {
    const instructionDataBin = Buffer.from(instructionDataBase64, "base64");
    const instructionData = (0, borsh_3.deserializeBorsh)(exports.GOVERNANCE_INSTRUCTION_SCHEMA_V1, accounts_1.InstructionData, instructionDataBin);
    return instructionData;
}
async function getVersionedTransactionProposalData(connection, vtxPk) {
    return connection.getAccountInfo(vtxPk).then((account) => {
        if (!account)
            return null;
        return (0, exports.GovernanceAccountParser)(accounts_1.ProposalVersionedTransaction)(vtxPk, account).account;
    });
}
/**
 * Retrieves the account meta and address lookup table accounts required for executing a versioned transaction.
 *
 * @param connection - The Solana connection object to interact with the blockchain.
 * @param proposalVersionedTxPk - The public key of the proposal versioned transaction account.
 * @param transactionIndex - The index of the transaction within the proposal.
 * @param governancePk - The public key of the governance account.
 * @param treasuryPk - The public key of the native treasury account.
 * @param programId - The public key of the governance program.
 * @param ephemeralSignerBumps - An array of ephemeral signer bumps used for generating ephemeral signer PDAs.
 *
 * @returns A promise that resolves to an object containing:
 * - `accountMetas`: The account metadata required for the transaction execution.
 * - `lookupTableAccounts`: The address lookup table accounts required for the transaction execution.
 *
 * This function:
 * 1. Fetches the versioned transaction data using the `getVersionedTransactionProposalData` function.
 * 2. Extracts the `message` from the versioned transaction data, which contains the transaction's account keys and instructions.
 * 3. Calls `accountsForTransactionExecute` to generate the required account metadata and lookup table accounts.
 *
 * Note:
 * - This function is **deterministic** for the execution of a versioned transaction.
 * - The returned `accountMetas` and `lookupTableAccounts` must be used to construct a `VersionedTransaction` from `@solana/web3.js`.
 */
async function getAccountMetasAndLookupTableAccountsForExecuteTransaction(connection, proposalVersionedTxPk, transactionIndex, governancePk, treasuryPk, programId, ephemeralSignerCount) {
    const versionedTransactionData = await getVersionedTransactionProposalData(connection, proposalVersionedTxPk);
    return await (0, tools_1.accountsForTransactionExecute)({
        connection: connection,
        transactionProposalPda: proposalVersionedTxPk,
        transactionIndex,
        governancePk,
        treasuryPk,
        message: versionedTransactionData === null || versionedTransactionData === void 0 ? void 0 : versionedTransactionData.message,
        ephemeralSignerCount,
        programId,
    });
}
//# sourceMappingURL=serialisation.js.map