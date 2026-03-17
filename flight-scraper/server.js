/**
 * Flight scraper service – runs in Docker.
 * GET /deals?origin=PRG  →  { lombok: Deal[], surfing: Deal[] }
 * Tries to scrape Kiwi.com for Prague → target routes; falls back to static deals if blocked/fail.
 */

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Target routes from Prague: Lombok/surf destinations (Kiwi uses IATA codes in URL)
const ROUTES = [
  { dest: 'LOP', name: 'Lombok (LOP)', tagline: 'Direct flights · Kuta & Senggigi', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600', category: 'lombok' },
  { dest: 'DPS', name: 'Bali (DPS)', tagline: 'Uluwatu · Canggu · Bingin', image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600', category: 'surfing' },
  { dest: 'CGK', name: 'Jakarta (CGK)', tagline: 'Gateway to Indonesia', image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=600', category: 'lombok' },
  { dest: 'CMB', name: 'Sri Lanka (CMB)', tagline: 'Arugam Bay · surf & safari', image: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=600', category: 'surfing' },
  { dest: 'LIS', name: 'Lisbon (LIS)', tagline: 'Portugal · Ericeira & Peniche', image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600', category: 'surfing' }
];

const SKYSCANNER_BASE = 'https://www.skyscanner.com/transport/flights';
const KIWI_BASE = 'https://www.kiwi.com/en/search/results';

function staticDeals(origin) {
  const o = (origin || 'PRG').toUpperCase().slice(0, 3);
  return {
    lombok: [
      { id: 'l1', destination: 'Lombok (LOP)', tagline: 'Direct flights · Kuta & Senggigi', price: '€489', date: 'Mar – May 2025', backgroundImage: ROUTES[0].image, url: `${SKYSCANNER_BASE}/${o.toLowerCase()}/lop/` },
      { id: 'l2', destination: 'Bali → Lombok', tagline: 'Island hop · Surf & culture', price: '€329', date: 'Apr – Jun 2025', backgroundImage: ROUTES[1].image, url: `${SKYSCANNER_BASE}/${o.toLowerCase()}/lop/` },
      { id: 'l3', destination: 'Jakarta → Lombok', tagline: 'Domestic connector', price: '€89', date: 'Ongoing', backgroundImage: ROUTES[2].image, url: `${SKYSCANNER_BASE}/${o.toLowerCase()}/cgk/` }
    ],
    surfing: [
      { id: 's1', destination: 'Bali (DPS)', tagline: 'Uluwatu · Canggu · Bingin', price: '€549', date: 'Mar – Sep 2025', backgroundImage: ROUTES[1].image, url: `${SKYSCANNER_BASE}/${o.toLowerCase()}/dps/` },
      { id: 's2', destination: 'Sri Lanka (CMB)', tagline: 'Arugam Bay · surf & safari', price: '€699', date: 'May – Sep 2025', backgroundImage: ROUTES[3].image, url: `${SKYSCANNER_BASE}/${o.toLowerCase()}/cmb/` },
      { id: 's3', destination: 'Lisbon (LIS)', tagline: 'Portugal · Ericeira & Peniche', price: '€279', date: 'Jun – Oct 2025', backgroundImage: ROUTES[4].image, url: `${SKYSCANNER_BASE}/${o.toLowerCase()}/lis/` }
    ]
  };
}

function parsePrice(text) {
  if (!text || typeof text !== 'string') return null;
  const m = text.replace(/\s/g, '').match(/(\d{1,4}(?:[.,]\d{2})?)/);
  return m ? '€' + m[1].replace(',', '.') : null;
}

async function scrapeKiwi(origin, dest) {
  let browser;
  try {
    const puppeteer = require('puppeteer');
    const opts = {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    };
    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
      opts.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    }
    browser = await puppeteer.launch(opts);
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });

    const url = `${KIWI_BASE}/${origin}-${dest}/anytime`;
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });

    await page.waitForSelector('[data-test="ResultCard"], [class*="ResultCard"], [class*="result-card"], .result-card', { timeout: 10000 }).catch(() => null);

    const results = await page.evaluate(() => {
      const cards = document.querySelectorAll('[data-test="ResultCard"], [class*="ResultCard"], [class*="result-card"], .result-card, [class*="SearchResult"]');
      return Array.from(cards).slice(0, 5).map(card => {
        const text = card.innerText || card.textContent || '';
        const priceEl = card.querySelector('[class*="price"], [class*="Price"], [data-test*="price"]');
        return { text: text.slice(0, 500), priceText: priceEl ? priceEl.innerText : '' };
      });
    });

    await browser.close();
    const first = results[0];
    const priceStr = first && (first.priceText || first.text);
    const price = parsePrice(priceStr);
    return { price, raw: first };
  } catch (e) {
    if (browser) await browser.close().catch(() => {});
    return { price: null, error: e.message };
  }
}

async function getDeals(origin) {
  const o = (origin || 'PRG').toUpperCase().slice(0, 3);
  const useScraping = process.env.SCRAPE === 'true' || process.env.SCRAPE === '1';

  if (!useScraping) {
    return staticDeals(o);
  }

  const lombok = [];
  const surfing = [];
  let idx = 0;

  for (const r of ROUTES) {
    const scraped = await scrapeKiwi(o, r.dest);
    const price = scraped.price || '€—';
    const date = 'See calendar';
    const deal = {
      id: 'scraped-' + (idx++),
      destination: r.name,
      tagline: r.tagline,
      price,
      date,
      backgroundImage: r.image,
      url: `${SKYSCANNER_BASE}/${o.toLowerCase()}/${r.dest.toLowerCase()}/`
    };
    if (r.category === 'lombok') lombok.push(deal);
    else surfing.push(deal);
  }

  if (lombok.length === 0 && surfing.length === 0) return staticDeals(o);
  return { lombok, surfing };
}

// Calendar view: return flight costs by month (Skyscanner-style flexible dates)
function staticCalendar(origin, destination) {
  const o = (origin || 'PRG').toUpperCase().slice(0, 3);
  const d = (destination || 'LOP').toUpperCase().slice(0, 3);
  return {
    origin: o,
    destination: d,
    rows: [
      { id: '1', month: '2026 March', price: '29,820', priceNote: null, isCheapest: false },
      { id: '2', month: '2026 April', price: '19,659', priceNote: null, isCheapest: false },
      { id: '3', month: '2026 May', price: '19,853', priceNote: null, isCheapest: false },
      { id: '4', month: '2026 June', price: null, priceNote: 'Continue to prices', isCheapest: false },
      { id: '5', month: '2026 July', price: '20,132', priceNote: null, isCheapest: false },
      { id: '6', month: '2026 August', price: null, priceNote: 'Continue to prices', isCheapest: false },
      { id: '7', month: '2026 September', price: '17,433', priceNote: null, isCheapest: true },
      { id: '8', month: '2026 October', price: '18,794', priceNote: null, isCheapest: false },
      { id: '9', month: '2026 November', price: null, priceNote: 'Continue to prices', isCheapest: false },
      { id: '10', month: '2026 December', price: '20,307', priceNote: null, isCheapest: false },
      { id: '11', month: '2027 January', price: null, priceNote: 'Continue to prices', isCheapest: false },
      { id: '12', month: '2027 February', price: null, priceNote: 'Continue to prices', isCheapest: false }
    ]
  };
}

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'flight-scraper' }));

app.get('/calendar', (req, res) => {
  const origin = req.query.origin || 'PRG';
  const destination = req.query.destination || 'LOP';
  const data = staticCalendar(origin, destination);
  res.set('Cache-Control', 'public, max-age=300');
  res.json(data);
});

app.get('/deals', async (req, res) => {
  try {
    const origin = req.query.origin || 'PRG';
    const data = await getDeals(origin);
    res.set('Cache-Control', 'public, max-age=300');
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message, fallback: staticDeals(req.query.origin || 'PRG') });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Flight scraper listening on ${PORT}. GET /deals?origin=PRG`);
});
