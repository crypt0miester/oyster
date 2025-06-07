"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGovernanceProgramVersion = getGovernanceProgramVersion;
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = __importDefault(require("bn.js"));
const constants_1 = require("../registry/constants");
const numbers_1 = require("../tools/numbers");
const bpfUpgradeableLoader_1 = require("../tools/sdk/bpfUpgradeableLoader");
const version_1 = require("../tools/version");
const accounts_1 = require("./accounts");
const serialisation_1 = require("./serialisation");
const withUpdateProgramMetadata_1 = require("./withUpdateProgramMetadata");
async function getGovernanceProgramVersion(connection, programId, env) {
    // Try get program metadata
    const programMetadataPk = await (0, accounts_1.getProgramMetadataAddress)(programId);
    try {
        const programMetadataInfo = await connection.getAccountInfo(programMetadataPk);
        // If ProgramMetadata exists then use it to get latest updated version
        if (programMetadataInfo) {
            const programMetadata = (0, serialisation_1.GovernanceAccountParser)(accounts_1.ProgramMetadata)(programMetadataPk, programMetadataInfo);
            let deploySlot = numbers_1.BN_ZERO;
            try {
                const programData = await (0, bpfUpgradeableLoader_1.getProgramDataAccount)(connection, new web3_js_1.PublicKey(programId));
                deploySlot = new bn_js_1.default(programData.slot);
            }
            catch (_a) {
                // If the program is not upgradable for example on localnet then there is no ProgramData account
                // and Metadata must be more recent
            }
            // Check if ProgramMetadata is not stale
            if (programMetadata.account.updatedAt.gte(deploySlot)) {
                const version = (0, version_1.parseVersion)(programMetadata.account.version);
                // console.log("Program version (metadata)", version);
                return version.major;
            }
        }
    }
    catch (_b) {
        // nop, let's try simulation
    }
    try {
        // If we don't have the programMetadata info then simulate UpdateProgramMetadata
        const instructions = [];
        // The wallet can be any existing account for the simulation
        // Note: when running a local validator ensure the account is copied from devnet: --clone ENmcpFCpxN1CqyUjuog9yyUVfdXBKF3LVCwLr7grJZpk -ud
        const walletPk = new web3_js_1.PublicKey("ENmcpFCpxN1CqyUjuog9yyUVfdXBKF3LVCwLr7grJZpk");
        await (0, withUpdateProgramMetadata_1.withUpdateProgramMetadata)(instructions, programId, 2, walletPk);
        const transaction = new web3_js_1.Transaction({ feePayer: walletPk });
        transaction.add(...instructions);
        // TODO: Once return values are supported change the simulation call to the actual one
        const getVersion = await connection.simulateTransaction(transaction);
        if (getVersion.value.logs) {
            const prefix = 'PROGRAM-VERSION:"';
            const simVersion = getVersion.value.logs
                .filter((l) => l.includes(prefix))
                .map((l) => {
                const versionStart = l.indexOf(prefix);
                return (0, version_1.parseVersion)(l.substring(versionStart + prefix.length, l.length - 1));
            })[0];
            if (simVersion) {
                // console.log("Program version (simulation)", simVersion);
                return simVersion.major;
            }
        }
    }
    catch (ex) {
        console.log("Can't determine program version", ex);
    }
    // If we can't determine the version using the program instance and running localnet then use the latest version
    if (env === "localnet") {
        return constants_1.PROGRAM_VERSION;
    }
    // Default to V1 which doesn't support ProgramMetadata
    console.log("Program version (default)", constants_1.PROGRAM_VERSION_V1);
    return constants_1.PROGRAM_VERSION_V1;
}
//# sourceMappingURL=version.js.map