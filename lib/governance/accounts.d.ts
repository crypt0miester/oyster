import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { type Vote } from "./instructions";
export declare const GOVERNANCE_PROGRAM_SEED = "governance";
export declare enum GovernanceAccountType {
    Uninitialized = 0,
    RealmV1 = 1,
    TokenOwnerRecordV1 = 2,
    GovernanceV1 = 3,
    ProgramGovernanceV1 = 4,
    ProposalV1 = 5,
    SignatoryRecordV1 = 6,
    VoteRecordV1 = 7,
    ProposalInstructionV1 = 8,
    MintGovernanceV1 = 9,
    TokenGovernanceV1 = 10,
    RealmConfig = 11,
    VoteRecordV2 = 12,
    ProposalTransactionV2 = 13,
    ProposalV2 = 14,
    ProgramMetadata = 15,
    RealmV2 = 16,
    TokenOwnerRecordV2 = 17,
    GovernanceV2 = 18,
    ProgramGovernanceV2 = 19,
    MintGovernanceV2 = 20,
    TokenGovernanceV2 = 21,
    SignatoryRecordV2 = 22,
    ProposalDeposit = 23,
    RequiredSignatory = 24,
    ProposalVersionedTransaction = 25,
    ProposalTransactionBuffer = 26
}
export interface GovernanceAccount {
    accountType: GovernanceAccountType;
}
export type GovernanceAccountClass = typeof Realm | typeof TokenOwnerRecord | typeof Governance | typeof Proposal | typeof SignatoryRecord | typeof VoteRecord | typeof ProposalTransaction | typeof ProposalVersionedTransaction | typeof ProposalTransactionBuffer | typeof RealmConfigAccount | typeof ProgramMetadata | typeof ProposalDeposit;
export declare function getAccountTypes(accountClass: GovernanceAccountClass): GovernanceAccountType[];
export declare function getGovernanceAccountVersion(accountType: GovernanceAccountType): 1 | 2;
export declare enum VoteThresholdType {
    YesVotePercentage = 0,
    QuorumPercentage = 1,
    Disabled = 2
}
export declare class VoteThreshold {
    type: VoteThresholdType;
    value: number | undefined;
    constructor(args: {
        type: VoteThresholdType;
        value?: number | undefined;
    });
}
export declare enum VoteTipping {
    Strict = 0,
    Early = 1,// V2 Only
    Disabled = 2
}
export declare enum InstructionExecutionStatus {
    None = 0,
    Success = 1,
    Error = 2
}
export declare enum InstructionExecutionFlags {
    None = 0,
    Ordered = 1,
    UseTransaction = 2
}
export declare enum MintMaxVoteWeightSourceType {
    SupplyFraction = 0,
    Absolute = 1
}
export declare class MintMaxVoteWeightSource {
    type: MintMaxVoteWeightSourceType;
    value: BN;
    constructor(args: {
        type: MintMaxVoteWeightSourceType;
        value: BN;
    });
    static SUPPLY_FRACTION_BASE: BN;
    static SUPPLY_FRACTION_DECIMALS: number;
    static FULL_SUPPLY_FRACTION: MintMaxVoteWeightSource;
    isFullSupply(): boolean;
    getSupplyFraction(): BN;
    fmtSupplyFractionPercentage(): string;
}
export declare enum VoteTypeKind {
    SingleChoice = 0,
    MultiChoice = 1
}
export declare enum MultiChoiceType {
    FullWeight = 0,
    Weighted = 1
}
export declare class VoteType {
    type: VoteTypeKind;
    choiceType: MultiChoiceType | undefined;
    minVoterOptions: number | undefined;
    maxVoterOptions: number | undefined;
    maxWinningOptions: number | undefined;
    constructor(args: {
        type: VoteTypeKind;
        choiceType: MultiChoiceType | undefined;
        minVoterOptions: number | undefined;
        maxVoterOptions: number | undefined;
        maxWinningOptions: number | undefined;
    });
    static SINGLE_CHOICE: VoteType;
    static MULTI_CHOICE: (choiceType: MultiChoiceType, minVoterOptions: number, maxVoterOptions: number, maxWinningOptions: number) => VoteType;
    isSingleChoice(): boolean;
}
export declare class RealmConfigArgs {
    useCouncilMint: boolean;
    communityMintMaxVoteWeightSource: MintMaxVoteWeightSource;
    minCommunityTokensToCreateGovernance: BN;
    useCommunityVoterWeightAddin: boolean;
    useMaxCommunityVoterWeightAddin: boolean;
    communityTokenConfigArgs: GoverningTokenConfigArgs;
    councilTokenConfigArgs: GoverningTokenConfigArgs;
    constructor(args: {
        useCouncilMint: boolean;
        minCommunityTokensToCreateGovernance: BN;
        communityMintMaxVoteWeightSource: MintMaxVoteWeightSource;
        useCommunityVoterWeightAddin: boolean;
        useMaxCommunityVoterWeightAddin: boolean;
        communityTokenConfigArgs: GoverningTokenConfigArgs;
        councilTokenConfigArgs: GoverningTokenConfigArgs;
    });
}
export declare enum GoverningTokenType {
    Liquid = 0,
    Membership = 1,
    Dormant = 2
}
export declare class GoverningTokenConfigArgs {
    useVoterWeightAddin: boolean;
    useMaxVoterWeightAddin: boolean;
    tokenType: GoverningTokenType;
    constructor(args: {
        useVoterWeightAddin: boolean;
        useMaxVoterWeightAddin: boolean;
        tokenType: GoverningTokenType;
    });
}
export declare class GoverningTokenConfigAccountArgs {
    voterWeightAddin: PublicKey | undefined;
    maxVoterWeightAddin: PublicKey | undefined;
    tokenType: GoverningTokenType;
    constructor(args: {
        voterWeightAddin: PublicKey | undefined;
        maxVoterWeightAddin: PublicKey | undefined;
        tokenType: GoverningTokenType;
    });
}
export declare class RealmConfig {
    councilMint: PublicKey | undefined;
    communityMintMaxVoteWeightSource: MintMaxVoteWeightSource;
    minCommunityTokensToCreateGovernance: BN;
    useCommunityVoterWeightAddin: boolean;
    useMaxCommunityVoterWeightAddin: boolean;
    reserved: Uint8Array;
    constructor(args: {
        councilMint: PublicKey | undefined;
        communityMintMaxVoteWeightSource: MintMaxVoteWeightSource;
        minCommunityTokensToCreateGovernance: BN;
        reserved: Uint8Array;
        useCommunityVoterWeightAddin: boolean;
        useMaxCommunityVoterWeightAddin: boolean;
    });
}
export declare class Realm {
    accountType: GovernanceAccountType;
    communityMint: PublicKey;
    config: RealmConfig;
    reserved: Uint8Array;
    votingProposalCount: number;
    authority: PublicKey | undefined;
    name: string;
    constructor(args: {
        communityMint: PublicKey;
        reserved: Uint8Array;
        config: RealmConfig;
        votingProposalCount: number;
        authority: PublicKey | undefined;
        name: string;
    });
}
export declare function getTokenHoldingAddress(programId: PublicKey, realm: PublicKey, governingTokenMint: PublicKey): Promise<PublicKey>;
export declare class GoverningTokenConfig {
    voterWeightAddin: PublicKey | undefined;
    maxVoterWeightAddin: PublicKey | undefined;
    tokenType: GoverningTokenType;
    reserved: Uint8Array;
    constructor(args: {
        voterWeightAddin: PublicKey | undefined;
        maxVoterWeightAddin: PublicKey | undefined;
        tokenType: GoverningTokenType;
        reserved: Uint8Array;
    });
}
export declare class RealmConfigAccount {
    accountType: GovernanceAccountType;
    realm: PublicKey;
    communityTokenConfig: GoverningTokenConfig;
    councilTokenConfig: GoverningTokenConfig;
    reserved: Uint8Array;
    constructor(args: {
        realm: PublicKey;
        communityTokenConfig: GoverningTokenConfig;
        councilTokenConfig: GoverningTokenConfig;
        reserved: Uint8Array;
    });
}
export declare function getRealmConfigAddress(programId: PublicKey, realm: PublicKey): Promise<PublicKey>;
export declare class GovernanceConfig {
    communityVoteThreshold: VoteThreshold;
    minCommunityTokensToCreateProposal: BN;
    minInstructionHoldUpTime: number;
    baseVotingTime: number;
    communityVoteTipping: VoteTipping;
    minCouncilTokensToCreateProposal: BN;
    councilVoteThreshold: VoteThreshold;
    councilVetoVoteThreshold: VoteThreshold;
    communityVetoVoteThreshold: VoteThreshold;
    councilVoteTipping: VoteTipping;
    votingCoolOffTime: number;
    depositExemptProposalCount: number;
    constructor(args: {
        communityVoteThreshold: VoteThreshold;
        minCommunityTokensToCreateProposal: BN;
        minInstructionHoldUpTime: number;
        baseVotingTime: number;
        communityVoteTipping?: VoteTipping;
        minCouncilTokensToCreateProposal: BN;
        councilVoteThreshold: VoteThreshold;
        councilVetoVoteThreshold: VoteThreshold;
        communityVetoVoteThreshold: VoteThreshold;
        councilVoteTipping: VoteTipping;
        votingCoolOffTime: number;
        depositExemptProposalCount: number;
    });
}
export declare class Governance {
    accountType: GovernanceAccountType;
    realm: PublicKey;
    governedAccount: PublicKey;
    config: GovernanceConfig;
    proposalCount: number;
    reserved?: Uint8Array;
    activeProposalCount: BN;
    constructor(args: {
        realm: PublicKey;
        governedAccount: PublicKey;
        accountType: number;
        config: GovernanceConfig;
        reserved?: Uint8Array;
        proposalCount: number;
        activeProposalCount: BN;
    });
    isProgramGovernance(): boolean;
    isAccountGovernance(): boolean;
    isMintGovernance(): boolean;
    isTokenGovernance(): boolean;
}
export declare class TokenOwnerRecord {
    accountType: GovernanceAccountType;
    realm: PublicKey;
    governingTokenMint: PublicKey;
    governingTokenOwner: PublicKey;
    governingTokenDepositAmount: BN;
    unrelinquishedVotesCount: number;
    totalVotesCount: number;
    outstandingProposalCount: number;
    reserved: Uint8Array;
    governanceDelegate?: PublicKey;
    version: number;
    constructor(args: {
        realm: PublicKey;
        governingTokenMint: PublicKey;
        governingTokenOwner: PublicKey;
        governingTokenDepositAmount: BN;
        unrelinquishedVotesCount: number;
        totalVotesCount: number;
        outstandingProposalCount: number;
        reserved: Uint8Array;
        governanceDelegate: PublicKey | undefined;
        version: number;
    });
}
export declare function getTokenOwnerRecordAddress(programId: PublicKey, realm: PublicKey, governingTokenMint: PublicKey, governingTokenOwner: PublicKey): Promise<PublicKey>;
export declare enum ProposalState {
    Draft = 0,
    SigningOff = 1,
    Voting = 2,
    Succeeded = 3,
    Executing = 4,
    Completed = 5,
    Cancelled = 6,
    Defeated = 7,
    ExecutingWithErrors = 8,
    Vetoed = 9
}
export declare enum OptionVoteResult {
    None = 0,
    Succeeded = 1,
    Defeated = 2
}
export declare class ProposalOption {
    label: string;
    voteWeight: BN;
    voteResult: OptionVoteResult;
    instructionsExecutedCount: number;
    instructionsCount: number;
    instructionsNextIndex: number;
    constructor(args: {
        label: string;
        voteWeight: BN;
        voteResult: OptionVoteResult;
        instructionsExecutedCount: number;
        instructionsCount: number;
        instructionsNextIndex: number;
    });
}
export declare class Proposal {
    accountType: GovernanceAccountType;
    governance: PublicKey;
    governingTokenMint: PublicKey;
    state: ProposalState;
    tokenOwnerRecord: PublicKey;
    signatoriesCount: number;
    signatoriesSignedOffCount: number;
    yesVotesCount: BN;
    noVotesCount: BN;
    instructionsExecutedCount: number;
    instructionsCount: number;
    instructionsNextIndex: number;
    voteType: VoteType;
    options: ProposalOption[];
    denyVoteWeight: BN | undefined;
    reserved1: number;
    abstainVoteWeight: BN | undefined;
    startVotingAt: BN | null;
    maxVotingTime: number | null;
    draftAt: BN;
    signingOffAt: BN | null;
    votingAt: BN | null;
    votingAtSlot: BN | null;
    votingCompletedAt: BN | null;
    executingAt: BN | null;
    closedAt: BN | null;
    executionFlags: InstructionExecutionFlags;
    maxVoteWeight: BN | null;
    voteThreshold: VoteThreshold | null;
    name: string;
    descriptionLink: string;
    vetoVoteWeight: BN;
    constructor(args: {
        accountType: GovernanceAccountType;
        governance: PublicKey;
        governingTokenMint: PublicKey;
        state: ProposalState;
        tokenOwnerRecord: PublicKey;
        signatoriesCount: number;
        signatoriesSignedOffCount: number;
        descriptionLink: string;
        name: string;
        yesVotesCount: BN;
        noVotesCount: BN;
        instructionsExecutedCount: number;
        instructionsCount: number;
        instructionsNextIndex: number;
        voteType: VoteType;
        options: ProposalOption[];
        denyVoteWeight: BN | undefined;
        reserved1: number;
        abstainVoteWeight: BN | undefined;
        startVotingAt: BN | null;
        maxVotingTime: number | null;
        draftAt: BN;
        signingOffAt: BN | null;
        votingAt: BN | null;
        votingAtSlot: BN | null;
        votingCompletedAt: BN | null;
        executingAt: BN | null;
        closedAt: BN | null;
        executionFlags: InstructionExecutionFlags;
        maxVoteWeight: BN | null;
        voteThreshold: VoteThreshold | null;
        vetoVoteWeight: BN;
    });
    isVoteFinalized(): boolean;
    isFinalState(): boolean;
    getStateTimestamp(): number;
    getStateSortRank(): number;
    isPreVotingState(): boolean;
    getYesVoteOption(): ProposalOption;
    getYesVoteCount(): BN;
    getNoVoteCount(): BN;
    getTimeToVoteEnd(governance: Governance): number;
    hasVoteTimeEnded(governance: Governance): boolean;
    canCancel(governance: Governance): boolean;
    canWalletCancel(governance: Governance, proposalOwner: TokenOwnerRecord, walletPk: PublicKey): boolean | undefined;
}
export declare class ProposalDeposit {
    accountType: GovernanceAccountType;
    proposal: PublicKey;
    depositPayer: PublicKey;
    constructor(args: {
        proposal: PublicKey;
        depositPayer: PublicKey;
    });
}
export declare class SignatoryRecord {
    accountType: GovernanceAccountType;
    proposal: PublicKey;
    signatory: PublicKey;
    signedOff: boolean;
    constructor(args: {
        proposal: PublicKey;
        signatory: PublicKey;
        signedOff: boolean;
    });
}
export declare function getSignatoryRecordAddress(programId: PublicKey, proposal: PublicKey, signatory: PublicKey): Promise<PublicKey>;
export declare class VoteWeight {
    yes: BN;
    no: BN;
    constructor(args: {
        yes: BN;
        no: BN;
    });
}
export declare class VoteRecord {
    accountType: GovernanceAccountType;
    proposal: PublicKey;
    governingTokenOwner: PublicKey;
    isRelinquished: boolean;
    voteWeight: VoteWeight | undefined;
    voterWeight: BN | undefined;
    vote: Vote | undefined;
    constructor(args: {
        accountType: GovernanceAccountType;
        proposal: PublicKey;
        governingTokenOwner: PublicKey;
        isRelinquished: boolean;
        voteWeight: VoteWeight | undefined;
        voterWeight: BN | undefined;
        vote: Vote | undefined;
    });
    getNoVoteWeight(): BN | undefined;
    getYesVoteWeight(): BN | undefined;
}
export declare function getVoteRecordAddress(programId: PublicKey, proposal: PublicKey, tokenOwnerRecord: PublicKey): Promise<PublicKey>;
export declare class AccountMetaData {
    pubkey: PublicKey;
    isSigner: boolean;
    isWritable: boolean;
    constructor(args: {
        pubkey: PublicKey;
        isSigner: boolean;
        isWritable: boolean;
    });
}
export declare class InstructionData {
    programId: PublicKey;
    accounts: AccountMetaData[];
    data: Uint8Array;
    constructor(args: {
        programId: PublicKey;
        accounts: AccountMetaData[];
        data: Uint8Array;
    });
}
export declare class ProposalTransaction {
    accountType: GovernanceAccountType;
    proposal: PublicKey;
    instructionIndex: number;
    instruction: InstructionData;
    optionIndex: number;
    instructions: InstructionData[];
    holdUpTime: number;
    executedAt: BN | null;
    executionStatus: InstructionExecutionStatus;
    constructor(args: {
        accountType: GovernanceAccountType;
        proposal: PublicKey;
        instructionIndex: number;
        optionIndex: number;
        holdUpTime: number;
        instruction: InstructionData;
        executedAt: BN | null;
        executionStatus: InstructionExecutionStatus;
        instructions: InstructionData[];
    });
    getSingleInstruction(): InstructionData;
    getAllInstructions(): InstructionData[];
}
export declare class ProposalTransactionBuffer {
    accountType: GovernanceAccountType;
    proposal: PublicKey;
    creator: PublicKey;
    bufferIndex: number;
    finalBufferHash: Uint8Array;
    finalBufferSize: number;
    buffer: Uint8Array;
    constructor(args: {
        accountType: GovernanceAccountType;
        proposal: PublicKey;
        creator: PublicKey;
        bufferIndex: number;
        finalBufferHash: Uint8Array;
        finalBufferSize: number;
        buffer: Uint8Array;
    });
    validateBuffer(): boolean;
    serialize(): Uint8Array;
}
export declare enum TransactionExecutionStatus {
    None = "None",
    Success = "Success",
    Error = "Error"
}
export declare class VersionedTransactionMessageAddressTableLookup {
    accountKey: PublicKey;
    writableIndexes: number[];
    readonlyIndexes: number[];
    constructor(args: {
        accountKey: PublicKey;
        writableIndexes: number[];
        readonlyIndexes: number[];
    });
}
export declare class ProposalCompiledInstruction {
    programIdIndex: number;
    accountIndexes: number[];
    data: Uint8Array;
    constructor(args: {
        programIdIndex: number;
        accountIndexes: number[];
        data: Uint8Array;
    });
    getProgramIdIndex(): number;
    getAccountIndexes(): number[];
    getData(): Uint8Array;
    serialize(): Uint8Array;
}
export declare class ProposalTransactionMessage {
    numSigners: number;
    numWritableSigners: number;
    numWritableNonSigners: number;
    accountKeys: PublicKey[];
    instructions: ProposalCompiledInstruction[];
    addressTableLookups: VersionedTransactionMessageAddressTableLookup[];
    constructor(args: {
        numSigners: number;
        numWritableSigners: number;
        numWritableNonSigners: number;
        accountKeys: PublicKey[];
        instructions: ProposalCompiledInstruction[];
        addressTableLookups: VersionedTransactionMessageAddressTableLookup[];
    });
    getNumSigners(): number;
    getNumWritableSigners(): number;
    getNumWritableNonSigners(): number;
    getAccountKeys(): PublicKey[];
    getInstructions(): ProposalCompiledInstruction[];
    getAddressTableLookups(): VersionedTransactionMessageAddressTableLookup[];
    serialize(): Uint8Array;
}
export declare class ProposalVersionedTransaction {
    accountType: GovernanceAccountType;
    proposal: PublicKey;
    optionIndex: number;
    transactionIndex: number;
    executionIndex: number;
    executedAt: number | null;
    executionStatus: TransactionExecutionStatus;
    ephemeralSignerBumps: number[];
    message: ProposalTransactionMessage;
    constructor(args: {
        accountType: GovernanceAccountType;
        proposal: PublicKey;
        optionIndex: number;
        transactionIndex: number;
        executionIndex: number;
        executedAt: number | null;
        executionStatus: TransactionExecutionStatus;
        ephemeralSignerBumps: number[];
        message: ProposalTransactionMessage;
    });
    getAccountType(): GovernanceAccountType;
    getProposal(): PublicKey;
    getOptionIndex(): number;
    getTransactionIndex(): number;
    getExecutionIndex(): number;
    getExecutedAt(): number | null;
    getExecutionStatus(): TransactionExecutionStatus;
    getEphemeralSignerBumps(): number[];
    getMessage(): ProposalTransactionMessage;
    isExecuted(): boolean;
    hasError(): boolean;
    getAllSigners(): PublicKey[];
    getWritableAccounts(): PublicKey[];
}
export declare function getProposalTransactionAddress(programId: PublicKey, programVersion: number, proposal: PublicKey, optionIndex: number, transactionIndex: number): PublicKey;
export declare class ProgramMetadata {
    accountType: GovernanceAccountType;
    updatedAt: BN;
    version: string;
    reserved: Uint8Array;
    constructor(args: {
        updatedAt: BN;
        reserved: Uint8Array;
        version: string;
    });
}
export declare function getProgramMetadataAddress(programId: PublicKey): Promise<PublicKey>;
export declare function getNativeTreasuryAddress(programId: PublicKey, governance: PublicKey): Promise<PublicKey>;
export declare function getGoverningTokenHoldingAddress(programId: PublicKey, realm: PublicKey, governingTokenMint: PublicKey): Promise<PublicKey>;
export declare function getProposalDepositAddress(programId: PublicKey, proposal: PublicKey, proposalDepositPayer: PublicKey): Promise<PublicKey>;
export declare function getEphemeralSignerPda({ transactionProposalPda, transactionIndex, ephemeralSignerIndex, programId, }: {
    transactionProposalPda: PublicKey;
    transactionIndex: number;
    ephemeralSignerIndex: number;
    programId: PublicKey;
}): [PublicKey, number];
export declare function getProposalVersionedTransactionAddress(programId: PublicKey, proposal: PublicKey, optionIndex: number, transactionIndex: number): PublicKey;
export declare function getProposalTransactionBufferAddress(programId: PublicKey, proposal: PublicKey, creator: PublicKey, bufferIndex: number): PublicKey;
//# sourceMappingURL=accounts.d.ts.map