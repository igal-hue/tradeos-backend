const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRouter     = require('./routes/auth');
const alertsRouter   = require('./routes/alerts');
const watchlistRouter= require('./routes/watchlist');
const positionsRouter= require('./routes/positions');
const tradesRouter   = require('./routes/trades');
const settingsRouter = require('./routes/settings');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'TradeOS Backend is running!' });
});

app.use('/api/auth',      authRouter);
app.use('/api/alerts',    alertsRouter);
app.use('/api/watchlist', watchlistRouter);
app.use('/api/positions', positionsRouter);
app.use('/api/trades',    tradesRouter);
app.use('/api/settings',  settingsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
