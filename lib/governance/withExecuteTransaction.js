"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withExecuteTransaction = void 0;
const web3_js_1 = require("@solana/web3.js");
const serialisation_1 = require("./serialisation");
const borsh_1 = require("borsh");
const instructions_1 = require("./instructions");
const accounts_1 = require("./accounts");
const constants_1 = require("../registry/constants");
const withExecuteTransaction = async (instructions, programId, programVersion, governance, proposal, transactionAddress, transactionInstructions) => {
    const args = new instructions_1.ExecuteTransactionArgs();
    const data = Buffer.from((0, borsh_1.serialize)((0, serialisation_1.getGovernanceInstructionSchema)(programVersion), args));
    const nativeTreasury = await (0, accounts_1.getNativeTreasuryAddress)(programId, governance);
    const keys = [
        {
            pubkey: governance,
            isWritable: false,
            isSigner: false,
        },
        {
            pubkey: proposal,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: transactionAddress,
            isWritable: true,
            isSigner: false,
        },
    ];
    if (programVersion === constants_1.PROGRAM_VERSION_V1) {
        keys.push({
            pubkey: web3_js_1.SYSVAR_CLOCK_PUBKEY,
            isSigner: false,
            isWritable: false,
        });
    }
    for (const instruction of transactionInstructions) {
        // When an instruction needs to be signed by the Governance PDA or the Native treasury then its isSigner flag has to be reset on AccountMeta
        // because the signature will be required during cpi call invoke_signed() and not when we send ExecuteInstruction
        instruction.accounts = instruction.accounts.map((a) => (a.pubkey.toBase58() === governance.toBase58() || a.pubkey.toBase58() === nativeTreasury.toBase58()) && a.isSigner
            ? new accounts_1.AccountMetaData({
                pubkey: a.pubkey,
                isWritable: a.isWritable,
                isSigner: false,
            })
            : a);
        keys.push({
            pubkey: instruction.programId,
            isWritable: false,
            isSigner: false,
        }, ...instruction.accounts);
    }
    instructions.push(new web3_js_1.TransactionInstruction({
        keys,
        programId,
        data,
    }));
};
exports.withExecuteTransaction = withExecuteTransaction;
//# sourceMappingURL=withExecuteTransaction.js.map