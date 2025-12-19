"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const cds_1 = __importDefault(require("@sap/cds"));
// Import service handlers
require("./handlers/CatalogService");
cds_1.default.on('bootstrap', (app) => {
    // Add custom middleware if needed
});
module.exports = cds_1.default.server;
//# sourceMappingURL=server.js.map