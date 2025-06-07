"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecuteVersionedTransactionArgs = exports.InsertVersionedTransactionArgs = exports.InsertVersionedTransactionFromBufferArgs = exports.CloseTransactionBufferArgs = exports.ExtendTransactionBufferArgs = exports.CreateTransactionBufferArgs = exports.RefundProposalDepositArgs = exports.RevokeGoverningTokensArgs = exports.SetGovernanceDelegateArgs = exports.CreateNativeTreasuryArgs = exports.UpdateProgramMetadataArgs = exports.CreateTokenOwnerRecordArgs = exports.SetRealmConfigArgs = exports.SetRealmAuthorityArgs = exports.SetRealmAuthorityAction = exports.FlagTransactionErrorArgs = exports.ExecuteTransactionArgs = exports.RemoveTransactionArgs = exports.InsertTransactionArgs = exports.FinalizeVoteArgs = exports.RelinquishVoteArgs = exports.CastVoteArgs = exports.Vote = exports.VoteKind = exports.VoteChoice = exports.YesNoVote = exports.CancelProposalArgs = exports.SignOffProposalArgs = exports.AddSignatoryArgs = exports.CreateProposalArgs = exports.SetGovernanceConfigArgs = exports.CreateTokenGovernanceArgs = exports.CreateMintGovernanceArgs = exports.CreateProgramGovernanceArgs = exports.CreateGovernanceArgs = exports.WithdrawGoverningTokensArgs = exports.DepositGoverningTokensArgs = exports.CreateRealmArgs = exports.GovernanceInstruction = void 0;
var GovernanceInstruction;
(function (GovernanceInstruction) {
    GovernanceInstruction[GovernanceInstruction["CreateRealm"] = 0] = "CreateRealm";
    GovernanceInstruction[GovernanceInstruction["DepositGoverningTokens"] = 1] = "DepositGoverningTokens";
    GovernanceInstruction[GovernanceInstruction["WithdrawGoverningTokens"] = 2] = "WithdrawGoverningTokens";
    GovernanceInstruction[GovernanceInstruction["SetGovernanceDelegate"] = 3] = "SetGovernanceDelegate";
    GovernanceInstruction[GovernanceInstruction["CreateGovernance"] = 4] = "CreateGovernance";
    GovernanceInstruction[GovernanceInstruction["CreateProgramGovernanceDeprecated"] = 5] = "CreateProgramGovernanceDeprecated";
    GovernanceInstruction[GovernanceInstruction["CreateProposal"] = 6] = "CreateProposal";
    GovernanceInstruction[GovernanceInstruction["AddSignatory"] = 7] = "AddSignatory";
    GovernanceInstruction[GovernanceInstruction["RemoveSignatory"] = 8] = "RemoveSignatory";
    GovernanceInstruction[GovernanceInstruction["InsertTransaction"] = 9] = "InsertTransaction";
    GovernanceInstruction[GovernanceInstruction["RemoveTransaction"] = 10] = "RemoveTransaction";
    GovernanceInstruction[GovernanceInstruction["CancelProposal"] = 11] = "CancelProposal";
    GovernanceInstruction[GovernanceInstruction["SignOffProposal"] = 12] = "SignOffProposal";
    GovernanceInstruction[GovernanceInstruction["CastVote"] = 13] = "CastVote";
    GovernanceInstruction[GovernanceInstruction["FinalizeVote"] = 14] = "FinalizeVote";
    GovernanceInstruction[GovernanceInstruction["RelinquishVote"] = 15] = "RelinquishVote";
    GovernanceInstruction[GovernanceInstruction["ExecuteTransaction"] = 16] = "ExecuteTransaction";
    GovernanceInstruction[GovernanceInstruction["CreateMintGovernanceDeprecated"] = 17] = "CreateMintGovernanceDeprecated";
    GovernanceInstruction[GovernanceInstruction["CreateTokenGovernanceDeprecated"] = 18] = "CreateTokenGovernanceDeprecated";
    GovernanceInstruction[GovernanceInstruction["SetGovernanceConfig"] = 19] = "SetGovernanceConfig";
    GovernanceInstruction[GovernanceInstruction["FlagTransactionError"] = 20] = "FlagTransactionError";
    GovernanceInstruction[GovernanceInstruction["SetRealmAuthority"] = 21] = "SetRealmAuthority";
    GovernanceInstruction[GovernanceInstruction["SetRealmConfig"] = 22] = "SetRealmConfig";
    GovernanceInstruction[GovernanceInstruction["CreateTokenOwnerRecord"] = 23] = "CreateTokenOwnerRecord";
    GovernanceInstruction[GovernanceInstruction["UpdateProgramMetadata"] = 24] = "UpdateProgramMetadata";
    GovernanceInstruction[GovernanceInstruction["CreateNativeTreasury"] = 25] = "CreateNativeTreasury";
    GovernanceInstruction[GovernanceInstruction["RevokeGoverningTokens"] = 26] = "RevokeGoverningTokens";
    GovernanceInstruction[GovernanceInstruction["RefundProposalDeposit"] = 27] = "RefundProposalDeposit";
    GovernanceInstruction[GovernanceInstruction["CompleteProposal"] = 28] = "CompleteProposal";
    GovernanceInstruction[GovernanceInstruction["AddRequiredSignatory"] = 29] = "AddRequiredSignatory";
    GovernanceInstruction[GovernanceInstruction["RemoveRequiredSignatory"] = 30] = "RemoveRequiredSignatory";
    GovernanceInstruction[GovernanceInstruction["CreateTransactionBuffer"] = 31] = "CreateTransactionBuffer";
    GovernanceInstruction[GovernanceInstruction["ExtendTransactionBuffer"] = 32] = "ExtendTransactionBuffer";
    GovernanceInstruction[GovernanceInstruction["CloseTransactionBuffer"] = 33] = "CloseTransactionBuffer";
    GovernanceInstruction[GovernanceInstruction["InsertVersionedTransactionFromBuffer"] = 34] = "InsertVersionedTransactionFromBuffer";
    GovernanceInstruction[GovernanceInstruction["InsertVersionedTransaction"] = 35] = "InsertVersionedTransaction";
    GovernanceInstruction[GovernanceInstruction["ExecuteVersionedTransaction"] = 36] = "ExecuteVersionedTransaction";
    GovernanceInstruction[GovernanceInstruction["RemoveVersionedTransaction"] = 37] = "RemoveVersionedTransaction";
})(GovernanceInstruction || (exports.GovernanceInstruction = GovernanceInstruction = {}));
class CreateRealmArgs {
    constructor(args) {
        this.instruction = GovernanceInstruction.CreateRealm;
        this.name = args.name;
        this.configArgs = args.configArgs;
    }
}
exports.CreateRealmArgs = CreateRealmArgs;
class DepositGoverningTokensArgs {
    constructor(args) {
        this.instruction = GovernanceInstruction.DepositGoverningTokens;
        this.amount = args.amount;
    }
}
exports.DepositGoverningTokensArgs = DepositGoverningTokensArgs;
class WithdrawGoverningTokensArgs {
    constructor() {
        this.instruction = GovernanceInstruction.WithdrawGoverningTokens;
    }
}
exports.WithdrawGoverningTokensArgs = WithdrawGoverningTokensArgs;
class CreateGovernanceArgs {
    constructor(args) {
        this.instruction = GovernanceInstruction.CreateGovernance;
        this.config = args.config;
    }
}
exports.CreateGovernanceArgs = CreateGovernanceArgs;
class CreateProgramGovernanceArgs {
    constructor(args) {
        this.instruction = GovernanceInstruction.CreateProgramGovernanceDeprecated;
        this.config = args.config;
        this.transferUpgradeAuthority = !!args.transferUpgradeAuthority;
    }
}
exports.CreateProgramGovernanceArgs = CreateProgramGovernanceArgs;
class CreateMintGovernanceArgs {
    constructor(args) {
        this.instruction = GovernanceInstruction.CreateMintGovernanceDeprecated;
        this.config = args.config;
        this.transferMintAuthorities = !!args.transferMintAuthorities;
    }
}
exports.CreateMintGovernanceArgs = CreateMintGovernanceArgs;
class CreateTokenGovernanceArgs {
    constructor(args) {
        this.instruction = GovernanceInstruction.CreateTokenGovernanceDeprecated;
        this.config = args.config;
        this.transferTokenOwner = !!args.transferTokenOwner;
    }
}
exports.CreateTokenGovernanceArgs = CreateTokenGovernanceArgs;
class SetGovernanceConfigArgs {
    constructor(args) {
        this.instruction = GovernanceInstruction.SetGovernanceConfig;
        this.config = args.config;
    }
}
exports.SetGovernanceConfigArgs = SetGovernanceConfigArgs;
class CreateProposalArgs {
    constructor(args) {
        this.instruction = GovernanceInstruction.CreateProposal;
        this.name = args.name;
        this.descriptionLink = args.descriptionLink;
        this.governingTokenMint = args.governingTokenMint;
        this.voteType = args.voteType;
        this.options = args.options;
        this.useDenyOption = args.useDenyOption;
        this.proposalSeed = args.proposalSeed;
    }
}
exports.CreateProposalArgs = CreateProposalArgs;
class AddSignatoryArgs {
    constructor(args) {
        this.instruction = GovernanceInstruction.AddSignatory;
        this.signatory = args.signatory;
    }
}
exports.AddSignatoryArgs = AddSignatoryArgs;
class SignOffProposalArgs {
    constructor() {
        this.instruction = GovernanceInstruction.SignOffProposal;
    }
}
exports.SignOffProposalArgs = SignOffProposalArgs;
class CancelProposalArgs {
    constructor() {
        this.instruction = GovernanceInstruction.CancelProposal;
    }
}
exports.CancelProposalArgs = CancelProposalArgs;
var YesNoVote;
(function (YesNoVote) {
    YesNoVote[YesNoVote["Yes"] = 0] = "Yes";
    YesNoVote[YesNoVote["No"] = 1] = "No";
})(YesNoVote || (exports.YesNoVote = YesNoVote = {}));
class VoteChoice {
    constructor(args) {
        this.rank = args.rank;
        this.weightPercentage = args.weightPercentage;
    }
}
exports.VoteChoice = VoteChoice;
var VoteKind;
(function (VoteKind) {
    VoteKind[VoteKind["Approve"] = 0] = "Approve";
    VoteKind[VoteKind["Deny"] = 1] = "Deny";
    VoteKind[VoteKind["Abstain"] = 2] = "Abstain";
    VoteKind[VoteKind["Veto"] = 3] = "Veto";
})(VoteKind || (exports.VoteKind = VoteKind = {}));
class Vote {
    constructor(args) {
        this.voteType = args.voteType;
        this.approveChoices = args.approveChoices;
        this.deny = args.deny;
        this.veto = args.veto;
    }
    toYesNoVote() {
        switch (this.voteType) {
            case VoteKind.Deny: {
                return YesNoVote.No;
            }
            case VoteKind.Approve: {
                return YesNoVote.Yes;
            }
        }
    }
    static fromYesNoVote(yesNoVote) {
        switch (yesNoVote) {
            case YesNoVote.Yes: {
                return new Vote({
                    voteType: VoteKind.Approve,
                    approveChoices: [new VoteChoice({ rank: 0, weightPercentage: 100 })],
                    deny: undefined,
                    veto: undefined,
                });
            }
            case YesNoVote.No: {
                return new Vote({
                    voteType: VoteKind.Deny,
                    approveChoices: undefined,
                    deny: true,
                    veto: undefined,
                });
            }
        }
    }
}
exports.Vote = Vote;
class CastVoteArgs {
    constructor(args) {
        this.instruction = GovernanceInstruction.CastVote;
        this.yesNoVote = args.yesNoVote;
        this.vote = args.vote;
    }
}
exports.CastVoteArgs = CastVoteArgs;
class RelinquishVoteArgs {
    constructor() {
        this.instruction = GovernanceInstruction.RelinquishVote;
    }
}
exports.RelinquishVoteArgs = RelinquishVoteArgs;
class FinalizeVoteArgs {
    constructor() {
        this.instruction = GovernanceInstruction.FinalizeVote;
    }
}
exports.FinalizeVoteArgs = FinalizeVoteArgs;
class InsertTransactionArgs {
    constructor(args) {
        this.instruction = GovernanceInstruction.InsertTransaction;
        this.index = args.index;
        this.optionIndex = args.optionIndex;
        this.holdUpTime = args.holdUpTime;
        // V1
        this.instructionData = args.instructionData;
        // V2
        this.instructions = args.instructions;
    }
}
exports.InsertTransactionArgs = InsertTransactionArgs;
class RemoveTransactionArgs {
    constructor() {
        this.instruction = GovernanceInstruction.RemoveTransaction;
    }
}
exports.RemoveTransactionArgs = RemoveTransactionArgs;
class ExecuteTransactionArgs {
    constructor() {
        this.instruction = GovernanceInstruction.ExecuteTransaction;
    }
}
exports.ExecuteTransactionArgs = ExecuteTransactionArgs;
class FlagTransactionErrorArgs {
    constructor() {
        this.instruction = GovernanceInstruction.FlagTransactionError;
    }
}
exports.FlagTransactionErrorArgs = FlagTransactionErrorArgs;
var SetRealmAuthorityAction;
(function (SetRealmAuthorityAction) {
    SetRealmAuthorityAction[SetRealmAuthorityAction["SetUnchecked"] = 0] = "SetUnchecked";
    SetRealmAuthorityAction[SetRealmAuthorityAction["SetChecked"] = 1] = "SetChecked";
    SetRealmAuthorityAction[SetRealmAuthorityAction["Remove"] = 2] = "Remove";
})(SetRealmAuthorityAction || (exports.SetRealmAuthorityAction = SetRealmAuthorityAction = {}));
class SetRealmAuthorityArgs {
    constructor(args) {
        this.instruction = GovernanceInstruction.SetRealmAuthority;
        // V1
        this.newRealmAuthority = args.newRealmAuthority;
        // V2
        this.action = args.action;
    }
}
exports.SetRealmAuthorityArgs = SetRealmAuthorityArgs;
class SetRealmConfigArgs {
    constructor(args) {
        this.instruction = GovernanceInstruction.SetRealmConfig;
        this.configArgs = args.configArgs;
    }
}
exports.SetRealmConfigArgs = SetRealmConfigArgs;
class CreateTokenOwnerRecordArgs {
    constructor() {
        this.instruction = GovernanceInstruction.CreateTokenOwnerRecord;
    }
}
exports.CreateTokenOwnerRecordArgs = CreateTokenOwnerRecordArgs;
class UpdateProgramMetadataArgs {
    constructor() {
        this.instruction = GovernanceInstruction.UpdateProgramMetadata;
    }
}
exports.UpdateProgramMetadataArgs = UpdateProgramMetadataArgs;
class CreateNativeTreasuryArgs {
    constructor() {
        this.instruction = GovernanceInstruction.CreateNativeTreasury;
    }
}
exports.CreateNativeTreasuryArgs = CreateNativeTreasuryArgs;
class SetGovernanceDelegateArgs {
    constructor(args) {
        this.instruction = GovernanceInstruction.SetGovernanceDelegate;
        this.newGovernanceDelegate = args.newGovernanceDelegate;
    }
}
exports.SetGovernanceDelegateArgs = SetGovernanceDelegateArgs;
class RevokeGoverningTokensArgs {
    constructor(args) {
        this.instruction = GovernanceInstruction.RevokeGoverningTokens;
        this.amount = args.amount;
    }
}
exports.RevokeGoverningTokensArgs = RevokeGoverningTokensArgs;
class RefundProposalDepositArgs {
    constructor() {
        this.instruction = GovernanceInstruction.RefundProposalDeposit;
    }
}
exports.RefundProposalDepositArgs = RefundProposalDepositArgs;
// Argument Classes
class CreateTransactionBufferArgs {
    constructor(args) {
        this.instruction = GovernanceInstruction.CreateTransactionBuffer;
        this.bufferIndex = args.bufferIndex;
        this.finalBufferHash = args.finalBufferHash;
        this.finalBufferSize = args.finalBufferSize;
        this.buffer = args.buffer;
    }
}
exports.CreateTransactionBufferArgs = CreateTransactionBufferArgs;
class ExtendTransactionBufferArgs {
    constructor(args) {
        this.instruction = GovernanceInstruction.ExtendTransactionBuffer;
        this.bufferIndex = args.bufferIndex;
        this.buffer = args.buffer;
    }
}
exports.ExtendTransactionBufferArgs = ExtendTransactionBufferArgs;
class CloseTransactionBufferArgs {
    constructor(args) {
        this.instruction = GovernanceInstruction.CloseTransactionBuffer;
        this.bufferIndex = args.bufferIndex;
    }
}
exports.CloseTransactionBufferArgs = CloseTransactionBufferArgs;
class InsertVersionedTransactionFromBufferArgs {
    constructor(args) {
        this.instruction = GovernanceInstruction.InsertVersionedTransactionFromBuffer;
        this.optionIndex = args.optionIndex;
        this.ephemeralSigners = args.ephemeralSigners;
        this.transactionIndex = args.transactionIndex;
        this.bufferIndex = args.bufferIndex;
    }
}
exports.InsertVersionedTransactionFromBufferArgs = InsertVersionedTransactionFromBufferArgs;
class InsertVersionedTransactionArgs {
    constructor(args) {
        this.instruction = GovernanceInstruction.InsertVersionedTransaction;
        this.optionIndex = args.optionIndex;
        this.ephemeralSigners = args.ephemeralSigners;
        this.transactionIndex = args.transactionIndex;
        this.transactionMessage = args.transactionMessage;
    }
}
exports.InsertVersionedTransactionArgs = InsertVersionedTransactionArgs;
class ExecuteVersionedTransactionArgs {
    constructor() {
        this.instruction = GovernanceInstruction.ExecuteVersionedTransaction;
    }
}
exports.ExecuteVersionedTransactionArgs = ExecuteVersionedTransactionArgs;
//# sourceMappingURL=instructions.js.map