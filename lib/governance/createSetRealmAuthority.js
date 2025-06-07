"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSetRealmAuthority = createSetRealmAuthority;
const withSetRealmAuthority_1 = require("./withSetRealmAuthority");
function createSetRealmAuthority(programId, programVersion, realm, realmAuthority, newRealmAuthority, action) {
    const instructions = [];
    (0, withSetRealmAuthority_1.withSetRealmAuthority)(instructions, programId, programVersion, realm, realmAuthority, newRealmAuthority, action);
    return instructions[0];
}
//# sourceMappingURL=createSetRealmAuthority.js.map