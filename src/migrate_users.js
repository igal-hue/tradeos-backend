const pool = require('./db');

async function migrateUsers() {
  const client = await pool.connect();
  try {
    // Drop old users table (CASCADE handles alerts/trade_journal foreign keys)
    await client.query('DROP TABLE IF EXISTS users CASCADE');

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        country VARCHAR(50),
        experience VARCHAR(20),
        portfolio_size VARCHAR(20),
        trading_style VARCHAR(20),
        disclaimer_signed BOOLEAN DEFAULT false,
        disclaimer_signed_at TIMESTAMP,
        signature VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('Users table created successfully!');
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

migrateUsers();
