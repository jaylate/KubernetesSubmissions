const crypto = require("crypto");
const fs = require("fs");

let uuid = crypto.randomUUID();
let date;

setInterval(() => {
  date = new Date().toISOString();
  fs.appendFileSync("./files/log.txt", `${date}: ${uuid}\r\n`);
}, 5000);
