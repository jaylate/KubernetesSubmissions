const http = require('http');
const { Pool } = require('pg');

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

initTable();

const server = http.createServer(async (req, res) => {
  if (req.method == 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    const query = {
      text: "SELECT text FROM todos",
      rowMode: 'array',
    };
    const queryRes = await pool.query(query);
    res.end(JSON.stringify(queryRes.rows ?? []));
  } else if (req.method == 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      const text = new URLSearchParams(body).get('todoText');
      if (text.length > 140) {
	console.log(`Rejected todo: ${text}`);
      } else {
	console.log(`Accepted todo: ${text}`);
	await pool.query("INSERT INTO todos (text) VALUES ($1)", [text]);
      }

      res.writeHead(302, {
	'Location': '/' // Redirect back to root
      });
      res.end();
    });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
