import cds from '@sap/cds';
import express from 'express';
import { getTopDeals } from './dealsEngine';

// Import service handlers
import './handlers/CatalogService';

cds.on('bootstrap', (app: express.Application) => {
  app.get('/api/deals', async (req: express.Request, res: express.Response) => {
    try {
      const origin = req.query.origin as string | undefined;
      const result = await getTopDeals(origin);
      res.set('Cache-Control', 'public, max-age=300');
      res.json(result);
    } catch (e: unknown) {
      const err = e as { message?: string };
      res.status(500).json({ error: err?.message || String(e) });
    }
  });
});

export = cds.server;

