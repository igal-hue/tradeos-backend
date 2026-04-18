const express = require('express');
const pool = require('../db');
const { authMiddleware } = require('./auth');

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const r = await pool.query(
      'SELECT * FROM trades WHERE user_id = $1 ORDER BY date DESC, created_at DESC',
      [req.user.id]
    );
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { symbol, entry, exit, stop, qty, date, setup, emotion, followed_plan, notes, pnl, result } = req.body;
  if (!symbol || entry == null || qty == null) {
    return res.status(400).json({ error: 'symbol, entry and qty are required' });
  }
  try {
    const r = await pool.query(
      `INSERT INTO trades (user_id, symbol, entry, exit, stop, qty, date, setup, emotion, followed_plan, notes, pnl, result)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [req.user.id, symbol.toUpperCase(), entry, exit ?? null, stop ?? null, qty,
       date ?? null, setup ?? null, emotion ?? null, followed_plan ?? true,
       notes ?? null, pnl ?? null, result ?? null]
    );
    res.status(201).json(r.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const r = await pool.query(
      'DELETE FROM trades WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (!r.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
