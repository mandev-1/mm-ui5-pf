import { Request, Service } from '@sap/cds';

module.exports = async (srv: Service) => {
  const { Books } = srv.entities;

  // READ - Get all books
  srv.on('READ', Books, async (req: Request) => {
    return await srv.run(req.query);
  });

  // CREATE - Add a new book
  srv.on('CREATE', Books, async (req: Request) => {
    return await srv.run(req.query);
  });

  // UPDATE - Update a book
  srv.on('UPDATE', Books, async (req: Request) => {
    return await srv.run(req.query);
  });

  // DELETE - Delete a book
  srv.on('DELETE', Books, async (req: Request) => {
    return await srv.run(req.query);
  });
};

