// Centralized PostgreSQL DB connection using pg.Pool
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Optional: uncomment if using self-signed SSL certs
  // ssl: { rejectUnauthorized: false },
});

// Optional: log all queries in non-production environments
const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
  query: (text, params) => {
    if (isDev) {
      console.log(`[DB QUERY] ${text}`);
      if (params) console.log(`[DB PARAMS]`, params);
    }

    return pool.query(text, params);
  },
};
