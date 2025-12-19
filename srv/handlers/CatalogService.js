"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = async (srv) => {
    const { Books } = srv.entities;
    // READ - Get all books
    srv.on('READ', Books, async (req) => {
        return await srv.run(req.query);
    });
    // CREATE - Add a new book
    srv.on('CREATE', Books, async (req) => {
        return await srv.run(req.query);
    });
    // UPDATE - Update a book
    srv.on('UPDATE', Books, async (req) => {
        return await srv.run(req.query);
    });
    // DELETE - Delete a book
    srv.on('DELETE', Books, async (req) => {
        return await srv.run(req.query);
    });
};
//# sourceMappingURL=CatalogService.js.map