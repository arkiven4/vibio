var fs = require("fs");

function getJSONFlash(kategori) {
  var content = fs.readFileSync("./database/flash-card/" + kategori + ".json", "utf8");
  var parseJson = JSON.parse(content);
  return parseJson;
}

module.exports = {
  getJSONFlash,
};
