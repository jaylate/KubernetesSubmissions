const fs = require('fs');
const express = require('express');
const { Pool } = require('pg');

const app = express();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const initTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pings (
        id INTEGER PRIMARY KEY DEFAULT 1,
        counter INTEGER DEFAULT 0
      )
    `);
    await pool.query(`
      INSERT INTO pings (counter)
      VALUES (0)
      ON CONFLICT (id) DO NOTHING
    `);
  } catch (err) {
    console.error(err);
  }
};

initTable();

app.get('/healthz', async (req, res) => {
  try {
    const client = await pool.connect();
    client.release();
    return res.status(200).send('OK');
  } catch (err) {
    console.error('Pool is not ready:', err);
    return res.status(503).send('Service Unavailable');
  }
});

app.get('/pings', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT counter FROM pings WHERE id = 1
    `);
    const counter = result.rows.length > 0
      ? result.rows[0].counter
      : 0;
    res.end(`${counter}\r\n`);
  } catch (err) {
    console.error(err);
    return res.status(503).send('Service Unavailable');
  }
});

app.get('/pingpong', async (req, res) => {
  try {
    const result = await pool.query(`
      UPDATE pings SET counter = counter + 1
      WHERE id = 1 RETURNING counter
    `);
    const counter = result.rows.length > 0
      ? result.rows[0].counter
      : 0;
    res.end(`pong ${counter}\r\n`);
  } catch (err) {
    console.error(err);
    return res.status(503).send('Service Unavailable');
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
