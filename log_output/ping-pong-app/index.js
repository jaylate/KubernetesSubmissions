const fs = require('fs');
const express = require('express');

let counter = 0;
let app = express();

app.get('/pings', (req, res) => {
  try {
    res.end(`${counter}\r\n`);
  } catch (err) {
    next(err);
  }
});

app.get('/pingpong', (req, res) => {
  try {
    counter++;
    res.end(`pong ${counter}\r\n`);
  } catch (err) {
    next(err);
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
