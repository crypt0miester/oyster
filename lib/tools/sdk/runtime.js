"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendTransactionError = exports.SYSTEM_PROGRAM_ID = void 0;
exports.simulateTransaction = simulateTransaction;
const web3_js_1 = require("@solana/web3.js");
exports.SYSTEM_PROGRAM_ID = new web3_js_1.PublicKey("11111111111111111111111111111111");
async function simulateTransaction(connection, transaction, commitment) {
    const latestBlockhash = await connection.getRecentBlockhash();
    //@ts-ignore
    transaction.lastValidBlockHeight = latestBlockhash.lastValidBlockHeight;
    transaction.recentBlockhash = latestBlockhash.blockhash;
    const signData = transaction.serializeMessage();
    // @ts-ignore
    const wireTransaction = transaction._serialize(signData);
    const encodedTransaction = wireTransaction.toString("base64");
    const config = { encoding: "base64", commitment };
    const args = [encodedTransaction, config];
    // @ts-ignore
    const res = await connection._rpcRequest("simulateTransaction", args);
    if (res.error) {
        throw new Error(`failed to simulate transaction: ${res.error.message}`);
    }
    return res.result;
}
class SendTransactionError extends Error {
    constructor(message, txId, txError) {
        super(message);
        this.txError = txError;
        this.txId = txId;
    }
}
exports.SendTransactionError = SendTransactionError;
//# sourceMappingURL=runtime.js.map