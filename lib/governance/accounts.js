"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramMetadata = exports.ProposalVersionedTransaction = exports.ProposalTransactionMessage = exports.ProposalCompiledInstruction = exports.VersionedTransactionMessageAddressTableLookup = exports.TransactionExecutionStatus = exports.ProposalTransactionBuffer = exports.ProposalTransaction = exports.InstructionData = exports.AccountMetaData = exports.VoteRecord = exports.VoteWeight = exports.SignatoryRecord = exports.ProposalDeposit = exports.Proposal = exports.ProposalOption = exports.OptionVoteResult = exports.ProposalState = exports.TokenOwnerRecord = exports.Governance = exports.GovernanceConfig = exports.RealmConfigAccount = exports.GoverningTokenConfig = exports.Realm = exports.RealmConfig = exports.GoverningTokenConfigAccountArgs = exports.GoverningTokenConfigArgs = exports.GoverningTokenType = exports.RealmConfigArgs = exports.VoteType = exports.MultiChoiceType = exports.VoteTypeKind = exports.MintMaxVoteWeightSource = exports.MintMaxVoteWeightSourceType = exports.InstructionExecutionFlags = exports.InstructionExecutionStatus = exports.VoteTipping = exports.VoteThreshold = exports.VoteThresholdType = exports.GovernanceAccountType = exports.GOVERNANCE_PROGRAM_SEED = void 0;
exports.getAccountTypes = getAccountTypes;
exports.getGovernanceAccountVersion = getGovernanceAccountVersion;
exports.getTokenHoldingAddress = getTokenHoldingAddress;
exports.getRealmConfigAddress = getRealmConfigAddress;
exports.getTokenOwnerRecordAddress = getTokenOwnerRecordAddress;
exports.getSignatoryRecordAddress = getSignatoryRecordAddress;
exports.getVoteRecordAddress = getVoteRecordAddress;
exports.getProposalTransactionAddress = getProposalTransactionAddress;
exports.getProgramMetadataAddress = getProgramMetadataAddress;
exports.getNativeTreasuryAddress = getNativeTreasuryAddress;
exports.getGoverningTokenHoldingAddress = getGoverningTokenHoldingAddress;
exports.getProposalDepositAddress = getProposalDepositAddress;
exports.getEphemeralSignerPda = getEphemeralSignerPda;
exports.getProposalVersionedTransactionAddress = getProposalVersionedTransactionAddress;
exports.getProposalTransactionBufferAddress = getProposalTransactionBufferAddress;
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = __importDefault(require("bn.js"));
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const instructions_1 = require("./instructions");
const constants_1 = require("../registry/constants");
/// Seed  prefix for Governance Program PDAs
exports.GOVERNANCE_PROGRAM_SEED = "governance";
var GovernanceAccountType;
(function (GovernanceAccountType) {
    GovernanceAccountType[GovernanceAccountType["Uninitialized"] = 0] = "Uninitialized";
    GovernanceAccountType[GovernanceAccountType["RealmV1"] = 1] = "RealmV1";
    GovernanceAccountType[GovernanceAccountType["TokenOwnerRecordV1"] = 2] = "TokenOwnerRecordV1";
    GovernanceAccountType[GovernanceAccountType["GovernanceV1"] = 3] = "GovernanceV1";
    GovernanceAccountType[GovernanceAccountType["ProgramGovernanceV1"] = 4] = "ProgramGovernanceV1";
    GovernanceAccountType[GovernanceAccountType["ProposalV1"] = 5] = "ProposalV1";
    GovernanceAccountType[GovernanceAccountType["SignatoryRecordV1"] = 6] = "SignatoryRecordV1";
    GovernanceAccountType[GovernanceAccountType["VoteRecordV1"] = 7] = "VoteRecordV1";
    GovernanceAccountType[GovernanceAccountType["ProposalInstructionV1"] = 8] = "ProposalInstructionV1";
    GovernanceAccountType[GovernanceAccountType["MintGovernanceV1"] = 9] = "MintGovernanceV1";
    GovernanceAccountType[GovernanceAccountType["TokenGovernanceV1"] = 10] = "TokenGovernanceV1";
    GovernanceAccountType[GovernanceAccountType["RealmConfig"] = 11] = "RealmConfig";
    GovernanceAccountType[GovernanceAccountType["VoteRecordV2"] = 12] = "VoteRecordV2";
    GovernanceAccountType[GovernanceAccountType["ProposalTransactionV2"] = 13] = "ProposalTransactionV2";
    GovernanceAccountType[GovernanceAccountType["ProposalV2"] = 14] = "ProposalV2";
    GovernanceAccountType[GovernanceAccountType["ProgramMetadata"] = 15] = "ProgramMetadata";
    GovernanceAccountType[GovernanceAccountType["RealmV2"] = 16] = "RealmV2";
    GovernanceAccountType[GovernanceAccountType["TokenOwnerRecordV2"] = 17] = "TokenOwnerRecordV2";
    GovernanceAccountType[GovernanceAccountType["GovernanceV2"] = 18] = "GovernanceV2";
    GovernanceAccountType[GovernanceAccountType["ProgramGovernanceV2"] = 19] = "ProgramGovernanceV2";
    GovernanceAccountType[GovernanceAccountType["MintGovernanceV2"] = 20] = "MintGovernanceV2";
    GovernanceAccountType[GovernanceAccountType["TokenGovernanceV2"] = 21] = "TokenGovernanceV2";
    GovernanceAccountType[GovernanceAccountType["SignatoryRecordV2"] = 22] = "SignatoryRecordV2";
    GovernanceAccountType[GovernanceAccountType["ProposalDeposit"] = 23] = "ProposalDeposit";
    GovernanceAccountType[GovernanceAccountType["RequiredSignatory"] = 24] = "RequiredSignatory";
    GovernanceAccountType[GovernanceAccountType["ProposalVersionedTransaction"] = 25] = "ProposalVersionedTransaction";
    GovernanceAccountType[GovernanceAccountType["ProposalTransactionBuffer"] = 26] = "ProposalTransactionBuffer";
})(GovernanceAccountType || (exports.GovernanceAccountType = GovernanceAccountType = {}));
function getAccountTypes(accountClass) {
    switch (accountClass) {
        case Realm:
            return [GovernanceAccountType.RealmV1, GovernanceAccountType.RealmV2];
        case TokenOwnerRecord:
            return [GovernanceAccountType.TokenOwnerRecordV1, GovernanceAccountType.TokenOwnerRecordV2];
        case Proposal:
            return [GovernanceAccountType.ProposalV1, GovernanceAccountType.ProposalV2];
        case ProposalDeposit:
            return [GovernanceAccountType.ProposalDeposit];
        case SignatoryRecord:
            return [GovernanceAccountType.SignatoryRecordV1, GovernanceAccountType.SignatoryRecordV2];
        case VoteRecord:
            return [GovernanceAccountType.VoteRecordV1, GovernanceAccountType.VoteRecordV2];
        case ProposalTransaction:
            return [GovernanceAccountType.ProposalInstructionV1, GovernanceAccountType.ProposalTransactionV2];
        case ProposalVersionedTransaction:
            return [GovernanceAccountType.ProposalVersionedTransaction, GovernanceAccountType.ProposalTransactionBuffer];
        case RealmConfigAccount:
            return [GovernanceAccountType.RealmConfig];
        case Governance:
            return [
                GovernanceAccountType.GovernanceV1,
                GovernanceAccountType.ProgramGovernanceV1,
                GovernanceAccountType.MintGovernanceV1,
                GovernanceAccountType.TokenGovernanceV1,
                GovernanceAccountType.GovernanceV2,
                GovernanceAccountType.ProgramGovernanceV2,
                GovernanceAccountType.MintGovernanceV2,
                GovernanceAccountType.TokenGovernanceV2,
            ];
        case ProgramMetadata:
            return [GovernanceAccountType.ProgramMetadata];
        default:
            throw Error(`${accountClass} account is not supported`);
    }
}
function getGovernanceAccountVersion(accountType) {
    switch (accountType) {
        case GovernanceAccountType.VoteRecordV2:
        case GovernanceAccountType.ProposalTransactionV2:
        case GovernanceAccountType.ProposalV2:
        case GovernanceAccountType.RealmV2:
        case GovernanceAccountType.TokenOwnerRecordV2:
        case GovernanceAccountType.GovernanceV2:
        case GovernanceAccountType.ProgramGovernanceV2:
        case GovernanceAccountType.MintGovernanceV2:
        case GovernanceAccountType.TokenGovernanceV2:
        case GovernanceAccountType.SignatoryRecordV2:
        case GovernanceAccountType.ProposalTransactionBuffer:
        case GovernanceAccountType.ProposalVersionedTransaction:
            return constants_1.ACCOUNT_VERSION_V2;
        default:
            return constants_1.ACCOUNT_VERSION_V1;
    }
}
var VoteThresholdType;
(function (VoteThresholdType) {
    // Approval Quorum
    VoteThresholdType[VoteThresholdType["YesVotePercentage"] = 0] = "YesVotePercentage";
    // Not supported in the current version
    VoteThresholdType[VoteThresholdType["QuorumPercentage"] = 1] = "QuorumPercentage";
    // Supported for VERSION >= 3
    VoteThresholdType[VoteThresholdType["Disabled"] = 2] = "Disabled";
})(VoteThresholdType || (exports.VoteThresholdType = VoteThresholdType = {}));
class VoteThreshold {
    constructor(args) {
        this.type = args.type;
        this.value = args.value;
    }
}
exports.VoteThreshold = VoteThreshold;
var VoteTipping;
(function (VoteTipping) {
    VoteTipping[VoteTipping["Strict"] = 0] = "Strict";
    VoteTipping[VoteTipping["Early"] = 1] = "Early";
    VoteTipping[VoteTipping["Disabled"] = 2] = "Disabled";
})(VoteTipping || (exports.VoteTipping = VoteTipping = {}));
var InstructionExecutionStatus;
(function (InstructionExecutionStatus) {
    InstructionExecutionStatus[InstructionExecutionStatus["None"] = 0] = "None";
    InstructionExecutionStatus[InstructionExecutionStatus["Success"] = 1] = "Success";
    InstructionExecutionStatus[InstructionExecutionStatus["Error"] = 2] = "Error";
})(InstructionExecutionStatus || (exports.InstructionExecutionStatus = InstructionExecutionStatus = {}));
var InstructionExecutionFlags;
(function (InstructionExecutionFlags) {
    InstructionExecutionFlags[InstructionExecutionFlags["None"] = 0] = "None";
    InstructionExecutionFlags[InstructionExecutionFlags["Ordered"] = 1] = "Ordered";
    InstructionExecutionFlags[InstructionExecutionFlags["UseTransaction"] = 2] = "UseTransaction";
})(InstructionExecutionFlags || (exports.InstructionExecutionFlags = InstructionExecutionFlags = {}));
var MintMaxVoteWeightSourceType;
(function (MintMaxVoteWeightSourceType) {
    MintMaxVoteWeightSourceType[MintMaxVoteWeightSourceType["SupplyFraction"] = 0] = "SupplyFraction";
    MintMaxVoteWeightSourceType[MintMaxVoteWeightSourceType["Absolute"] = 1] = "Absolute";
})(MintMaxVoteWeightSourceType || (exports.MintMaxVoteWeightSourceType = MintMaxVoteWeightSourceType = {}));
class MintMaxVoteWeightSource {
    constructor(args) {
        this.type = args.type;
        this.value = args.value;
    }
    isFullSupply() {
        return (this.type === MintMaxVoteWeightSourceType.SupplyFraction &&
            this.value.cmp(MintMaxVoteWeightSource.SUPPLY_FRACTION_BASE) === 0);
    }
    getSupplyFraction() {
        if (this.type !== MintMaxVoteWeightSourceType.SupplyFraction) {
            throw new Error("Max vote weight is not fraction");
        }
        return this.value;
    }
    fmtSupplyFractionPercentage() {
        return new bignumber_js_1.default(this.getSupplyFraction())
            .shiftedBy(-MintMaxVoteWeightSource.SUPPLY_FRACTION_DECIMALS + 2)
            .toFormat();
    }
}
exports.MintMaxVoteWeightSource = MintMaxVoteWeightSource;
MintMaxVoteWeightSource.SUPPLY_FRACTION_BASE = new bn_js_1.default(10000000000);
MintMaxVoteWeightSource.SUPPLY_FRACTION_DECIMALS = 10;
MintMaxVoteWeightSource.FULL_SUPPLY_FRACTION = new MintMaxVoteWeightSource({
    type: MintMaxVoteWeightSourceType.SupplyFraction,
    value: MintMaxVoteWeightSource.SUPPLY_FRACTION_BASE,
});
var VoteTypeKind;
(function (VoteTypeKind) {
    VoteTypeKind[VoteTypeKind["SingleChoice"] = 0] = "SingleChoice";
    VoteTypeKind[VoteTypeKind["MultiChoice"] = 1] = "MultiChoice";
})(VoteTypeKind || (exports.VoteTypeKind = VoteTypeKind = {}));
var MultiChoiceType;
(function (MultiChoiceType) {
    MultiChoiceType[MultiChoiceType["FullWeight"] = 0] = "FullWeight";
    MultiChoiceType[MultiChoiceType["Weighted"] = 1] = "Weighted";
})(MultiChoiceType || (exports.MultiChoiceType = MultiChoiceType = {}));
class VoteType {
    constructor(args) {
        this.type = args.type;
        this.choiceType = args.choiceType;
        this.minVoterOptions = args.minVoterOptions;
        this.maxVoterOptions = args.maxVoterOptions;
        this.maxWinningOptions = args.maxWinningOptions;
    }
    isSingleChoice() {
        return this.type === VoteTypeKind.SingleChoice;
    }
}
exports.VoteType = VoteType;
VoteType.SINGLE_CHOICE = new VoteType({
    type: VoteTypeKind.SingleChoice,
    choiceType: undefined,
    minVoterOptions: undefined,
    maxVoterOptions: undefined,
    maxWinningOptions: undefined,
});
VoteType.MULTI_CHOICE = (choiceType, minVoterOptions, maxVoterOptions, maxWinningOptions) => new VoteType({
    type: VoteTypeKind.MultiChoice,
    choiceType,
    minVoterOptions,
    maxVoterOptions,
    maxWinningOptions,
});
class RealmConfigArgs {
    constructor(args) {
        this.useCouncilMint = !!args.useCouncilMint;
        this.communityMintMaxVoteWeightSource = args.communityMintMaxVoteWeightSource;
        this.minCommunityTokensToCreateGovernance = args.minCommunityTokensToCreateGovernance;
        this.useCommunityVoterWeightAddin = args.useCommunityVoterWeightAddin;
        this.useMaxCommunityVoterWeightAddin = args.useMaxCommunityVoterWeightAddin;
        this.communityTokenConfigArgs = args.communityTokenConfigArgs;
        this.councilTokenConfigArgs = args.councilTokenConfigArgs;
    }
}
exports.RealmConfigArgs = RealmConfigArgs;
var GoverningTokenType;
(function (GoverningTokenType) {
    GoverningTokenType[GoverningTokenType["Liquid"] = 0] = "Liquid";
    GoverningTokenType[GoverningTokenType["Membership"] = 1] = "Membership";
    GoverningTokenType[GoverningTokenType["Dormant"] = 2] = "Dormant";
})(GoverningTokenType || (exports.GoverningTokenType = GoverningTokenType = {}));
class GoverningTokenConfigArgs {
    constructor(args) {
        this.useVoterWeightAddin = args.useVoterWeightAddin;
        this.useMaxVoterWeightAddin = args.useMaxVoterWeightAddin;
        this.tokenType = args.tokenType;
    }
}
exports.GoverningTokenConfigArgs = GoverningTokenConfigArgs;
class GoverningTokenConfigAccountArgs {
    constructor(args) {
        this.voterWeightAddin = args.voterWeightAddin;
        this.maxVoterWeightAddin = args.maxVoterWeightAddin;
        this.tokenType = args.tokenType;
    }
}
exports.GoverningTokenConfigAccountArgs = GoverningTokenConfigAccountArgs;
class RealmConfig {
    constructor(args) {
        this.councilMint = args.councilMint;
        this.communityMintMaxVoteWeightSource = args.communityMintMaxVoteWeightSource;
        this.minCommunityTokensToCreateGovernance = args.minCommunityTokensToCreateGovernance;
        this.useCommunityVoterWeightAddin = !!args.useCommunityVoterWeightAddin;
        this.useMaxCommunityVoterWeightAddin = !!args.useMaxCommunityVoterWeightAddin;
        this.reserved = args.reserved;
    }
}
exports.RealmConfig = RealmConfig;
class Realm {
    constructor(args) {
        this.accountType = GovernanceAccountType.RealmV1;
        this.communityMint = args.communityMint;
        this.config = args.config;
        this.reserved = args.reserved;
        this.votingProposalCount = args.votingProposalCount;
        this.authority = args.authority;
        this.name = args.name;
    }
}
exports.Realm = Realm;
async function getTokenHoldingAddress(programId, realm, governingTokenMint) {
    const [tokenHoldingAddress] = await web3_js_1.PublicKey.findProgramAddress([Buffer.from(exports.GOVERNANCE_PROGRAM_SEED), realm.toBuffer(), governingTokenMint.toBuffer()], programId);
    return tokenHoldingAddress;
}
class GoverningTokenConfig {
    constructor(args) {
        this.voterWeightAddin = args.voterWeightAddin;
        this.maxVoterWeightAddin = args.maxVoterWeightAddin;
        this.tokenType = args.tokenType;
        this.reserved = args.reserved;
    }
}
exports.GoverningTokenConfig = GoverningTokenConfig;
class RealmConfigAccount {
    constructor(args) {
        this.accountType = GovernanceAccountType.RealmConfig;
        this.realm = args.realm;
        this.communityTokenConfig = args.communityTokenConfig;
        this.councilTokenConfig = args.councilTokenConfig;
        this.reserved = args.reserved;
    }
}
exports.RealmConfigAccount = RealmConfigAccount;
async function getRealmConfigAddress(programId, realm) {
    const [realmConfigAddress] = await web3_js_1.PublicKey.findProgramAddress([Buffer.from("realm-config"), realm.toBuffer()], programId);
    return realmConfigAddress;
}
class GovernanceConfig {
    constructor(args) {
        var _a, _b, _c, _d, _e;
        this.communityVoteThreshold = args.communityVoteThreshold;
        this.minCommunityTokensToCreateProposal = args.minCommunityTokensToCreateProposal;
        this.minInstructionHoldUpTime = args.minInstructionHoldUpTime;
        this.baseVotingTime = args.baseVotingTime;
        this.communityVoteTipping = (_a = args.communityVoteTipping) !== null && _a !== void 0 ? _a : VoteTipping.Strict;
        this.minCouncilTokensToCreateProposal = args.minCouncilTokensToCreateProposal;
        // VERSION >= 3
        this.councilVoteThreshold = (_b = args.councilVoteThreshold) !== null && _b !== void 0 ? _b : args.communityVoteThreshold;
        this.councilVetoVoteThreshold = (_c = args.councilVetoVoteThreshold) !== null && _c !== void 0 ? _c : args.communityVoteThreshold;
        this.communityVetoVoteThreshold =
            (_d = args.communityVetoVoteThreshold) !== null && _d !== void 0 ? _d : new VoteThreshold({ type: VoteThresholdType.Disabled });
        this.councilVoteTipping = (_e = args.councilVoteTipping) !== null && _e !== void 0 ? _e : this.communityVoteTipping;
        this.votingCoolOffTime = args.votingCoolOffTime;
        this.depositExemptProposalCount = args.depositExemptProposalCount;
    }
}
exports.GovernanceConfig = GovernanceConfig;
class Governance {
    constructor(args) {
        this.accountType = args.accountType;
        this.realm = args.realm;
        this.governedAccount = args.governedAccount;
        this.config = args.config;
        this.reserved = args.reserved;
        this.proposalCount = args.proposalCount;
        this.activeProposalCount = args.activeProposalCount;
    }
    isProgramGovernance() {
        return (this.accountType === GovernanceAccountType.ProgramGovernanceV1 ||
            this.accountType === GovernanceAccountType.ProgramGovernanceV2);
    }
    isAccountGovernance() {
        return (this.accountType === GovernanceAccountType.GovernanceV1 || this.accountType === GovernanceAccountType.GovernanceV2);
    }
    isMintGovernance() {
        return (this.accountType === GovernanceAccountType.MintGovernanceV1 ||
            this.accountType === GovernanceAccountType.MintGovernanceV2);
    }
    isTokenGovernance() {
        return (this.accountType === GovernanceAccountType.TokenGovernanceV1 ||
            this.accountType === GovernanceAccountType.TokenGovernanceV2);
    }
}
exports.Governance = Governance;
class TokenOwnerRecord {
    constructor(args) {
        this.accountType = GovernanceAccountType.TokenOwnerRecordV1;
        this.realm = args.realm;
        this.governingTokenMint = args.governingTokenMint;
        this.governingTokenOwner = args.governingTokenOwner;
        this.governingTokenDepositAmount = args.governingTokenDepositAmount;
        this.unrelinquishedVotesCount = args.unrelinquishedVotesCount;
        this.totalVotesCount = args.totalVotesCount;
        this.outstandingProposalCount = args.outstandingProposalCount;
        this.reserved = args.reserved;
        this.governanceDelegate = args.governanceDelegate;
        this.version = args.version;
    }
}
exports.TokenOwnerRecord = TokenOwnerRecord;
async function getTokenOwnerRecordAddress(programId, realm, governingTokenMint, governingTokenOwner) {
    const [tokenOwnerRecordAddress] = await web3_js_1.PublicKey.findProgramAddress([
        Buffer.from(exports.GOVERNANCE_PROGRAM_SEED),
        realm.toBuffer(),
        governingTokenMint.toBuffer(),
        governingTokenOwner.toBuffer(),
    ], programId);
    return tokenOwnerRecordAddress;
}
var ProposalState;
(function (ProposalState) {
    ProposalState[ProposalState["Draft"] = 0] = "Draft";
    ProposalState[ProposalState["SigningOff"] = 1] = "SigningOff";
    ProposalState[ProposalState["Voting"] = 2] = "Voting";
    ProposalState[ProposalState["Succeeded"] = 3] = "Succeeded";
    ProposalState[ProposalState["Executing"] = 4] = "Executing";
    ProposalState[ProposalState["Completed"] = 5] = "Completed";
    ProposalState[ProposalState["Cancelled"] = 6] = "Cancelled";
    ProposalState[ProposalState["Defeated"] = 7] = "Defeated";
    ProposalState[ProposalState["ExecutingWithErrors"] = 8] = "ExecutingWithErrors";
    ProposalState[ProposalState["Vetoed"] = 9] = "Vetoed";
})(ProposalState || (exports.ProposalState = ProposalState = {}));
var OptionVoteResult;
(function (OptionVoteResult) {
    OptionVoteResult[OptionVoteResult["None"] = 0] = "None";
    OptionVoteResult[OptionVoteResult["Succeeded"] = 1] = "Succeeded";
    OptionVoteResult[OptionVoteResult["Defeated"] = 2] = "Defeated";
})(OptionVoteResult || (exports.OptionVoteResult = OptionVoteResult = {}));
class ProposalOption {
    constructor(args) {
        this.label = args.label;
        this.voteWeight = args.voteWeight;
        this.voteResult = args.voteResult;
        this.instructionsExecutedCount = args.instructionsExecutedCount;
        this.instructionsCount = args.instructionsCount;
        this.instructionsNextIndex = args.instructionsNextIndex;
    }
}
exports.ProposalOption = ProposalOption;
class Proposal {
    constructor(args) {
        this.accountType = args.accountType;
        this.governance = args.governance;
        this.governingTokenMint = args.governingTokenMint;
        this.state = args.state;
        this.tokenOwnerRecord = args.tokenOwnerRecord;
        this.signatoriesCount = args.signatoriesCount;
        this.signatoriesSignedOffCount = args.signatoriesSignedOffCount;
        this.descriptionLink = args.descriptionLink;
        this.name = args.name;
        // V1
        this.yesVotesCount = args.yesVotesCount;
        this.noVotesCount = args.noVotesCount;
        this.instructionsExecutedCount = args.instructionsExecutedCount;
        this.instructionsCount = args.instructionsCount;
        this.instructionsNextIndex = args.instructionsNextIndex;
        //
        // V2
        this.voteType = args.voteType;
        this.options = args.options;
        this.denyVoteWeight = args.denyVoteWeight;
        this.reserved1 = args.reserved1;
        this.abstainVoteWeight = args.abstainVoteWeight;
        this.startVotingAt = args.startVotingAt;
        this.maxVotingTime = args.maxVotingTime;
        this.draftAt = args.draftAt;
        this.signingOffAt = args.signingOffAt;
        this.votingAt = args.votingAt;
        this.votingAtSlot = args.votingAtSlot;
        this.votingCompletedAt = args.votingCompletedAt;
        this.executingAt = args.executingAt;
        this.closedAt = args.closedAt;
        this.executionFlags = args.executionFlags;
        this.maxVoteWeight = args.maxVoteWeight;
        this.voteThreshold = args.voteThreshold;
        // V3
        this.vetoVoteWeight = args.vetoVoteWeight;
    }
    /// Returns true if Proposal is in state when no voting can happen any longer
    isVoteFinalized() {
        switch (this.state) {
            case ProposalState.Succeeded:
            case ProposalState.Executing:
            case ProposalState.Completed:
            case ProposalState.Cancelled:
            case ProposalState.Defeated:
            case ProposalState.ExecutingWithErrors:
            case ProposalState.Vetoed:
                return true;
            case ProposalState.Draft:
            case ProposalState.SigningOff:
            case ProposalState.Voting:
                return false;
        }
    }
    isFinalState() {
        // 1) ExecutingWithErrors is not really a final state, it's undefined.
        //    However it usually indicates none recoverable execution error so we treat is as final for the ui purposes
        // 2) Succeeded with no instructions is also treated as final since it can't transition any longer
        //    It really doesn't make any sense but until it's solved in the program we have to consider it as final in the ui
        switch (this.state) {
            case ProposalState.Completed:
            case ProposalState.Cancelled:
            case ProposalState.Defeated:
            case ProposalState.ExecutingWithErrors:
            case ProposalState.Vetoed:
                return true;
            case ProposalState.Succeeded:
                return this.instructionsCount === 0;
            case ProposalState.Executing:
            case ProposalState.Draft:
            case ProposalState.SigningOff:
            case ProposalState.Voting:
                return false;
        }
    }
    getStateTimestamp() {
        switch (this.state) {
            case ProposalState.Succeeded:
            case ProposalState.Defeated:
            case ProposalState.Vetoed:
                return this.votingCompletedAt ? this.votingCompletedAt.toNumber() : 0;
            case ProposalState.Completed:
            case ProposalState.Cancelled:
                return this.closedAt ? this.closedAt.toNumber() : 0;
            case ProposalState.Executing:
            case ProposalState.ExecutingWithErrors:
                return this.executingAt ? this.executingAt.toNumber() : 0;
            case ProposalState.Draft:
                return this.draftAt.toNumber();
            case ProposalState.SigningOff:
                return this.signingOffAt ? this.signingOffAt.toNumber() : 0;
            case ProposalState.Voting:
                return this.votingAt ? this.votingAt.toNumber() : 0;
        }
    }
    getStateSortRank() {
        // Always show proposals in voting state at the top
        if (this.state === ProposalState.Voting) {
            return 2;
        }
        // Then show proposals in pending state and finalized at the end
        return this.isFinalState() ? 0 : 1;
    }
    /// Returns true if Proposal has not been voted on yet
    isPreVotingState() {
        return !this.votingAtSlot;
    }
    getYesVoteOption() {
        if (this.options.length !== 1 && !this.voteType.isSingleChoice()) {
            throw new Error("Proposal is not Yes/No vote");
        }
        return this.options[0];
    }
    getYesVoteCount() {
        switch (this.accountType) {
            case GovernanceAccountType.ProposalV1:
                return this.yesVotesCount;
            case GovernanceAccountType.ProposalV2:
                return this.getYesVoteOption().voteWeight;
            default:
                throw new Error(`Invalid account type ${this.accountType}`);
        }
    }
    getNoVoteCount() {
        switch (this.accountType) {
            case GovernanceAccountType.ProposalV1:
                return this.noVotesCount;
            case GovernanceAccountType.ProposalV2:
                return this.denyVoteWeight;
            default:
                throw new Error(`Invalid account type ${this.accountType}`);
        }
    }
    getTimeToVoteEnd(governance) {
        var _a, _b;
        const unixTimestampInSeconds = Date.now() / 1000;
        const baseVotingTime = this.isPreVotingState()
            ? governance.config.baseVotingTime
            : ((_b = (_a = this.votingAt) === null || _a === void 0 ? void 0 : _a.toNumber()) !== null && _b !== void 0 ? _b : 0) + governance.config.baseVotingTime - unixTimestampInSeconds;
        return baseVotingTime + governance.config.votingCoolOffTime;
    }
    hasVoteTimeEnded(governance) {
        return this.getTimeToVoteEnd(governance) <= 0;
    }
    canCancel(governance) {
        if (this.state === ProposalState.Draft || this.state === ProposalState.SigningOff) {
            return true;
        }
        if (this.state === ProposalState.Voting && !this.hasVoteTimeEnded(governance)) {
            return true;
        }
        return false;
    }
    canWalletCancel(governance, proposalOwner, walletPk) {
        var _a;
        if (!this.canCancel(governance)) {
            return false;
        }
        return proposalOwner.governingTokenOwner.equals(walletPk) || ((_a = proposalOwner.governanceDelegate) === null || _a === void 0 ? void 0 : _a.equals(walletPk));
    }
}
exports.Proposal = Proposal;
class ProposalDeposit {
    constructor(args) {
        this.accountType = GovernanceAccountType.ProposalDeposit;
        this.proposal = args.proposal;
        this.depositPayer = args.depositPayer;
    }
}
exports.ProposalDeposit = ProposalDeposit;
class SignatoryRecord {
    constructor(args) {
        this.accountType = GovernanceAccountType.SignatoryRecordV1;
        this.proposal = args.proposal;
        this.signatory = args.signatory;
        this.signedOff = !!args.signedOff;
    }
}
exports.SignatoryRecord = SignatoryRecord;
async function getSignatoryRecordAddress(programId, proposal, signatory) {
    const [signatoryRecordAddress] = await web3_js_1.PublicKey.findProgramAddress([Buffer.from(exports.GOVERNANCE_PROGRAM_SEED), proposal.toBuffer(), signatory.toBuffer()], programId);
    return signatoryRecordAddress;
}
class VoteWeight {
    constructor(args) {
        this.yes = args.yes;
        this.no = args.no;
    }
}
exports.VoteWeight = VoteWeight;
class VoteRecord {
    // -------------------------------
    constructor(args) {
        this.accountType = args.accountType;
        this.proposal = args.proposal;
        this.governingTokenOwner = args.governingTokenOwner;
        this.isRelinquished = !!args.isRelinquished;
        // V1
        this.voteWeight = args.voteWeight;
        // V2 -------------------------------
        this.voterWeight = args.voterWeight;
        this.vote = args.vote;
        // -------------------------------
    }
    getNoVoteWeight() {
        var _a, _b;
        switch (this.accountType) {
            case GovernanceAccountType.VoteRecordV1: {
                return (_a = this.voteWeight) === null || _a === void 0 ? void 0 : _a.no;
            }
            case GovernanceAccountType.VoteRecordV2: {
                switch ((_b = this.vote) === null || _b === void 0 ? void 0 : _b.voteType) {
                    case instructions_1.VoteKind.Approve: {
                        return undefined;
                    }
                    case instructions_1.VoteKind.Deny: {
                        return this.voterWeight;
                    }
                    default:
                        throw new Error("Invalid voteKind");
                }
            }
            default:
                throw new Error(`Invalid account type ${this.accountType} `);
        }
    }
    getYesVoteWeight() {
        var _a, _b;
        switch (this.accountType) {
            case GovernanceAccountType.VoteRecordV1: {
                return (_a = this.voteWeight) === null || _a === void 0 ? void 0 : _a.yes;
            }
            case GovernanceAccountType.VoteRecordV2: {
                switch ((_b = this.vote) === null || _b === void 0 ? void 0 : _b.voteType) {
                    case instructions_1.VoteKind.Approve: {
                        return this.voterWeight;
                    }
                    case instructions_1.VoteKind.Deny: {
                        return undefined;
                    }
                    default:
                        throw new Error("Invalid voteKind");
                }
            }
            default:
                throw new Error(`Invalid account type ${this.accountType} `);
        }
    }
}
exports.VoteRecord = VoteRecord;
async function getVoteRecordAddress(programId, proposal, tokenOwnerRecord) {
    const [voteRecordAddress] = await web3_js_1.PublicKey.findProgramAddress([Buffer.from(exports.GOVERNANCE_PROGRAM_SEED), proposal.toBuffer(), tokenOwnerRecord.toBuffer()], programId);
    return voteRecordAddress;
}
class AccountMetaData {
    constructor(args) {
        this.pubkey = args.pubkey;
        this.isSigner = !!args.isSigner;
        this.isWritable = !!args.isWritable;
    }
}
exports.AccountMetaData = AccountMetaData;
class InstructionData {
    constructor(args) {
        this.programId = args.programId;
        this.accounts = args.accounts;
        this.data = args.data;
    }
}
exports.InstructionData = InstructionData;
class ProposalTransaction {
    constructor(args) {
        this.accountType = args.accountType;
        this.proposal = args.proposal;
        this.instructionIndex = args.instructionIndex;
        this.optionIndex = args.optionIndex;
        this.holdUpTime = args.holdUpTime;
        this.instruction = args.instruction;
        this.executedAt = args.executedAt;
        this.executionStatus = args.executionStatus;
        this.instructions = args.instructions;
    }
    getSingleInstruction() {
        if (this.accountType === GovernanceAccountType.ProposalInstructionV1) {
            return this.instruction;
        }
        if (this.instructions.length === 0) {
            throw new Error("Transaction has no instructions");
        }
        if (this.instructions.length > 1) {
            throw new Error("Transaction has multiple instructions");
        }
        return this.instructions[0];
    }
    getAllInstructions() {
        if (this.accountType === GovernanceAccountType.ProposalInstructionV1) {
            return [this.instruction];
        }
        return this.instructions;
    }
}
exports.ProposalTransaction = ProposalTransaction;
class ProposalTransactionBuffer {
    constructor(args) {
        // Validate buffer hash length
        if (args.finalBufferHash.length !== 32) {
            throw new Error("Final buffer hash must be 32 bytes");
        }
        this.accountType = args.accountType;
        this.proposal = args.proposal;
        this.creator = args.creator;
        this.bufferIndex = args.bufferIndex;
        this.finalBufferHash = args.finalBufferHash;
        this.finalBufferSize = args.finalBufferSize;
        this.buffer = args.buffer;
    }
    validateBuffer() {
        return this.buffer.length === this.finalBufferSize;
    }
    // Method to serialize the buffer for on-chain storage
    serialize() {
        // Implementation would depend on your specific serialization needs
        // This is a basic example
        const serialized = new Uint8Array(this.buffer.length + 40); // 40 bytes for metadata
        let offset = 0;
        // Write metadata
        serialized.set([this.accountType], offset);
        offset += 1;
        serialized.set(this.proposal.toBytes(), offset);
        offset += 32;
        serialized.set([this.bufferIndex], offset);
        offset += 1;
        serialized.set(new Uint8Array(new Uint16Array([this.finalBufferSize]).buffer), offset);
        offset += 2;
        // Write buffer content
        serialized.set(this.buffer, offset);
        return serialized;
    }
}
exports.ProposalTransactionBuffer = ProposalTransactionBuffer;
// Enum for transaction execution status
var TransactionExecutionStatus;
(function (TransactionExecutionStatus) {
    TransactionExecutionStatus["None"] = "None";
    TransactionExecutionStatus["Success"] = "Success";
    TransactionExecutionStatus["Error"] = "Error";
})(TransactionExecutionStatus || (exports.TransactionExecutionStatus = TransactionExecutionStatus = {}));
class VersionedTransactionMessageAddressTableLookup {
    constructor(args) {
        this.accountKey = args.accountKey;
        this.writableIndexes = args.writableIndexes;
        this.readonlyIndexes = args.readonlyIndexes;
    }
}
exports.VersionedTransactionMessageAddressTableLookup = VersionedTransactionMessageAddressTableLookup;
class ProposalCompiledInstruction {
    constructor(args) {
        for (const index of args.accountIndexes) {
            if (index > 255) {
                throw new Error("Account indexes must be u8 (0-255)");
            }
        }
        this.programIdIndex = args.programIdIndex;
        this.accountIndexes = args.accountIndexes;
        this.data = args.data;
    }
    getProgramIdIndex() {
        return this.programIdIndex;
    }
    getAccountIndexes() {
        return this.accountIndexes;
    }
    getData() {
        return this.data;
    }
    serialize() {
        // Layout:
        // 1 byte - programIdIndex (u8)
        // 4 bytes - accountIndexes length (u32)
        // N bytes - accountIndexes array
        // 4 bytes - data length (u32)
        // M bytes - data array
        const buffer = new Uint8Array(1 + 4 + this.accountIndexes.length + 4 + this.data.length);
        let offset = 0;
        // Write programIdIndex
        buffer[offset] = this.programIdIndex;
        offset += 1;
        // Write accountIndexes length (u32)
        buffer[offset++] = this.accountIndexes.length & 0xff;
        buffer[offset++] = (this.accountIndexes.length >> 8) & 0xff;
        buffer[offset++] = (this.accountIndexes.length >> 16) & 0xff;
        buffer[offset++] = (this.accountIndexes.length >> 24) & 0xff;
        // Write accountIndexes
        buffer.set(this.accountIndexes, offset);
        offset += this.accountIndexes.length;
        // Write data length (u32)
        buffer[offset++] = this.data.length & 0xff;
        buffer[offset++] = (this.data.length >> 8) & 0xff;
        buffer[offset++] = (this.data.length >> 16) & 0xff;
        buffer[offset++] = (this.data.length >> 24) & 0xff;
        // Write data
        buffer.set(this.data, offset);
        return buffer;
    }
}
exports.ProposalCompiledInstruction = ProposalCompiledInstruction;
// Class for transaction message
class ProposalTransactionMessage {
    constructor(args) {
        if (args.numSigners > 255)
            throw new Error("Number of signers must be a u8 (0-255)");
        if (args.numWritableSigners > 255)
            throw new Error("Number of writable signers must be a u8 (0-255)");
        if (args.numWritableNonSigners > 255)
            throw new Error("Number of writable non-signers must be a u8 (0-255)");
        this.numSigners = args.numSigners;
        this.numWritableSigners = args.numWritableSigners;
        this.numWritableNonSigners = args.numWritableNonSigners;
        this.accountKeys = args.accountKeys;
        this.instructions = args.instructions;
        this.addressTableLookups = args.addressTableLookups;
    }
    getNumSigners() {
        return this.numSigners;
    }
    getNumWritableSigners() {
        return this.numWritableSigners;
    }
    getNumWritableNonSigners() {
        return this.numWritableNonSigners;
    }
    getAccountKeys() {
        return this.accountKeys;
    }
    getInstructions() {
        return this.instructions;
    }
    getAddressTableLookups() {
        return this.addressTableLookups;
    }
    serialize() {
        // Calculate total size needed
        const accountKeysSize = this.accountKeys.length * 32; // Each PublicKey is 32 bytes
        const instructionsSize = this.instructions.reduce((sum, instruction) => sum + instruction.serialize().length, 0);
        const addressTableLookupsSize = this.addressTableLookups.reduce((sum, lookup) => sum + 32 + 4 + lookup.writableIndexes.length + 4 + lookup.readonlyIndexes.length, 0);
        // 3 bytes for the header numbers (numSigners, numWritableSigners, numWritableNonSigners)
        // 4 bytes for number of account keys
        // 4 bytes for number of instructions
        // 4 bytes for number of address table lookups
        const headerSize = 3 + 4 + 4 + 4;
        const totalSize = headerSize + accountKeysSize + instructionsSize + addressTableLookupsSize;
        const buffer = new Uint8Array(totalSize);
        let offset = 0;
        // Write header
        buffer[offset++] = this.numSigners;
        buffer[offset++] = this.numWritableSigners;
        buffer[offset++] = this.numWritableNonSigners;
        // Write account keys length (u32)
        buffer[offset++] = this.accountKeys.length & 0xff;
        buffer[offset++] = (this.accountKeys.length >> 8) & 0xff;
        buffer[offset++] = (this.accountKeys.length >> 16) & 0xff;
        buffer[offset++] = (this.accountKeys.length >> 24) & 0xff;
        // Write account keys
        for (const key of this.accountKeys) {
            buffer.set(key.toBytes(), offset);
            offset += 32;
        }
        // Write instructions length (u32)
        buffer[offset++] = this.instructions.length & 0xff;
        buffer[offset++] = (this.instructions.length >> 8) & 0xff;
        buffer[offset++] = (this.instructions.length >> 16) & 0xff;
        buffer[offset++] = (this.instructions.length >> 24) & 0xff;
        // Write instructions
        for (const instruction of this.instructions) {
            const serializedInstruction = instruction.serialize();
            buffer.set(serializedInstruction, offset);
            offset += serializedInstruction.length;
        }
        // Write address table lookups length (u32)
        buffer[offset++] = this.addressTableLookups.length & 0xff;
        buffer[offset++] = (this.addressTableLookups.length >> 8) & 0xff;
        buffer[offset++] = (this.addressTableLookups.length >> 16) & 0xff;
        buffer[offset++] = (this.addressTableLookups.length >> 24) & 0xff;
        // Write address table lookups
        for (const lookup of this.addressTableLookups) {
            // Write account key
            buffer.set(lookup.accountKey.toBytes(), offset);
            offset += 32;
            // Write writable indexes
            buffer[offset++] = lookup.writableIndexes.length & 0xff;
            buffer[offset++] = (lookup.writableIndexes.length >> 8) & 0xff;
            buffer[offset++] = (lookup.writableIndexes.length >> 16) & 0xff;
            buffer[offset++] = (lookup.writableIndexes.length >> 24) & 0xff;
            buffer.set(new Uint8Array(lookup.writableIndexes), offset);
            offset += lookup.writableIndexes.length;
            // Write readonly indexes
            buffer[offset++] = lookup.readonlyIndexes.length & 0xff;
            buffer[offset++] = (lookup.readonlyIndexes.length >> 8) & 0xff;
            buffer[offset++] = (lookup.readonlyIndexes.length >> 16) & 0xff;
            buffer[offset++] = (lookup.readonlyIndexes.length >> 24) & 0xff;
            buffer.set(new Uint8Array(lookup.readonlyIndexes), offset);
            offset += lookup.readonlyIndexes.length;
        }
        return buffer;
    }
}
exports.ProposalTransactionMessage = ProposalTransactionMessage;
// Main class for versioned transaction
class ProposalVersionedTransaction {
    constructor(args) {
        if (args.optionIndex > 255)
            throw new Error("Option index must be a u8 (0-255)");
        if (args.transactionIndex > 65535)
            throw new Error("Transaction index must be a u16 (0-65535)");
        if (args.executionIndex > 255)
            throw new Error("Execution index must be a u8 (0-255)");
        for (const bump of args.ephemeralSignerBumps) {
            if (bump > 255)
                throw new Error("Ephemeral signer bumps must be u8 (0-255)");
        }
        this.accountType = args.accountType;
        this.proposal = args.proposal;
        this.optionIndex = args.optionIndex;
        this.transactionIndex = args.transactionIndex;
        this.executionIndex = args.executionIndex;
        this.executedAt = args.executedAt;
        this.executionStatus = args.executionStatus;
        this.ephemeralSignerBumps = args.ephemeralSignerBumps;
        this.message = args.message;
    }
    getAccountType() {
        return this.accountType;
    }
    getProposal() {
        return this.proposal;
    }
    getOptionIndex() {
        return this.optionIndex;
    }
    getTransactionIndex() {
        return this.transactionIndex;
    }
    getExecutionIndex() {
        return this.executionIndex;
    }
    getExecutedAt() {
        return this.executedAt;
    }
    getExecutionStatus() {
        return this.executionStatus;
    }
    getEphemeralSignerBumps() {
        return this.ephemeralSignerBumps;
    }
    getMessage() {
        return this.message;
    }
    isExecuted() {
        return this.executionStatus === TransactionExecutionStatus.Success;
    }
    hasError() {
        return this.executionStatus === TransactionExecutionStatus.Error;
    }
    getAllSigners() {
        return this.message.getAccountKeys().slice(0, this.message.getNumSigners());
    }
    getWritableAccounts() {
        const writableCount = this.message.getNumWritableSigners() + this.message.getNumWritableNonSigners();
        return this.message.getAccountKeys().slice(0, writableCount);
    }
}
exports.ProposalVersionedTransaction = ProposalVersionedTransaction;
function getProposalTransactionAddress(programId, programVersion, proposal, optionIndex, transactionIndex) {
    const optionIndexBuffer = Buffer.alloc(1);
    optionIndexBuffer.writeUInt8(optionIndex);
    const instructionIndexBuffer = Buffer.alloc(2);
    instructionIndexBuffer.writeInt16LE(transactionIndex, 0);
    const seeds = programVersion === constants_1.PROGRAM_VERSION_V1
        ? [Buffer.from(exports.GOVERNANCE_PROGRAM_SEED), proposal.toBuffer(), instructionIndexBuffer]
        : [Buffer.from(exports.GOVERNANCE_PROGRAM_SEED), proposal.toBuffer(), optionIndexBuffer, instructionIndexBuffer];
    const [instructionAddress] = web3_js_1.PublicKey.findProgramAddressSync(seeds, programId);
    return instructionAddress;
}
class ProgramMetadata {
    constructor(args) {
        this.accountType = GovernanceAccountType.ProgramMetadata;
        this.updatedAt = args.updatedAt;
        this.reserved = args.reserved;
        this.version = args.version;
    }
}
exports.ProgramMetadata = ProgramMetadata;
async function getProgramMetadataAddress(programId) {
    const [signatoryRecordAddress] = await web3_js_1.PublicKey.findProgramAddress([Buffer.from("metadata")], programId);
    return signatoryRecordAddress;
}
async function getNativeTreasuryAddress(programId, governance) {
    const [signatoryRecordAddress] = await web3_js_1.PublicKey.findProgramAddress([Buffer.from("native-treasury"), governance.toBuffer()], programId);
    return signatoryRecordAddress;
}
async function getGoverningTokenHoldingAddress(programId, realm, governingTokenMint) {
    const [governingTokenHoldingAddress] = await web3_js_1.PublicKey.findProgramAddress([Buffer.from(exports.GOVERNANCE_PROGRAM_SEED), realm.toBuffer(), governingTokenMint.toBuffer()], programId);
    return governingTokenHoldingAddress;
}
async function getProposalDepositAddress(programId, proposal, proposalDepositPayer) {
    const [proposalDepositAddress] = await web3_js_1.PublicKey.findProgramAddress([Buffer.from("proposal-deposit"), proposal.toBuffer(), proposalDepositPayer.toBuffer()], programId);
    return proposalDepositAddress;
}
function getEphemeralSignerPda({ transactionProposalPda, transactionIndex, ephemeralSignerIndex, programId, }) {
    const transactionIndexBuffer = Buffer.alloc(2);
    transactionIndexBuffer.writeInt16LE(transactionIndex, 0);
    const ephemeralSignerIndexBuffer = Buffer.alloc(1);
    ephemeralSignerIndexBuffer.writeUInt8(ephemeralSignerIndex);
    return web3_js_1.PublicKey.findProgramAddressSync([
        Buffer.from("version_transaction"),
        transactionProposalPda.toBytes(),
        Buffer.from("ephemeral_signer"),
        transactionIndexBuffer,
        ephemeralSignerIndexBuffer,
    ], programId);
}
function getProposalVersionedTransactionAddress(programId, proposal, optionIndex, transactionIndex) {
    const optionIndexBuffer = Buffer.alloc(1);
    optionIndexBuffer.writeUInt8(optionIndex);
    const transactionIndexBuffer = Buffer.alloc(2);
    transactionIndexBuffer.writeInt16LE(transactionIndex, 0);
    const seeds = [Buffer.from("version_transaction"), proposal.toBuffer(), optionIndexBuffer, transactionIndexBuffer];
    const [instructionAddress] = web3_js_1.PublicKey.findProgramAddressSync(seeds, programId);
    return instructionAddress;
}
function getProposalTransactionBufferAddress(programId, proposal, creator, bufferIndex) {
    const bufferIndexBuffer = Buffer.alloc(1);
    bufferIndexBuffer.writeUInt8(bufferIndex, 0);
    const seeds = [Buffer.from("transaction_buffer"), proposal.toBuffer(), creator.toBuffer(), bufferIndexBuffer];
    const [transactionBufferAddress] = web3_js_1.PublicKey.findProgramAddressSync(seeds, programId);
    return transactionBufferAddress;
}
//# sourceMappingURL=accounts.js.map