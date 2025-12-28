const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  let logContent = "\r\n";
  let pingContent = "0\r\n";
  try {
    logContent = fs.readFileSync("./files/log.txt", "utf8");
  } catch (err) {}

  try {
    pingContent = fs.readFileSync("./files/ping.txt", "utf8");
  } catch (err) {}

  res.end(logContent+
	  "Ping / Pongs: "+pingContent);
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
