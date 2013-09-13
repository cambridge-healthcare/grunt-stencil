var _ = require('underscore');

function random_word () {
  var word =
    _.shuffle('qwertyuiopasdfghjklzxcvbnm').join('')
    .substring(0, 5 + Math.round(Math.random() * 10));
  return word;
}

describe("page", function () {
  var separator = random_word();

  var source = require('../lib/source')(separator);
  var page = require('../lib/page')(source);

  it("compiles dot template", function () {
    var text = random_word();
    expect(page('{{= "' + text + '" }}')).toEqual(text);
  });

  it("passes header to template", function () {
    var title = random_word();
    var header = JSON.stringify({
      title: title
    });

    var content = '{{= it.title }}';

    expect(page(header + separator + content)).toEqual(title);
  });
});
