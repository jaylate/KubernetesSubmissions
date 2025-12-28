const fs = require("fs");
const http = require("http");

let counter = 0;
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  counter++;
  res.end(`pong ${counter}\r\n`);
  fs.writeFileSync("./files/ping.txt", `${counter}\r\n`);
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
