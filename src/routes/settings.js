const express = require('express');
const pool = require('../db');
const { authMiddleware } = require('./auth');

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const r = await pool.query(
      'SELECT * FROM user_settings WHERE user_id = $1',
      [req.user.id]
    );
    res.json(r.rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/', async (req, res) => {
  const { portfolio, risk_per_trade, max_daily_loss, style, experience } = req.body;
  try {
    const r = await pool.query(
      `INSERT INTO user_settings (user_id, portfolio, risk_per_trade, max_daily_loss, style, experience, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,NOW())
       ON CONFLICT (user_id) DO UPDATE SET
         portfolio      = COALESCE($2, user_settings.portfolio),
         risk_per_trade = COALESCE($3, user_settings.risk_per_trade),
         max_daily_loss = COALESCE($4, user_settings.max_daily_loss),
         style          = COALESCE($5, user_settings.style),
         experience     = COALESCE($6, user_settings.experience),
         updated_at     = NOW()
       RETURNING *`,
      [req.user.id, portfolio ?? null, risk_per_trade ?? null, max_daily_loss ?? null, style ?? null, experience ?? null]
    );
    res.json(r.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
