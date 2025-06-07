"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSetRealmConfig = createSetRealmConfig;
const withSetRealmConfig_1 = require("./withSetRealmConfig");
async function createSetRealmConfig(programId, programVersion, realm, realmAuthority, councilMint, communityMintMaxVoteWeightSource, minCommunityTokensToCreateGovernance, communityTokenConfig, councilTokenConfig, payer) {
    const instructions = [];
    await (0, withSetRealmConfig_1.withSetRealmConfig)(instructions, programId, programVersion, realm, realmAuthority, councilMint, communityMintMaxVoteWeightSource, minCommunityTokensToCreateGovernance, communityTokenConfig, councilTokenConfig, payer);
    return instructions[0];
}
//# sourceMappingURL=createSetRealmConfig.js.map