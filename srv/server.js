"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const cds_1 = __importDefault(require("@sap/cds"));
const dealsEngine_1 = require("./dealsEngine");
// Import service handlers
require("./handlers/CatalogService");
cds_1.default.on('bootstrap', (app) => {
    app.get('/api/deals', async (req, res) => {
        try {
            const origin = req.query.origin;
            const result = await (0, dealsEngine_1.getTopDeals)(origin);
            res.set('Cache-Control', 'public, max-age=300');
            res.json(result);
        }
        catch (e) {
            const err = e;
            res.status(500).json({ error: err?.message || String(e) });
        }
    });
});
module.exports = cds_1.default.server;
//# sourceMappingURL=server.js.map