"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorshAccountParser = BorshAccountParser;
const borsh_1 = require("../tools/borsh");
function BorshAccountParser(classFactory, getSchema) {
    return (pubKey, info) => {
        const buffer = Buffer.from(info.data);
        const data = (0, borsh_1.deserializeBorsh)(getSchema(info.data[0]), classFactory, buffer);
        return {
            pubkey: pubKey,
            owner: info.owner,
            account: data,
        };
    };
}
//# sourceMappingURL=serialisation.js.map