import type { PublicKey } from "@solana/web3.js";
import type BN from "bn.js";
import type { RealmConfigArgs, GovernanceConfig, InstructionData, VoteType } from "./accounts";
export declare enum GovernanceInstruction {
    CreateRealm = 0,
    DepositGoverningTokens = 1,
    WithdrawGoverningTokens = 2,
    SetGovernanceDelegate = 3,// --
    CreateGovernance = 4,
    CreateProgramGovernanceDeprecated = 5,
    CreateProposal = 6,
    AddSignatory = 7,
    RemoveSignatory = 8,
    InsertTransaction = 9,
    RemoveTransaction = 10,
    CancelProposal = 11,
    SignOffProposal = 12,
    CastVote = 13,
    FinalizeVote = 14,
    RelinquishVote = 15,
    ExecuteTransaction = 16,
    CreateMintGovernanceDeprecated = 17,
    CreateTokenGovernanceDeprecated = 18,
    SetGovernanceConfig = 19,
    FlagTransactionError = 20,
    SetRealmAuthority = 21,
    SetRealmConfig = 22,
    CreateTokenOwnerRecord = 23,
    UpdateProgramMetadata = 24,
    CreateNativeTreasury = 25,
    RevokeGoverningTokens = 26,
    RefundProposalDeposit = 27,
    CompleteProposal = 28,
    AddRequiredSignatory = 29,
    RemoveRequiredSignatory = 30,
    CreateTransactionBuffer = 31,
    ExtendTransactionBuffer = 32,
    CloseTransactionBuffer = 33,
    InsertVersionedTransactionFromBuffer = 34,
    InsertVersionedTransaction = 35,
    ExecuteVersionedTransaction = 36,
    RemoveVersionedTransaction = 37
}
export declare class CreateRealmArgs {
    instruction: GovernanceInstruction;
    configArgs: RealmConfigArgs;
    name: string;
    constructor(args: {
        name: string;
        configArgs: RealmConfigArgs;
    });
}
export declare class DepositGoverningTokensArgs {
    instruction: GovernanceInstruction;
    amount: BN;
    constructor(args: {
        amount: BN;
    });
}
export declare class WithdrawGoverningTokensArgs {
    instruction: GovernanceInstruction;
}
export declare class CreateGovernanceArgs {
    instruction: GovernanceInstruction;
    config: GovernanceConfig;
    constructor(args: {
        config: GovernanceConfig;
    });
}
export declare class CreateProgramGovernanceArgs {
    instruction: GovernanceInstruction;
    config: GovernanceConfig;
    transferUpgradeAuthority: boolean;
    constructor(args: {
        config: GovernanceConfig;
        transferUpgradeAuthority: boolean;
    });
}
export declare class CreateMintGovernanceArgs {
    instruction: GovernanceInstruction;
    config: GovernanceConfig;
    transferMintAuthorities: boolean;
    constructor(args: {
        config: GovernanceConfig;
        transferMintAuthorities: boolean;
    });
}
export declare class CreateTokenGovernanceArgs {
    instruction: GovernanceInstruction;
    config: GovernanceConfig;
    transferTokenOwner: boolean;
    constructor(args: {
        config: GovernanceConfig;
        transferTokenOwner: boolean;
    });
}
export declare class SetGovernanceConfigArgs {
    instruction: GovernanceInstruction;
    config: GovernanceConfig;
    constructor(args: {
        config: GovernanceConfig;
    });
}
export declare class CreateProposalArgs {
    instruction: GovernanceInstruction;
    name: string;
    descriptionLink: string;
    governingTokenMint: PublicKey;
    voteType: VoteType;
    options: string[];
    useDenyOption: boolean;
    proposalSeed: PublicKey;
    constructor(args: {
        name: string;
        descriptionLink: string;
        governingTokenMint: PublicKey;
        voteType: VoteType;
        options: string[];
        useDenyOption: boolean;
        proposalSeed: PublicKey;
    });
}
export declare class AddSignatoryArgs {
    instruction: GovernanceInstruction;
    signatory: PublicKey;
    constructor(args: {
        signatory: PublicKey;
    });
}
export declare class SignOffProposalArgs {
    instruction: GovernanceInstruction;
}
export declare class CancelProposalArgs {
    instruction: GovernanceInstruction;
}
export declare enum YesNoVote {
    Yes = 0,
    No = 1
}
export declare class VoteChoice {
    rank: number;
    weightPercentage: number;
    constructor(args: {
        rank: number;
        weightPercentage: number;
    });
}
export declare enum VoteKind {
    Approve = 0,
    Deny = 1,
    Abstain = 2,
    Veto = 3
}
export declare class Vote {
    voteType: VoteKind;
    approveChoices: VoteChoice[] | undefined;
    deny: boolean | undefined;
    veto: boolean | undefined;
    constructor(args: {
        voteType: VoteKind;
        approveChoices: VoteChoice[] | undefined;
        deny: boolean | undefined;
        veto: boolean | undefined;
    });
    toYesNoVote(): YesNoVote | undefined;
    static fromYesNoVote(yesNoVote: YesNoVote): Vote;
}
export declare class CastVoteArgs {
    instruction: GovernanceInstruction;
    yesNoVote: YesNoVote | undefined;
    vote: Vote | undefined;
    constructor(args: {
        yesNoVote: YesNoVote | undefined;
        vote: Vote | undefined;
    });
}
export declare class RelinquishVoteArgs {
    instruction: GovernanceInstruction;
}
export declare class FinalizeVoteArgs {
    instruction: GovernanceInstruction;
}
export declare class InsertTransactionArgs {
    instruction: GovernanceInstruction;
    index: number;
    optionIndex: number;
    holdUpTime: number;
    instructionData: InstructionData | undefined;
    instructions: InstructionData[] | undefined;
    constructor(args: {
        index: number;
        optionIndex: number;
        holdUpTime: number;
        instructionData: InstructionData | undefined;
        instructions: InstructionData[] | undefined;
    });
}
export declare class RemoveTransactionArgs {
    instruction: GovernanceInstruction;
}
export declare class ExecuteTransactionArgs {
    instruction: GovernanceInstruction;
}
export declare class FlagTransactionErrorArgs {
    instruction: GovernanceInstruction;
}
export declare enum SetRealmAuthorityAction {
    SetUnchecked = 0,
    SetChecked = 1,
    Remove = 2
}
export declare class SetRealmAuthorityArgs {
    instruction: GovernanceInstruction;
    newRealmAuthority: PublicKey | undefined;
    action: SetRealmAuthorityAction | undefined;
    constructor(args: {
        newRealmAuthority: PublicKey | undefined;
        action: SetRealmAuthorityAction | undefined;
    });
}
export declare class SetRealmConfigArgs {
    instruction: GovernanceInstruction;
    configArgs: RealmConfigArgs;
    constructor(args: {
        configArgs: RealmConfigArgs;
    });
}
export declare class CreateTokenOwnerRecordArgs {
    instruction: GovernanceInstruction;
}
export declare class UpdateProgramMetadataArgs {
    instruction: GovernanceInstruction;
}
export declare class CreateNativeTreasuryArgs {
    instruction: GovernanceInstruction;
}
export declare class SetGovernanceDelegateArgs {
    instruction: GovernanceInstruction;
    newGovernanceDelegate: PublicKey | undefined;
    constructor(args: {
        newGovernanceDelegate: PublicKey | undefined;
    });
}
export declare class RevokeGoverningTokensArgs {
    instruction: GovernanceInstruction;
    amount: BN;
    constructor(args: {
        amount: BN;
    });
}
export declare class RefundProposalDepositArgs {
    instruction: GovernanceInstruction;
}
export declare class CreateTransactionBufferArgs {
    instruction: GovernanceInstruction;
    bufferIndex: number;
    finalBufferHash: Uint8Array;
    finalBufferSize: number;
    buffer: Uint8Array;
    constructor(args: {
        bufferIndex: number;
        finalBufferHash: Uint8Array;
        finalBufferSize: number;
        buffer: Uint8Array;
    });
}
export declare class ExtendTransactionBufferArgs {
    instruction: GovernanceInstruction;
    bufferIndex: number;
    buffer: Uint8Array;
    constructor(args: {
        bufferIndex: number;
        buffer: Uint8Array;
    });
}
export declare class CloseTransactionBufferArgs {
    instruction: GovernanceInstruction;
    bufferIndex: number;
    constructor(args: {
        bufferIndex: number;
    });
}
export declare class InsertVersionedTransactionFromBufferArgs {
    instruction: GovernanceInstruction;
    optionIndex: number;
    ephemeralSigners: number;
    transactionIndex: number;
    bufferIndex: number;
    constructor(args: {
        optionIndex: number;
        ephemeralSigners: number;
        transactionIndex: number;
        bufferIndex: number;
    });
}
export declare class InsertVersionedTransactionArgs {
    instruction: GovernanceInstruction;
    optionIndex: number;
    ephemeralSigners: number;
    transactionIndex: number;
    transactionMessage: Uint8Array;
    constructor(args: {
        optionIndex: number;
        ephemeralSigners: number;
        transactionIndex: number;
        transactionMessage: Uint8Array;
    });
}
export declare class ExecuteVersionedTransactionArgs {
    instruction: GovernanceInstruction;
}
//# sourceMappingURL=instructions.d.ts.map