var _ = require("underscore");

module.exports = {
  word: random_word
};

function random_word () {
  var word =
    _.shuffle("qwertyuiopasdfghjklzxcvbnm").join("")
    .substring(0, 5 + Math.round(Math.random() * 10));
  return word;
}
