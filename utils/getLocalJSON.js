var fs = require("fs");
//import fs from 'fs';

function getJSONFlash(kategori) {
  var content = fs.readFileSync("./database/flash-card/" + kategori + ".json", "utf8");
  var parseJson = JSON.parse(content);
  return parseJson;
}

function getJSONCategory() {
  //var fs = require("fs");
  let content = JSON.parse(fs.readFileSync("./database/category.json", "utf8"));

  return content;
}

module.exports = {
  getJSONFlash,
  getJSONCategory
};
