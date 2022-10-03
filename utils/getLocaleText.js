var fs = require("fs");

function getLocale(locale, file) {
  var content = fs.readFileSync("./database/translation/" + locale + "/" + file + ".json", "utf8");
  var parseJson = JSON.parse(content);
  return parseJson;
}

module.exports = {
    getLocale,
};
