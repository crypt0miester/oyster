"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRevokeGoverningTokens = createRevokeGoverningTokens;
const withRevokeGoverningTokens_1 = require("./withRevokeGoverningTokens");
async function createRevokeGoverningTokens(programId, programVersion, realm, governingTokenOwner, governingTokenMint, revokeAuthority, amount) {
    const instructions = [];
    await (0, withRevokeGoverningTokens_1.withRevokeGoverningTokens)(instructions, programId, programVersion, realm, governingTokenOwner, governingTokenMint, revokeAuthority, amount);
    return instructions[0];
}
//# sourceMappingURL=createRevokeGoverningTokens.js.map