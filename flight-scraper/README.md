# Flight Scraper (Docker)

Custom service that runs in Docker and provides flight deals **from Prague** (or another origin). The CAP app calls it when `FLIGHT_SCRAPER_URL` is set.

## Quick start

```bash
# From repo root
docker compose up -d flight-scraper
```

Then in your CAP app set:

```bash
export FLIGHT_SCRAPER_URL=http://localhost:3000
npm run watch
```

If CAP runs in another Docker container on the same compose network, use `http://flight-scraper:3000` instead.

## API

- **GET /health** – `{ "status": "ok", "service": "flight-scraper" }`
- **GET /deals?origin=PRG** – `{ "lombok": Deal[], "surfing": Deal[] }` (same shape the CAP app expects)

## Behaviour

- **Default (`SCRAPE=false`):** Returns static Prague-origin deals (Lombok, Bali, Sri Lanka, Lisbon, etc.) with prices and Skyscanner links. No scraping.
- **With `SCRAPE=true`:** Tries to scrape Kiwi.com for Prague → LOP, DPS, CGK, CMB, LIS and fills in prices when possible. Many sites use anti-bot protection, so scraping may be blocked or rate-limited; on failure the service still returns the static deals.

## Build and run (Docker)

```bash
cd flight-scraper
docker build -t flight-scraper .
docker run -p 3000:3000 -e SCRAPE=false flight-scraper
```

## Run locally (no Docker)

```bash
cd flight-scraper
npm install
PORT=3000 node server.js
```

Scraping locally uses a downloaded Chromium (from Puppeteer). In Docker the image uses system Chromium.

## Legal / ToS

Scraping flight sites may violate their terms of service. Use at your own risk. For production, prefer official APIs (e.g. Amadeus) and set `AMADEUS_API_KEY` / `AMADEUS_API_SECRET` in the CAP app instead of the scraper.
