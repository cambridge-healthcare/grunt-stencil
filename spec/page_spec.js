var randoms = require('./randoms');

describe("page", function () {
  var separator = randoms.word();

  var source = require('../lib/source')(separator);

  var include = require('../lib/include')({
    read: function (name) { return partials[name] }
  });

  var page = require('../lib/page')({
    source: source,
    include: include
  });

  var partials = {
    asdf: randoms.word(),
    qwer: '{"a":1}'
  };

  function read_partial_source (path) {
    return partials[path];
  }

  it("compiles dot template", function () {
    var text = randoms.word();
    expect(page('{{= "' + text + '" }}')).toEqual(text);
  });

  it("passes header to template", function () {
    var title = randoms.word();
    var header = JSON.stringify({
      title: title
    });

    var content = '{{= it.title }}';

    expect(page(header + separator + content)).toEqual(title);
  });

  it("includes partials", function () {
    var content = '{{= it.include("asdf") }}';

    expect(page(content)).toEqual(partials.asdf);
  });

  it("has partial's header fields available", function () {
    var content = '{{= it.include("qwer").a }}';
    expect(page(content)).toEqual('1');
  });
});
