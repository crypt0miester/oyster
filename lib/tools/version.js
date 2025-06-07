"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseVersion = parseVersion;
function parseVersion(version) {
    const arr = version.split(".");
    // parse int or default to 0
    const major = Number.parseInt(arr[0]) || 0;
    const minor = Number.parseInt(arr[1]) || 0;
    const patch = Number.parseInt(arr[2]) || 0;
    return {
        major,
        minor,
        patch,
    };
}
//# sourceMappingURL=version.js.map