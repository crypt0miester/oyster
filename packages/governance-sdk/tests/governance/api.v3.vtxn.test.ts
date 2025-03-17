import { Keypair } from '@solana/web3.js';
import BN from 'bn.js';
import {
  GovernanceConfig,
  GoverningTokenConfigAccountArgs,
  GoverningTokenType,
  TransactionExecutionStatus,
  VoteThreshold,
  VoteThresholdType,
  VoteTipping,
} from '../../src/governance/accounts';
import { PROGRAM_VERSION_V3 } from '../../src/registry/constants';
import { BenchBuilder } from '../tools/builders';
import { getTimestampFromDays } from '../tools/units';

// test('getGovernanceProgramVersion', async () => {
//   // Arrange
//   // Act
//   const builder = await BenchBuilder.withConnection();

//   // Assert
//   expect(builder.programVersion).toEqual(3);
// });

// test('createRealmWithTokenConfigs', async () => {
//   // Arrange
//   const bench = await BenchBuilder.withConnection(PROGRAM_VERSION_V3).then(b =>
//     b.withWallet(),
//   );

//   const communityTokenConfig = new GoverningTokenConfigAccountArgs({
//     voterWeightAddin: Keypair.generate().publicKey,
//     maxVoterWeightAddin: Keypair.generate().publicKey,
//     tokenType: GoverningTokenType.Dormant,
//   });
//   const councilTokenConfig = new GoverningTokenConfigAccountArgs({
//     voterWeightAddin: Keypair.generate().publicKey,
//     maxVoterWeightAddin: Keypair.generate().publicKey,
//     tokenType: GoverningTokenType.Membership,
//   });

//   // Act
//   const realm = await bench
//     .withRealm(communityTokenConfig, councilTokenConfig)
//     .then(b => b.sendTx());

//   // Assert
//   const realmConfig = await realm.getRealmConfig();

//   expect(realmConfig.account.realm).toEqual(realm.realmPk);

//   // communityTokenConfig
//   expect(realmConfig.account.communityTokenConfig.tokenType).toEqual(
//     communityTokenConfig.tokenType,
//   );
//   expect(realmConfig.account.communityTokenConfig.voterWeightAddin).toEqual(
//     communityTokenConfig.voterWeightAddin,
//   );
//   expect(realmConfig.account.communityTokenConfig.maxVoterWeightAddin).toEqual(
//     communityTokenConfig.maxVoterWeightAddin,
//   );

//   // councilTokenConfig
//   expect(realmConfig.account.councilTokenConfig.tokenType).toEqual(
//     GoverningTokenType.Membership,
//   );
//   expect(realmConfig.account.councilTokenConfig.voterWeightAddin).toEqual(
//     councilTokenConfig.voterWeightAddin,
//   );
//   expect(realmConfig.account.councilTokenConfig.maxVoterWeightAddin).toEqual(
//     councilTokenConfig.maxVoterWeightAddin,
//   );
// });

// test('createGovernanceWithConfig', async () => {
//   // Arrange
//   const realm = await BenchBuilder.withConnection(PROGRAM_VERSION_V3)
//     .then(b => b.withWallet())
//     .then(b => b.withRealm())
//     .then(b => b.withCommunityMember())
//     .then(b => b.sendTx());

//   const config = new GovernanceConfig({
//     communityVoteThreshold: new VoteThreshold({
//       type: VoteThresholdType.YesVotePercentage,
//       value: 20,
//     }),
//     minCommunityTokensToCreateProposal: new BN(1),
//     minInstructionHoldUpTime: 0,
//     baseVotingTime: getTimestampFromDays(3),
//     communityVoteTipping: VoteTipping.Strict,
//     councilVoteTipping: VoteTipping.Strict,
//     minCouncilTokensToCreateProposal: new BN(1),
//     councilVoteThreshold: new VoteThreshold({
//       type: VoteThresholdType.YesVotePercentage,
//       value: 60,
//     }),
//     councilVetoVoteThreshold: new VoteThreshold({
//       type: VoteThresholdType.YesVotePercentage,
//       value: 80,
//     }),
//     communityVetoVoteThreshold: new VoteThreshold({
//       type: VoteThresholdType.YesVotePercentage,
//       value: 80,
//     }),
//     votingCoolOffTime: 5000,
//     depositExemptProposalCount: 10,
//   });

//   // Act
//   const governancePk = await realm.createGovernance(config);

//   // Assert
//   const governance = await realm.getGovernance(governancePk);

//   expect(governance.account.config.communityVoteThreshold).toEqual(
//     config.communityVoteThreshold,
//   );

//   expect(governance.account.config.councilVoteThreshold).toEqual(
//     config.councilVoteThreshold,
//   );

//   expect(governance.account.config.councilVetoVoteThreshold).toEqual(
//     config.councilVetoVoteThreshold,
//   );

//   expect(governance.account.config.baseVotingTime).toEqual(
//     getTimestampFromDays(3),
//   );

//   expect(governance.account.config.votingCoolOffTime).toEqual(5000);

//   expect(governance.account.config.depositExemptProposalCount).toEqual(10);
// });

// test('setRealmConfigWithTokenConfigs', async () => {
//   // Arrange
//   const realm = await BenchBuilder.withConnection(PROGRAM_VERSION_V3)
//     .then(b => b.withWallet())
//     .then(b => b.withRealm())
//     .then(b => b.sendTx());

//   const communityTokenConfig = new GoverningTokenConfigAccountArgs({
//     voterWeightAddin: Keypair.generate().publicKey,
//     maxVoterWeightAddin: Keypair.generate().publicKey,
//     tokenType: GoverningTokenType.Dormant,
//   });
//   const councilTokenConfig = new GoverningTokenConfigAccountArgs({
//     voterWeightAddin: Keypair.generate().publicKey,
//     maxVoterWeightAddin: Keypair.generate().publicKey,
//     tokenType: GoverningTokenType.Membership,
//   });

//   // Act
//   await realm.setRealmConfig(communityTokenConfig, councilTokenConfig);

//   // Assert
//   const realmConfig = await realm.getRealmConfig();

//   expect(realmConfig.account.realm).toEqual(realm.realmPk);

//   // communityTokenConfig
//   expect(realmConfig.account.communityTokenConfig.tokenType).toEqual(
//     communityTokenConfig.tokenType,
//   );
//   expect(realmConfig.account.communityTokenConfig.voterWeightAddin).toEqual(
//     communityTokenConfig.voterWeightAddin,
//   );
//   expect(realmConfig.account.communityTokenConfig.maxVoterWeightAddin).toEqual(
//     communityTokenConfig.maxVoterWeightAddin,
//   );

//   // councilTokenConfig
//   expect(realmConfig.account.councilTokenConfig.tokenType).toEqual(
//     GoverningTokenType.Membership,
//   );
//   expect(realmConfig.account.councilTokenConfig.voterWeightAddin).toEqual(
//     councilTokenConfig.voterWeightAddin,
//   );
//   expect(realmConfig.account.councilTokenConfig.maxVoterWeightAddin).toEqual(
//     councilTokenConfig.maxVoterWeightAddin,
//   );
// });

// test('revokeGoverningToken', async () => {
//   // Arrange

//   const communityTokenConfig = new GoverningTokenConfigAccountArgs({
//     voterWeightAddin: undefined,
//     maxVoterWeightAddin: undefined,
//     tokenType: GoverningTokenType.Membership,
//   });

//   const realm = await BenchBuilder.withConnection(PROGRAM_VERSION_V3)
//     .then(b => b.withWallet())
//     .then(b => b.withRealm(communityTokenConfig))
//     .then(b => b.withCommunityMember())
//     .then(b => b.sendTx());

//   // Act
//   await realm.revokeGoverningTokens();

//   // Assert
//   const tokenOwnerRecord = await realm.getTokenOwnerRecord(
//     realm.communityOwnerRecordPk,
//   );

//   expect(
//     tokenOwnerRecord.account.governingTokenDepositAmount.toNumber(),
//   ).toEqual(0);
// });

// test('createProposal', async () => {
//   // Arrange
//   const realm = await BenchBuilder.withConnection()
//     .then(b => b.withWallet())
//     .then(b => b.withRealm())
//     .then(b => b.withCommunityMember())
//     .then(b => b.withGovernance())
//     .then(b => b.sendTx());

//   // Act
//   const proposalPk = await realm.createProposal('proposal 1');

//   // Assert
//   const proposal = await realm.getProposal(proposalPk);

//   expect(proposal.account.name).toEqual('proposal 1');
//   expect(proposal.account.vetoVoteWeight.toNumber()).toEqual(0);

//   const governance = await realm.getGovernance(proposal.account.governance);
//   expect(governance.account.activeProposalCount.toNumber()).toEqual(1);
// });


// test('createTransactionBuffer', async () => {
//   // Arrange
//   const realm = await BenchBuilder.withConnection(PROGRAM_VERSION_V3)
//     .then(b => b.withWallet())
//     .then(b => b.withRealm())
//     .then(b => b.withCommunityMember())
//     .then(b => b.withGovernance())
//     .then(b => b.sendTx())
//     .then(b => b.withProposal())
//     .then(b => b.sendTx());
//   const bufferIndex = 0;
//   const finalBufferHash = new Uint8Array(32).fill(1); // Example hash
//   const finalBufferSize = 100;
//   const buffer = new Uint8Array([1, 2, 3, 4]);

//   // Act
//   await realm.withTransactionBuffer(bufferIndex, finalBufferHash, finalBufferSize, buffer)
//     .then(b => b.sendTx());

//   // Assert
//   const transactionBuffer = await realm.getTransactionBuffer(realm.proposalTransactionBufferPk);
//   if (!transactionBuffer) throw Error("No transaction buffer found")
//   expect(transactionBuffer.proposal.toBase58()).toEqual(realm.proposalPk.toBase58());
//   expect(transactionBuffer.creator.toBase58()).toEqual(realm.bench.walletPk.toBase58());
//   expect(transactionBuffer.bufferIndex).toEqual(bufferIndex);
//   expect(Buffer.from(transactionBuffer.finalBufferHash)).toEqual(Buffer.from(finalBufferHash));
//   expect(transactionBuffer.finalBufferSize).toEqual(finalBufferSize);
//   expect(Buffer.from(transactionBuffer.buffer)).toEqual(Buffer.from(buffer));
// });

// test('extendTransactionBuffer', async () => {
//   const bufferIndex = 0;
//   const finalBufferHash = new Uint8Array(32).fill(1); // Example hash
//   const finalBufferSize = 100;
//   const buffer = new Uint8Array([1, 2, 3, 4]);
//   // Arrange
//   const realm = await BenchBuilder.withConnection(PROGRAM_VERSION_V3)
//     .then(b => b.withWallet())
//     .then(b => b.withRealm())
//     .then(b => b.withCommunityMember())
//     .then(b => b.withGovernance())
//     .then(b => b.sendTx())
//     .then(b => b.withProposal())
//     .then(b => b.withTransactionBuffer(bufferIndex, finalBufferHash, finalBufferSize, buffer))
//     .then(b => b.sendTx());

//   const extensionBuffer = new Uint8Array([4, 5, 6]);

//   // Act
//   await realm.extendTransactionBuffer(bufferIndex, extensionBuffer)
//     .then(b => b.sendTx());

//   // Assert
//   const transactionBuffer = await realm.getTransactionBuffer(realm.proposalTransactionBufferPk);
//   if (!transactionBuffer) throw Error("No transaction buffer found")
//   expect(transactionBuffer.buffer.length).toBeGreaterThan(4); // Original was [1,2,3]
// });

// test('closeTransactionBuffer', async () => {
//   const bufferIndex = 0;
//   const finalBufferHash = new Uint8Array(32).fill(1); // Example hash
//   const finalBufferSize = 100;
//   const buffer = new Uint8Array([1, 2, 3, 4]);
//   // Arrange
//   const realm = await BenchBuilder.withConnection(PROGRAM_VERSION_V3)
//     .then(b => b.withWallet())
//     .then(b => b.withRealm())
//     .then(b => b.withCommunityMember())
//     .then(b => b.withGovernance())
//     .then(b => b.sendTx())
//     .then(b => b.withProposal())
//     .then(b => b.withTransactionBuffer(bufferIndex, finalBufferHash, finalBufferSize, buffer))
//     .then(b => b.sendTx());

//   // Act
//   await realm.closeTransactionBuffer(bufferIndex)
//     .then(b => b.sendTx());

//   // Assert
//   const accountInfo = await realm.bench.connection.getAccountInfo(realm.proposalTransactionBufferPk);
//   expect(accountInfo).toBeNull(); // Account should be closed
// });

test('insertVersionedTransactionFromBuffer', async () => {
  const bufferIndex = 0;
  const finalBufferHash = new Uint8Array(32).fill(1); // Example hash
  const finalBufferSize = 4;
  const buffer = new Uint8Array([1, 2, 3, 4]);
  // Arrange
  const realm = await BenchBuilder.withConnection(PROGRAM_VERSION_V3)
    .then(b => b.withWallet())
    .then(b => b.withRealm())
    .then(b => b.withCommunityMember())
    .then(b => b.withGovernance())
    .then(b => b.sendTx())
    .then(b => b.withProposal())
    .then(b => b.withTransactionBuffer(bufferIndex, finalBufferHash, finalBufferSize, buffer))
    .then(b => b.sendTx());

  const optionIndex = 0;
  const ephemeralSigners = 0;
  const transactionIndex = 0;

  // Act
  await realm.withVersionedTransactionFromBuffer(optionIndex, ephemeralSigners, transactionIndex, bufferIndex)
    .then(b => b.sendTx());

  // Assert
  const versionedTx = await realm.getVersionedTransaction(realm.proposalVersionedTxPk);
  if (!versionedTx) throw Error("No versionedTx found")
  expect(versionedTx.proposal.toBase58()).toEqual(realm.proposalPk.toBase58());
  expect(versionedTx.optionIndex).toEqual(optionIndex);
  expect(versionedTx.transactionIndex).toEqual(transactionIndex);
  expect(versionedTx.ephemeralSignerBumps.length).toEqual(ephemeralSigners);
});

// test('insertVersionedTransaction', async () => {
//   // Arrange
//   const realm = await BenchBuilder.withConnection(PROGRAM_VERSION_V3)
//     .then(b => b.withWallet())
//     .then(b => b.withRealm())
//     .then(b => b.withCommunityMember())
//     .then(b => b.withGovernance())
//     .then(b => b.withProposal())
//     .then(b => b.sendTx());

//   const optionIndex = 0;
//   const ephemeralSigners = 1;
//   const transactionIndex = 0;
//   const transactionMessage = new Uint8Array([1, 2, 3]);

//   // Act
//   await realm.withVersionedTransaction(optionIndex, ephemeralSigners, transactionIndex, transactionMessage)
//     .then(b => b.sendTx());

//   // Assert
//   const versionedTx = await realm.getVersionedTransaction(realm.proposalVersionedTxPk);
//   expect(versionedTx.proposal.toBase58()).toEqual(realm.proposalPk.toBase58());
//   expect(versionedTx.optionIndex).toEqual(optionIndex);
//   expect(versionedTx.transactionIndex).toEqual(transactionIndex);
//   expect(versionedTx.ephemeralSignerBumps.length).toEqual(ephemeralSigners);
//   expect(Buffer.from(versionedTx.message.serialize())).toEqual(Buffer.from(transactionMessage));
// });

// test('executeVersionedTransaction', async () => {
//   // Arrange
//   const realm = await BenchBuilder.withConnection(PROGRAM_VERSION_V3)
//     .then(b => b.withWallet())
//     .then(b => b.withRealm())
//     .then(b => b.withCommunityMember())
//     .then(b => b.withGovernance())
//     .then(b => b.withProposal())
//     .then(b => b.withVersionedTransaction()) // Creates with defaults
//     .then(b => b.sendTx());

//   // Act
//   await realm.executeVersionedTransaction()
//     .then(b => b.sendTx());

//   // Assert
//   const versionedTx = await realm.getVersionedTransaction(realm.proposalVersionedTxPk);
//   expect(versionedTx.executionStatus).toEqual(TransactionExecutionStatus.Success);
//   expect(versionedTx.executedAt).not.toBeNull();
// });