"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withSetGovernanceDelegate = void 0;
const web3_js_1 = require("@solana/web3.js");
const serialisation_1 = require("./serialisation");
const borsh_1 = require("borsh");
const instructions_1 = require("./instructions");
const accounts_1 = require("./accounts");
const withSetGovernanceDelegate = async (instructions, programId, programVersion, realm, governingTokenMint, governingTokenOwner, governanceAuthority, newGovernanceDelegate) => {
    const args = new instructions_1.SetGovernanceDelegateArgs({
        newGovernanceDelegate: newGovernanceDelegate,
    });
    const data = Buffer.from((0, borsh_1.serialize)((0, serialisation_1.getGovernanceInstructionSchema)(programVersion), args));
    const tokenOwnerRecordAddress = await (0, accounts_1.getTokenOwnerRecordAddress)(programId, realm, governingTokenMint, governingTokenOwner);
    const keys = [
        {
            pubkey: governanceAuthority,
            isWritable: false,
            isSigner: true,
        },
        {
            pubkey: tokenOwnerRecordAddress,
            isWritable: true,
            isSigner: false,
        },
    ];
    instructions.push(new web3_js_1.TransactionInstruction({
        keys,
        programId,
        data,
    }));
};
exports.withSetGovernanceDelegate = withSetGovernanceDelegate;
//# sourceMappingURL=withSetGovernanceDelegate.js.map