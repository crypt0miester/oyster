"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSetGovernanceConfig = createSetGovernanceConfig;
const web3_js_1 = require("@solana/web3.js");
const instructions_1 = require("./instructions");
const serialisation_1 = require("./serialisation");
const borsh_1 = require("borsh");
function createSetGovernanceConfig(programId, programVersion, governance, governanceConfig) {
    const args = new instructions_1.SetGovernanceConfigArgs({ config: governanceConfig });
    const data = Buffer.from((0, borsh_1.serialize)((0, serialisation_1.getGovernanceInstructionSchema)(programVersion), args));
    if (args.config.baseVotingTime < 3600) {
        throw new Error("baseVotingTime should be at least 1 hour");
    }
    const keys = [
        {
            pubkey: governance,
            isWritable: true,
            isSigner: true,
        },
    ];
    return new web3_js_1.TransactionInstruction({
        keys,
        programId,
        data,
    });
}
//# sourceMappingURL=createSetGovernanceConfig.js.map