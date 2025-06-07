"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMessage = getErrorMessage;
function getErrorMessage(ex) {
    if (ex instanceof Error) {
        return ex.message;
    }
    return JSON.stringify(ex);
}
//# sourceMappingURL=script.js.map