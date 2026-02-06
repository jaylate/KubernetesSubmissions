const fs = require('fs');
const express = require('express');

const app = express();

const PINGS_HEALTH_URL = process.env.PINGS_HEALTH_URL;
const PINGS_URL = process.env.PINGS_URL;

app.get('/healthz', async (req, res) => {
  try {
    const response = await fetch(PINGS_HEALTH_URL);

    if (response.ok) {
      return res.status(200).send('OK');
    } else {
      return res.status(503).send('Service Unavailable');
    }
  } catch (err) {
    console.log('Error fetching ping health URL: ', err);
    return res.status(503).send('Service Unavailable');
  }
});

app.get('/', async (req, res) => {
  let fileContent = '\r\n';
  let envVarContent = process.env.MESSAGE + '\r\n';
  let logContent = '\r\n';
  let pingContent = '0\r\n';
  try {
    fileContent = fs.readFileSync('./config/information.txt', 'utf8');
  } catch (err) {
    console.log(err);
  }
  try {
    logContent = fs.readFileSync('./files/log.txt', 'utf8');
  } catch (err) {
    console.log(err);
  }

  try {
    let pingRes = await fetch(PINGS_URL);
    if (!pingRes.ok) {
      throw new Error(`Ping response status: ${pingRes.status}`);
    }
    pingContent = await pingRes.text();
  } catch (err) {
    console.log(err);
  }

  res.end(
	  'file content: ' + fileContent + '\r\n' +
	  'env variable: MESSAGE=' + envVarContent + '\r\n' +
	  logContent + '\r\n' +
	  'Ping / Pongs: ' + pingContent + '\r\n');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
