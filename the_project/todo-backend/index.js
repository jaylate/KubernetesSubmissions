const http = require('http');

let todoList = [
  'Learn JavaScript',
  'Learn React',
  'Build a project'
];

const server = http.createServer((req, res) => {
  if (req.method == 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    res.end(JSON.stringify(todoList));
  } else if (req.method == 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      todoList.push(new URLSearchParams(body).get('todoText'));
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
