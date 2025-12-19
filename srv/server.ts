import cds from '@sap/cds';
import express from 'express';

// Import service handlers
import './handlers/CatalogService';

cds.on('bootstrap', (app: express.Application) => {
  // Add custom middleware if needed
});

export = cds.server;

