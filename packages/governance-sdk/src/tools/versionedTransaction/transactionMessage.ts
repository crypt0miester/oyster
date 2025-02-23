import {
  AccountMeta,
  AddressLookupTableAccount,
  Connection,
  PublicKey,
  TransactionMessage,
} from "@solana/web3.js";
import invariant from "../invariant";
import { compileToWrappedMessageV0 } from "./compileToWrappedMessageV0";
import { getEphemeralSignerPda, ProposalCompiledInstruction, ProposalTransactionMessage } from "../../governance";

export function isStaticWritableIndex(
  message: ProposalTransactionMessage,
  index: number
) {
  const numAccountKeys = message.accountKeys.length;
  const { numSigners, numWritableSigners, numWritableNonSigners } = message;

  if (index >= numAccountKeys) {
    // `index` is not a part of static `accountKeys`.
    return false;
  }

  if (index < numWritableSigners) {
    // `index` is within the range of writable signer keys.
    return true;
  }

  if (index >= numSigners) {
    // `index` is within the range of non-signer keys.
    const indexIntoNonSigners = index - numSigners;
    // Whether `index` is within the range of writable non-signer keys.
    return indexIntoNonSigners < numWritableNonSigners;
  }

  return false;
}

export function isSignerIndex(message: ProposalTransactionMessage, index: number) {
  return index < message.numSigners;
}

/** We use custom serialization for `transaction_message` that ensures as small byte size as possible. */
export function transactionMessageToMultisigTransactionMessageBytes({
  message,
  addressLookupTableAccounts,
  governancePda,
  treasuryPda,
}: {
  message: TransactionMessage;
  addressLookupTableAccounts?: AddressLookupTableAccount[];
  governancePda: PublicKey;
  treasuryPda: PublicKey;
}): Uint8Array {
  // Make sure authority is marked as non-signer in all instructions,
  // otherwise the message will be serialized in incorrect format.
  message.instructions.forEach((instruction) => {
    instruction.keys.forEach((key) => {
      if (key.pubkey.equals(governancePda)) {
        key.isSigner = false;
      }
      if (key.pubkey.equals(treasuryPda)) {
        key.isSigner = false;
      }
    });
  });

  // Use custom implementation of `message.compileToV0Message` that allows instruction programIds
  // to also be loaded from `addressLookupTableAccounts`.
  const compiledMessage = compileToWrappedMessageV0({
    payerKey: message.payerKey,
    recentBlockhash: message.recentBlockhash,
    instructions: message.instructions,
    addressLookupTableAccounts,
  });

  // Convert compiled instructions to ProposalCompiledInstruction format
  const proposalInstructions = compiledMessage.compiledInstructions.map((ix) => {
    return new ProposalCompiledInstruction({
      programIdIndex: ix.programIdIndex,
      accountIndexes: ix.accountKeyIndexes,
      data: ix.data,
    });
  });

  // Convert address table lookups
  const proposalAddressTableLookups = compiledMessage.addressTableLookups.map((lookup) => ({
    accountKey: lookup.accountKey,
    writableIndexes: lookup.writableIndexes,
    readonlyIndexes: lookup.readonlyIndexes,
  }));

  // Create and serialize ProposalTransactionMessage
  const proposalMessage = new ProposalTransactionMessage({
    numSigners: compiledMessage.header.numRequiredSignatures,
    numWritableSigners: 
      compiledMessage.header.numRequiredSignatures - 
      compiledMessage.header.numReadonlySignedAccounts,
    numWritableNonSigners:
      compiledMessage.staticAccountKeys.length -
      compiledMessage.header.numRequiredSignatures -
      compiledMessage.header.numReadonlyUnsignedAccounts,
    accountKeys: compiledMessage.staticAccountKeys,
    instructions: proposalInstructions,
    addressTableLookups: proposalAddressTableLookups,
  });

  return proposalMessage.serialize();
}

/** Populate remaining accounts required for execution of the transaction. */
export async function accountsForTransactionExecute({
  connection,
  transactionProposalPda,
  transactionIndex,
  governancePda,
  treasuryPda,
  message,
  ephemeralSignerBumps,
  programId,
}: {
  connection: Connection;
  message: ProposalTransactionMessage;
  ephemeralSignerBumps: number[];
  transactionIndex: number;
  governancePda: PublicKey;
  treasuryPda: PublicKey;
  transactionProposalPda: PublicKey;
  programId: PublicKey;
}): Promise<{
  /** Account metas used in the `message`. */
  accountMetas: AccountMeta[];
  /** Address lookup table accounts used in the `message`. */
  lookupTableAccounts: AddressLookupTableAccount[];
}> {
  const ephemeralSignerPdas = ephemeralSignerBumps.map(
    (_, additionalSignerIndex) => {
      return getEphemeralSignerPda({
        transactionProposalPda,
        transactionIndex,
        ephemeralSignerIndex: additionalSignerIndex,
        programId,
      })[0];
    }
  );

  const addressLookupTableKeys = message.addressTableLookups.map(
    ({ accountKey }) => accountKey
  );
  const addressLookupTableAccounts = new Map(
    await Promise.all(
      addressLookupTableKeys.map(async (key) => {
        const { value } = await connection.getAddressLookupTable(key);
        if (!value) {
          throw new Error(
            `Address lookup table account ${key.toBase58()} not found`
          );
        }
        return [key.toBase58(), value] as const;
      })
    )
  );

  // Populate account metas required for execution of the transaction.
  const accountMetas: AccountMeta[] = [];
  // First add the lookup table accounts used by the transaction. They are needed for on-chain validation.
  accountMetas.push(
    ...addressLookupTableKeys.map((key) => {
      return { pubkey: key, isSigner: false, isWritable: false };
    })
  );
  // Then add static account keys included into the message.
  for (const [accountIndex, accountKey] of message.accountKeys.entries()) {
    accountMetas.push({
      pubkey: accountKey,
      isWritable: isStaticWritableIndex(message, accountIndex),
      // NOTE: governancePda and treasuryPda and ephemeralSignerPdas cannot be marked as signers,
      // because they are PDAs and hence won't have their signatures on the transaction.
      isSigner:
        isSignerIndex(message, accountIndex) &&
        !accountKey.equals(treasuryPda) &&
        !accountKey.equals(governancePda) &&
        !ephemeralSignerPdas.find((k) => accountKey.equals(k)),
    });
  }
  // Then add accounts that will be loaded with address lookup tables.
  for (const lookup of message.addressTableLookups) {
    const lookupTableAccount = addressLookupTableAccounts.get(
      lookup.accountKey.toBase58()
    );
    invariant(
      lookupTableAccount,
      `Address lookup table account ${lookup.accountKey.toBase58()} not found`
    );

    for (const accountIndex of lookup.writableIndexes) {
      if (!lookupTableAccount) continue;
      const pubkey: PublicKey =
        lookupTableAccount.state.addresses[accountIndex];
      invariant(
        pubkey,
        `Address lookup table account ${lookup.accountKey.toBase58()} does not contain address at index ${accountIndex}`
      );
      accountMetas.push({
        pubkey,
        isWritable: true,
        // Accounts in address lookup tables can not be signers.
        isSigner: false,
      });
    }
    for (const accountIndex of lookup.readonlyIndexes) {
      if (!lookupTableAccount) continue;
      const pubkey: PublicKey =
        lookupTableAccount.state.addresses[accountIndex];
      invariant(
        pubkey,
        `Address lookup table account ${lookup.accountKey.toBase58()} does not contain address at index ${accountIndex}`
      );
      accountMetas.push({
        pubkey,
        isWritable: false,
        // Accounts in address lookup tables can not be signers.
        isSigner: false,
      });
    }
  }

  return {
    accountMetas,
    lookupTableAccounts: [...addressLookupTableAccounts.values()],
  };
}
