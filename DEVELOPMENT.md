# Local Development Guide

## Viewing the Webapp During Development

### Quick Start

1. **Install dependencies** (first time only):
   ```bash
   npm install
   cd app/webapp && npm install && cd ../..
   ```

2. **Build the webapp** (first time or after TypeScript changes):
   ```bash
   npm run build:webapp
   ```

3. **Start the CAP server**:
   ```bash
   npm run dev
   # or
   npm run watch
   ```

4. **Access the application**:
   - **Webapp UI**: http://localhost:4004
   - **OData Service**: http://localhost:4004/catalog/Books
   - **Service Metadata**: http://localhost:4004/catalog/$metadata

### Development Workflow

#### Option 1: Watch Mode (Recommended)
Run in one terminal:
```bash
npm run dev
```

This will:
- Build the webapp TypeScript
- Start CAP in watch mode (auto-reloads on server changes)
- Serve the webapp at http://localhost:4004

#### Option 2: Separate Terminals (For Active Development)

**Terminal 1** - Watch webapp TypeScript changes:
```bash
npm run dev:webapp
```

**Terminal 2** - Run CAP server:
```bash
npm run watch
```

This allows you to:
- See TypeScript compilation errors immediately
- Have CAP auto-reload on server-side changes
- Rebuild webapp when you make frontend changes

### Making Changes

1. **Frontend (TypeScript MVC)**:
   - Edit files in `app/webapp/`
   - Run `npm run build:webapp` to compile TypeScript to JavaScript
   - Refresh browser to see changes

2. **Backend (CAP Services)**:
   - Edit files in `srv/` or `db/`
   - CAP watch mode will auto-reload
   - Refresh browser to see changes

3. **Styling**:
   - Edit `app/styles.css`
   - Refresh browser (no build needed)

### Troubleshooting

**Webapp not loading?**
- Make sure you've run `npm run build:webapp` to compile TypeScript
- Check browser console for errors
- Verify files exist in `app/webapp/` (compiled .js files)

**TypeScript errors?**
- Check `app/webapp/tsconfig.json` configuration
- Ensure all dependencies are installed in `app/webapp/`

**CAP server not starting?**
- Run `npm run build:server` to compile server TypeScript
- Check for errors in terminal output
- Verify database is initialized

### File Structure for Serving

CAP automatically serves files from the `app/` directory:
```
app/
├── index.html          → http://localhost:4004/
├── styles.css          → http://localhost:4004/styles.css
└── webapp/
    ├── main.js         → http://localhost:4004/webapp/main.js
    ├── models/
    ├── views/
    └── controllers/
```

### Hot Reload

For true hot-reload during development, you can use:
- Browser DevTools with auto-refresh extensions
- Or set up a more advanced build tool (Vite, Webpack, etc.) if needed

