const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(fs.readFileSync("./files/log.txt", "utf8"));
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
