"use strict";
/**
 * Deals engine: fetches best flight/travel deals from Amadeus API (when configured)
 * or returns curated mock deals. Optimized for Lombok and surf destinations, months ahead.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopDeals = getTopDeals;
const axios_1 = __importDefault(require("axios"));
// IATA code -> display name and image (for Amadeus response mapping)
const DESTINATION_MAP = {
    DPS: { name: 'Bali (DPS)', tagline: 'Uluwatu · Canggu · Bingin', image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600' },
    LOP: { name: 'Lombok (LOP)', tagline: 'Direct flights · Kuta & Senggigi', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600' },
    CGK: { name: 'Jakarta (CGK)', tagline: 'Gateway to Indonesia', image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=600' },
    CMB: { name: 'Sri Lanka (CMB)', tagline: 'Arugam Bay · surf & safari', image: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=600' },
    LIS: { name: 'Lisbon (LIS)', tagline: 'Portugal · Ericeira & Peniche', image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600' },
    // Default for unknown
    __default: { name: 'Travel deal', tagline: 'Best price', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600' }
};
const SKYSCANNER_BASE = 'https://www.skyscanner.com/transport/flights';
function mapAmadeusToDeal(d, index) {
    const mapped = DESTINATION_MAP[d.destination] || DESTINATION_MAP.__default;
    const price = d.price ? '€' + Math.round(parseFloat(d.price)).toString() : '€—';
    const date = d.departureDate || '—';
    return {
        id: 'amadeus-' + index,
        destination: mapped.name,
        tagline: mapped.tagline,
        price,
        date,
        backgroundImage: mapped.image,
        url: `${SKYSCANNER_BASE}/${d.destination.toLowerCase()}/`
    };
}
/** Curated mock deals when API is not configured (Lombok + surf focus, dates months ahead). */
function getMockDeals() {
    return [
        { id: 'l1', destination: 'Lombok (LOP)', tagline: 'Direct flights · Kuta & Senggigi', price: '€489', date: 'Mar – May 2025', backgroundImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600', url: `${SKYSCANNER_BASE}/lop/` },
        { id: 'l2', destination: 'Bali → Lombok', tagline: 'Island hop · Surf & culture', price: '€329', date: 'Apr – Jun 2025', backgroundImage: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600', url: `${SKYSCANNER_BASE}/bali/lombok/` },
        { id: 'l3', destination: 'Lombok + Gili Islands', tagline: 'Diving & beaches', price: '€599', date: 'May – Jul 2025', backgroundImage: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600', url: 'https://www.booking.com/searchresults.html?ss=Lombok+Gili' },
        { id: 'l4', destination: 'Jakarta → Lombok', tagline: 'Domestic connector', price: '€89', date: 'Ongoing', backgroundImage: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=600', url: `${SKYSCANNER_BASE}/cgk/lop/` },
        { id: 's1', destination: 'Mentawai Islands', tagline: 'World-class surf camps', price: '€1,199', date: 'Apr – Oct 2025', backgroundImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600', url: 'https://www.surfholidays.com/mentawai-islands' },
        { id: 's2', destination: 'Bali (DPS)', tagline: 'Uluwatu · Canggu · Bingin', price: '€549', date: 'Mar – Sep 2025', backgroundImage: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600', url: `${SKYSCANNER_BASE}/dps/` },
        { id: 's3', destination: 'Sri Lanka', tagline: 'Arugam Bay · surf & safari', price: '€699', date: 'May – Sep 2025', backgroundImage: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=600', url: `${SKYSCANNER_BASE}/cmb/` },
        { id: 's4', destination: 'Peniche, Portugal', tagline: 'Europe surf capital', price: '€279', date: 'Sep – Nov 2025', backgroundImage: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600', url: 'https://www.booking.com/searchresults.html?ss=Peniche' },
        { id: 's5', destination: 'Ericeira, Portugal', tagline: 'World Surf Reserve', price: '€349', date: 'Jun – Oct 2025', backgroundImage: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600', url: 'https://www.booking.com/searchresults.html?ss=Ericeira' }
    ];
}
/** Get OAuth token from Amadeus. */
async function getAmadeusToken(apiKey, apiSecret) {
    const res = await axios_1.default.post('https://test.api.amadeus.com/v1/security/oauth2/token', new URLSearchParams({ grant_type: 'client_credentials', client_id: apiKey, client_secret: apiSecret }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    return res.data.access_token;
}
/** Fetch flight inspiration from Amadeus (best deals from origin). */
async function fetchAmadeusDeals(origin, token, maxPrice) {
    const params = { origin };
    if (maxPrice)
        params.maxPrice = String(maxPrice);
    const res = await axios_1.default.get('https://test.api.amadeus.com/v1/shopping/flight-destinations', {
        params,
        headers: { Authorization: 'Bearer ' + token }
    });
    const data = res.data?.data || [];
    return data.slice(0, 15).map((d, i) => mapAmadeusToDeal(d, i));
}
/** Fetch deals from the Docker flight-scraper service (when FLIGHT_SCRAPER_URL is set). */
async function fetchScraperDeals(baseUrl, origin) {
    const url = `${baseUrl.replace(/\/$/, '')}/deals?origin=${encodeURIComponent(origin)}`;
    const res = await axios_1.default.get(url, { timeout: 25000 });
    return res.data;
}
/**
 * Returns best deals: from flight-scraper (Docker) if FLIGHT_SCRAPER_URL is set,
 * else from Amadeus if AMADEUS_API_KEY and AMADEUS_API_SECRET are set,
 * otherwise curated mock deals (price + date visible, Lombok/surf focus).
 */
async function getTopDeals(origin) {
    const scraperUrl = process.env.FLIGHT_SCRAPER_URL;
    const originCode = (origin || 'PRG').toUpperCase().slice(0, 3);
    if (scraperUrl) {
        try {
            return await fetchScraperDeals(scraperUrl, originCode);
        }
        catch (e) {
            const err = e;
            console.warn('Flight scraper failed, falling back:', err?.message);
        }
    }
    const apiKey = process.env.AMADEUS_API_KEY;
    const apiSecret = process.env.AMADEUS_API_SECRET;
    if (apiKey && apiSecret) {
        try {
            const token = await getAmadeusToken(apiKey, apiSecret);
            const all = await fetchAmadeusDeals(originCode, token, 1500);
            // Split into “Lombok/Indonesia” vs “surf” by destination
            const lombok = all.filter(d => /Lombok|Bali|Jakarta|LOP|DPS|CGK|Gili/i.test(d.destination));
            const surfing = all.filter(d => !/Lombok|Bali|Jakarta|LOP|DPS|CGK|Gili/i.test(d.destination));
            return {
                lombok: lombok.length ? lombok : all.slice(0, 5),
                surfing: surfing.length ? surfing : all.slice(5, 10)
            };
        }
        catch (e) {
            const err = e;
            console.warn('Amadeus API failed, using mock deals:', err?.response?.data || err?.message);
        }
    }
    const mock = getMockDeals();
    return {
        lombok: mock.filter(d => ['l1', 'l2', 'l3', 'l4'].includes(d.id)),
        surfing: mock.filter(d => ['s1', 's2', 's3', 's4', 's5'].includes(d.id))
    };
}
//# sourceMappingURL=dealsEngine.js.map