const express = require('express');
const cors = require('cors');
require('dotenv').config();

const alertsRouter = require('./routes/alerts');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'TradeOS Backend is running!' });
});

app.use('/api/alerts', alertsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});