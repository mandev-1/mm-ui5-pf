# Flight Table (HeroUI v3)

Simple table of **return flight costs by month** (Skyscanner-style flexible dates), built with **HeroUI v3** and Tailwind v4. Runs in Docker.

## Data

- **Route:** Czech Republic (Prague) → Lombok International
- **Columns:** Month, From (return price in Kč), Note (e.g. "Cheapest month")
- Data is static by default. Optionally, set `VITE_DEALS_API` to the flight-scraper base URL (e.g. `http://localhost:3000`) at **build time** so the app fetches from `GET /calendar?origin=PRG&destination=LOP`.

## Run with Docker

From repo root:

```bash
docker compose up -d flight-table
```

Open **http://localhost:5174**

## Run locally

```bash
cd flight-table
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
```

Output is in `dist/` (static files for nginx in Docker).
