const pool = require('./db');

async function run() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS watchlist (
        id         SERIAL PRIMARY KEY,
        user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        symbol     VARCHAR(20) NOT NULL,
        added_at   TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, symbol)
      );

      DROP TABLE IF EXISTS alerts CASCADE;
      CREATE TABLE alerts (
        id         SERIAL PRIMARY KEY,
        user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        symbol     VARCHAR(20) NOT NULL,
        type       VARCHAR(30) NOT NULL,
        price      DECIMAL,
        active     BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS positions (
        id         SERIAL PRIMARY KEY,
        user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        symbol     VARCHAR(20) NOT NULL,
        entry      DECIMAL NOT NULL,
        stop       DECIMAL,
        target     DECIMAL,
        qty        DECIMAL NOT NULL,
        date       DATE DEFAULT CURRENT_DATE,
        current    DECIMAL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS trades (
        id            SERIAL PRIMARY KEY,
        user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        symbol        VARCHAR(20) NOT NULL,
        entry         DECIMAL NOT NULL,
        exit          DECIMAL,
        stop          DECIMAL,
        qty           DECIMAL NOT NULL,
        date          DATE DEFAULT CURRENT_DATE,
        setup         VARCHAR(50),
        emotion       VARCHAR(20),
        followed_plan BOOLEAN DEFAULT true,
        notes         TEXT,
        pnl           DECIMAL,
        result        VARCHAR(10),
        created_at    TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS user_settings (
        id              SERIAL PRIMARY KEY,
        user_id         INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        portfolio       DECIMAL DEFAULT 50000,
        risk_per_trade  DECIMAL DEFAULT 1,
        max_daily_loss  DECIMAL DEFAULT 3,
        style           VARCHAR(20) DEFAULT 'swing',
        experience      VARCHAR(20) DEFAULT 'beginner',
        updated_at      TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('All tables created successfully!');
  } catch (err) {
    console.error('Migration error:', err.message);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

run();
