# MMD CAP Application with UI5

A minimal SAP Cloud Application Programming (CAP) application with a SAP UI5 frontend, deployable on Railway.

## Project Structure

```
.
├── app/                    # Web application
│   ├── index.html         # Main HTML file (UI5 bootstrap)
│   └── webapp/            # UI5 application
│       ├── Component.js   # UI5 component
│       ├── manifest.json  # UI5 app manifest
│       ├── controller/    # UI5 controllers
│       ├── view/          # UI5 XML views
│       ├── model/         # UI5 models
│       └── i18n/          # Internationalization
├── db/                    # Database models
│   └── data-model.cds    # Data model definition
├── srv/                   # Service layer
│   ├── server.ts         # Server entry point (TypeScript)
│   ├── service.cds       # Service definition
│   └── handlers/         # TypeScript service handlers
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration (server only)
└── railway.toml          # Railway deployment config
```

## UI5 Architecture

- **Component.js**: Main UI5 component that initializes the application
- **manifest.json**: Application configuration, routing, and models
- **Views** (`view/App.view.xml`): XML-based UI definitions
- **Controllers** (`controller/App.controller.js`): JavaScript controllers handling user interactions
- **Models**: OData V4 model for backend communication, JSON model for form data

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the server TypeScript:
   ```bash
   npm run build:server
   ```

3. Run the application:
   ```bash
   npm start
   ```

   Or in watch mode:
   ```bash
   npm run watch
   ```

## Development

### Viewing the UI5 Application Locally

1. **Start the CAP server:**
   ```bash
   npm run watch
   # or
   npm run dev
   ```

2. **Open in browser:**
   - **UI5 Application**: http://localhost:4004
   - **OData Service**: http://localhost:4004/catalog/Books
   - **Service Metadata**: http://localhost:4004/catalog/$metadata

### Making Changes

- **UI5 Views/Controllers**: Edit files in `app/webapp/` - changes are reflected immediately (just refresh browser)
- **Backend (CAP Services)**: Edit files in `srv/` or `db/` - CAP watch mode will auto-reload
- **Server TypeScript**: Run `npm run build:server` after changes, or use watch mode

### UI5 Features

- ✅ OData V4 model integration
- ✅ XML views with declarative UI
- ✅ MVC pattern with controllers
- ✅ Responsive design with SAP Horizon theme
- ✅ CRUD operations (Create, Read, Delete)
- ✅ Message handling (Toast, MessageBox)

## Access

Once running, access:
- **Web Application**: http://localhost:4004
- **OData Service**: http://localhost:4004/catalog/Books

## Railway Deployment

### Prerequisites
- Railway account
- Railway CLI installed (optional)

### Deployment Steps

1. **Connect your repository to Railway:**
   - Go to [Railway](https://railway.app)
   - Create a new project
   - Connect your Git repository

2. **Configure environment:**
   - Railway will automatically detect the `railway.toml` configuration
   - The build process will run `npm install && npm run build`
   - The start command is `npm start`

3. **Deploy:**
   - Railway will automatically deploy on every push to your main branch
   - Or manually trigger a deployment from the Railway dashboard

### Railway Configuration

The project includes:
- `railway.toml` - Railway deployment configuration
- `Procfile` - Process file for Railway
- Build scripts in `package.json` that compile TypeScript before starting

### Environment Variables

No environment variables are required for basic deployment. The application uses SQLite by default.

## Technology Stack

- **Backend**: SAP CAP Framework
- **Language**: TypeScript (server), JavaScript (UI5)
- **Frontend**: SAP UI5 (OpenUI5 SDK)
- **Database**: SQLite (development)
- **Deployment**: Railway

## UI5 Resources

- UI5 is loaded from the OpenUI5 CDN
- Theme: SAP Horizon (modern, accessible theme)
- OData V4 model configured for direct server communication
