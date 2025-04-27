import {
	Connection,
	Keypair,
	LAMPORTS_PER_SOL,
	PublicKey,
	SystemProgram,
	Transaction,
	TransactionInstruction,
	TransactionMessage,
	VersionedTransaction,
} from "@solana/web3.js";

export async function sendTransaction(
	connection: Connection,
	instructions: TransactionInstruction[],
	signers: Keypair[],
	feePayer: Keypair,
) {
	let transaction = new Transaction({ feePayer: feePayer.publicKey });
	transaction.add(...instructions);
	signers.push(feePayer);
	let tx = await connection.sendTransaction(transaction, signers);

	await connection.confirmTransaction(tx, "confirmed");
}

export async function sendV0Transaction(
	connection: Connection,
	instructions: TransactionInstruction[],
	signers: Keypair[],
	feePayer: Keypair,
	withSimulation: boolean,
) {
	const latestBlockhash = await connection.getLatestBlockhash("confirmed");
	const messageV0 = new TransactionMessage({
		payerKey: feePayer.publicKey,
		recentBlockhash: latestBlockhash.blockhash,
		instructions,
	}).compileToV0Message();

	const transaction = new VersionedTransaction(messageV0);
	transaction.sign([...signers, feePayer]);
	withSimulation && console.log("Simulated Txn", await connection.simulateTransaction(transaction));

	const tx = await connection.sendTransaction(transaction);
	await connection.confirmTransaction({
		signature: tx,
		lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
		blockhash: latestBlockhash.blockhash,
	}, "confirmed");
}

export async function requestAirdrop(connection: Connection, walletPk: PublicKey) {
	const airdropSignature = await connection.requestAirdrop(walletPk, LAMPORTS_PER_SOL);

	await connection.confirmTransaction(airdropSignature);
}

export function createTestTransferInstruction(authority: PublicKey, recipient: PublicKey, amount = 1000000) {
	return SystemProgram.transfer({
		fromPubkey: authority,
		lamports: amount,
		toPubkey: recipient,
	});
}
