const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.urlencoded({ extended: true }));

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
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        text TEXT
      )
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

app.get('/todos', async (req, res) => {
  try {
    const query = {
      text: "SELECT text FROM todos",
      rowMode: 'array',
    };
    const queryRes = await pool.query(query);
    res.json(queryRes.rows ?? []);
  } catch (err) {
    console.error(err);
    return res.status(503).send('Service Unavailable');
  }
});

app.post('/todos', async (req, res) => {
  try {
    const text = req.body.todoText;
    if (text.length > 140) {
      console.log(`Rejected todo: ${text}`);
    } else {
      console.log(`Accepted todo: ${text}`);
      await pool.query("INSERT INTO todos (text) VALUES ($1)", [text]);
    }
    res.redirect('/');
  } catch (err) {
    console.error(err);
    return res.status(503).send('Service Unavailable');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
