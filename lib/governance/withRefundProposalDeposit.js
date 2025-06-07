"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withRefundProposalDeposit = void 0;
const web3_js_1 = require("@solana/web3.js");
const serialisation_1 = require("./serialisation");
const borsh_1 = require("borsh");
const instructions_1 = require("./instructions");
const accounts_1 = require("./accounts");
const withRefundProposalDeposit = async (instructions, programId, programVersion, proposalPk, proposalDepositPayerPk) => {
    const args = new instructions_1.RefundProposalDepositArgs();
    const data = Buffer.from((0, borsh_1.serialize)((0, serialisation_1.getGovernanceInstructionSchema)(programVersion), args));
    const proposalDepositAddress = await (0, accounts_1.getProposalDepositAddress)(programId, proposalPk, proposalDepositPayerPk);
    const keys = [
        {
            pubkey: proposalPk,
            isWritable: false,
            isSigner: false,
        },
        {
            pubkey: proposalDepositAddress,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: proposalDepositPayerPk,
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
exports.withRefundProposalDeposit = withRefundProposalDeposit;
//# sourceMappingURL=withRefundProposalDeposit.js.map