const express = require('express');
const router = express.Router();

const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
const BASE_URL = 'https://api.polygon.io';

// GET /api/market/quote/:ticker
router.get('/quote/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    const url = `${BASE_URL}/v2/last/trade/${ticker.toUpperCase()}?apiKey=${POLYGON_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/market/bars/:ticker
router.get('/bars/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    const { from, to, timespan = 'day' } = req.query;
    const fromDate = from || new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0];
    const toDate = to || new Date().toISOString().split('T')[0];
    const url = `${BASE_URL}/v2/aggs/ticker/${ticker.toUpperCase()}/range/1/${timespan}/${fromDate}/${toDate}?apiKey=${POLYGON_API_KEY}&limit=500`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/market/search/:query
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const url = `${BASE_URL}/v3/reference/tickers?search=${query}&active=true&apiKey=${POLYGON_API_KEY}&limit=10`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
