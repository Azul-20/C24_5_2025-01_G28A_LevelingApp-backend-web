const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: process.env.PG_PORT || 5432,
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || '',
  database: process.env.PG_DATABASE || 'levelingapp',
});

pool.on('connect', () => {
  console.log('Conectado a PostgreSQL correctamente.');
});

pool.on('error', (err) => {
  console.error('Error en la conexión a PostgreSQL:', err.message);
  process.exit(-1);
});

module.exports = pool;
