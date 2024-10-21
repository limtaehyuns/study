const fs = require("fs");

function createFolder() {
  if (!fs.existsSync("./output")) {
    fs.mkdirSync("./output");
  }
}

module.exports = { createFolder };
