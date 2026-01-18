const http = require("http");
const fs = require("fs");

const PINGS_URL = process.env.PINGS_URL;
const server = http.createServer(async (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  let logContent = "\r\n";
  let pingContent = "0\r\n";
  try {
    logContent = fs.readFileSync("./files/log.txt", "utf8");
  } catch (err) {}

  try {
    let pingRes = await fetch(PINGS_URL);
    if (!pingRes.ok) {
      throw new Error(`Ping response status: ${pingRes.status}`);
    }
    pingContent = await pingRes.text();
  } catch (err) {
    console.log(err);
  }

  console.log(pingContent);
  res.end(logContent+
	  "Ping / Pongs: "+pingContent);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
