"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withUpdateProgramMetadata = void 0;
const web3_js_1 = require("@solana/web3.js");
const serialisation_1 = require("./serialisation");
const borsh_1 = require("borsh");
const instructions_1 = require("./instructions");
const accounts_1 = require("./accounts");
const runtime_1 = require("../tools/sdk/runtime");
const withUpdateProgramMetadata = async (instructions, programId, programVersion, payer) => {
    const args = new instructions_1.UpdateProgramMetadataArgs();
    const data = Buffer.from((0, borsh_1.serialize)((0, serialisation_1.getGovernanceInstructionSchema)(programVersion), args));
    const programMetadataAddress = await (0, accounts_1.getProgramMetadataAddress)(programId);
    const keys = [
        {
            pubkey: programMetadataAddress,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: payer,
            isWritable: true,
            isSigner: true,
        },
        {
            pubkey: runtime_1.SYSTEM_PROGRAM_ID,
            isSigner: false,
            isWritable: false,
        },
    ];
    instructions.push(new web3_js_1.TransactionInstruction({
        keys,
        programId,
        data,
    }));
};
exports.withUpdateProgramMetadata = withUpdateProgramMetadata;
//# sourceMappingURL=withUpdateProgramMetadata.js.map