const crypto = require("crypto");
let uuid = crypto.randomUUID();

setInterval(() => {
	console.log(`${new Date().toISOString()}: ${uuid}`);
}, 5000);
