import mysql from 'mysql2/promise';
import { env } from './env.js';

export const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Fail fast with a helpful message if MySQL is unreachable / DB is missing.
try {
  const conn = await pool.getConnection();
  conn.release();
  console.log(`[db] Connected to MySQL database "${env.db.database}"`);
} catch (err) {
  console.error('[db] Could not connect to MySQL.');
  console.error('[db] 1) Create the database:  mysql -u root -p < schema.sql   (run from backend/)');
  console.error('[db] 2) Copy .env.example to .env and set DB_USER / DB_PASSWORD.');
  console.error(`[db] Original error: ${err.message}`);
  process.exit(1);
}
