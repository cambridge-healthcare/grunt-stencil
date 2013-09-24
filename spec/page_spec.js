var randoms = require('./randoms');

describe("page", function () {
  var separator = randoms.word();

  var source = require('../lib/source')(separator);

  var include = function (process, name) { return process(partials[name]) };

  var page = require('../lib/page')({
    source: source,
    include: include
  });

  var partials = {
    asdf: randoms.word(),
    qwer: '{"a":1}',
    dotted: '{{= "asdf" }}',
    dotted_w_header: '{"title":"asdf"}' + separator + '{{= it.title }}',
    dotted_w_params: '{{= it.title }}'
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

  it("compiles partials with doT", function () {
    var content = '{{= it.include("dotted") }}';
    expect(page(content)).toEqual('asdf');
  });

  it("partial's template access it's header", function () {
    var content = '{{= it.include("dotted_w_header") }}';
    expect(page(content)).toEqual('asdf');
  });

  it("partial can access extra properties passed in", function () {
    var content = '{{= it.include("dotted_w_params", {title:"asdf"}) }}';
    expect(page(content)).toEqual('asdf');
  });
});
