"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovernanceType = exports.GoverningTokenRole = void 0;
var GoverningTokenRole;
(function (GoverningTokenRole) {
    GoverningTokenRole[GoverningTokenRole["Community"] = 0] = "Community";
    GoverningTokenRole[GoverningTokenRole["Council"] = 1] = "Council";
})(GoverningTokenRole || (exports.GoverningTokenRole = GoverningTokenRole = {}));
var GovernanceType;
(function (GovernanceType) {
    GovernanceType[GovernanceType["Account"] = 0] = "Account";
    GovernanceType[GovernanceType["Program"] = 1] = "Program";
    GovernanceType[GovernanceType["Mint"] = 2] = "Mint";
    GovernanceType[GovernanceType["Token"] = 3] = "Token";
})(GovernanceType || (exports.GovernanceType = GovernanceType = {}));
//# sourceMappingURL=enums.js.map