"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaxVoterWeightRecord = exports.VoterWeightRecord = exports.VoterWeightAction = void 0;
exports.getVoterWeightRecordAddress = getVoterWeightRecordAddress;
exports.getMaxVoterWeightRecordAddress = getMaxVoterWeightRecordAddress;
const web3_js_1 = require("@solana/web3.js");
var VoterWeightAction;
(function (VoterWeightAction) {
    VoterWeightAction[VoterWeightAction["CastVote"] = 0] = "CastVote";
    VoterWeightAction[VoterWeightAction["CommentProposal"] = 1] = "CommentProposal";
    VoterWeightAction[VoterWeightAction["CreateGovernance"] = 2] = "CreateGovernance";
    VoterWeightAction[VoterWeightAction["CreateProposal"] = 3] = "CreateProposal";
    VoterWeightAction[VoterWeightAction["SignOffProposal"] = 4] = "SignOffProposal";
})(VoterWeightAction || (exports.VoterWeightAction = VoterWeightAction = {}));
class VoterWeightRecord {
    constructor(args) {
        this.accountDiscriminator = new Uint8Array([50, 101, 102, 57, 57, 98, 52, 98]);
        this.realm = args.realm;
        this.governingTokenMint = args.governingTokenMint;
        this.governingTokenOwner = args.governingTokenOwner;
        this.voterWeight = args.voterWeight;
        this.voterWeightExpiry = args.voterWeightExpiry;
        this.weightAction = args.weightAction;
        this.weightActionTarget = args.weightActionTarget;
    }
}
exports.VoterWeightRecord = VoterWeightRecord;
/**
 * Returns the default address for VoterWeightRecord
 * Note: individual addins are not required to use the default address and it can vary between different implementations
 **/
async function getVoterWeightRecordAddress(programId, realm, governingTokenMint, governingTokenOwner) {
    const [voterWeightRecordAddress] = await web3_js_1.PublicKey.findProgramAddress([
        Buffer.from("voter-weight-record"),
        realm.toBuffer(),
        governingTokenMint.toBuffer(),
        governingTokenOwner.toBuffer(),
    ], programId);
    return voterWeightRecordAddress;
}
class MaxVoterWeightRecord {
    constructor(args) {
        this.accountDiscriminator = new Uint8Array([57, 100, 53, 102, 102, 50, 57, 55]);
        this.realm = args.realm;
        this.governingTokenMint = args.governingTokenMint;
        this.maxVoterWeight = args.maxVoterWeight;
        this.maxVoterWeightExpiry = args.maxVoterWeightExpiry;
    }
}
exports.MaxVoterWeightRecord = MaxVoterWeightRecord;
/**
 * Returns the default address for MaxVoterWeightRecord
 * Note: individual addins are not required to use the default address and it can vary between different implementations
 **/
async function getMaxVoterWeightRecordAddress(programId, realm, governingTokenMint) {
    const [maxVoterWeightRecordAddress] = await web3_js_1.PublicKey.findProgramAddress([Buffer.from("max-voter-weight-record"), realm.toBuffer(), governingTokenMint.toBuffer()], programId);
    return maxVoterWeightRecordAddress;
}
//# sourceMappingURL=accounts.js.map