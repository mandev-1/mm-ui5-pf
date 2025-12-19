import cds from '@sap/cds';
import express from 'express';

// Import service handlers
import './handlers/CatalogService';

cds.on('bootstrap', (app: express.Application) => {
  // Add custom middleware if needed
  // Note: @sap/xssec is installed to satisfy CAP's auth requirement
  // but we're not enforcing authentication in this simple deployment
});

export = cds.server;

