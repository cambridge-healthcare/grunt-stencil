var _ = require('underscore');

function random_word () {
  var word =
    _.shuffle('qwertyuiopasdfghjklzxcvbnm').join('')
    .substring(0, 5 + Math.round(Math.random() * 10));
  return word;
}

describe("page", function () {
  var page = require('../lib/page');

  it("compiles dot template", function () {
    var text = random_word();
    expect(page('{{= "' + text + '" }}')).toEqual(text);
  });
});
