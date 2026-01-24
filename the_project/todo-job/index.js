const { Pool } = require('pg');

const URL = process.env.URL;
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const initTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      text TEXT
    )
  `);
};

(async () => {
  try {
    await initTable();
    const res = await fetch(URL, {
      redirect: 'manual'
    });
    const res_url = res.headers.get('Location');
    const text = `Read ${res_url}`;
    await pool.query('INSERT INTO todos (text) VALUES ($1)', [text]);
  } catch (err) {
    console.error(err);
  }
})();
