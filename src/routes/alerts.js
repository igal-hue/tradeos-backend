const express = require('express');
const pool = require('../db');
const { authMiddleware } = require('./auth');

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const r = await pool.query(
      'SELECT * FROM alerts WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { symbol, type, price } = req.body;
  if (!symbol || !type) return res.status(400).json({ error: 'symbol and type are required' });
  try {
    const r = await pool.query(
      'INSERT INTO alerts (user_id, symbol, type, price) VALUES ($1,$2,$3,$4) RETURNING *',
      [req.user.id, symbol.toUpperCase(), type, price ?? null]
    );
    res.status(201).json(r.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { symbol, type, price, active } = req.body;
  try {
    const r = await pool.query(
      `UPDATE alerts SET
        symbol = COALESCE($1, symbol),
        type   = COALESCE($2, type),
        price  = COALESCE($3, price),
        active = COALESCE($4, active)
       WHERE id = $5 AND user_id = $6 RETURNING *`,
      [symbol ? symbol.toUpperCase() : null, type ?? null, price ?? null, active ?? null, req.params.id, req.user.id]
    );
    if (!r.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(r.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const r = await pool.query(
      'DELETE FROM alerts WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (!r.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
