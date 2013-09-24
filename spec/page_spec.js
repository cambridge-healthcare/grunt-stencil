var randoms = require('./randoms');

describe("page", function () {
  var separator = randoms.word();

  var source = require('../lib/source')(separator);

  var process_file = function (processor, file, params) {
    return processor(partials[file], params);
  };

  var page = require('../lib/page')({
    source: source,
    process_file: process_file
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

  it("compiles dot files", function () {
    var text = randoms.word();
    expect(page('{{= "' + text + '" }}')).toEqual(text);
  });

  it("passes data from the header to the content", function () {
    var title = randoms.word();
    var header = JSON.stringify({
      title: title
    });

    var content = '{{= it.title }}';
    expect(page(header + separator + content)).toEqual(title);
  });

  describe("when it has 'include' statements", function() {

    it("includes partials", function () {
      var content = '{{= it.include("asdf") }}';
      expect(page(content)).toEqual(partials.asdf);
    });

    it("has acces to meta data from included partials", function () {
      var content = '{{= it.include("qwer").a }}';
      expect(page(content)).toEqual('1');
    });

    it("compiles partials with doT", function () {
      var content = '{{= it.include("dotted") }}';
      expect(page(content)).toEqual('asdf');
    });

    it("can specify extra parameters to be passed to the partial", function () {
      var content = '{{= it.include("dotted_w_params", {title:"asdf"}) }}';
      expect(page(content)).toEqual('asdf');
    });

  });
});
