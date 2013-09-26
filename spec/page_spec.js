var random = require('./random');
var parse = require('../lib/parse')('\n\n');

describe("page", function () {

  var page = require('../lib/page');

  var compilers = [
    {compile: function (x) { return "Compiling " + x; }},
    {compile: function (x) { return "%" + x + "%"; }},
    {compile: function (x) { return x + "!"; }}
  ];

  var input;
  beforeEach(function() {
    input = random.word();
  });

  it("compiles the input with a given function", function() {
    var compile = page({
      compilers: [compilers[0]],
      parser: parse
    });
    expect(compile(input).toString()).toEqual("Compiling " + input);
  });

  it("follows the order in which compilers are specified when compiling", function() {
    var compile = page({
      compilers: [compilers[0], compilers[1], compilers[2]],
      parser: parse
    });
    expect(compile(input).toString()).toEqual("%Compiling " + input + "%!");
  });

  it("uses dot's settings when compiling with dot", function() {
    input = "{{= x.variable }}";
    var compile = page({
      compilers: [new (require('../lib/dot_compiler'))({
        it: {variable: 123},
        template_settings: {varname: "x"}
      })],
      parser: parse
    });
    expect(compile(input).toString()).toEqual("123");
  });

  it("has access to fields in the input's header", function() {
    input = JSON.stringify({title: "asdf"}) + "\n\nContent";
    var compile = page({parser: parse});
    expect(compile(input).title).toEqual("asdf");
  });

  describe("when no compilers are given", function() {
    it("returns the same string", function() {
      var compile = page({parser: parse});
      expect(compile(input).toString()).toEqual(input);
    });
  });


//===============================================

  xit("compiles dot files", function () {
    var text = random.word();
    expect(page('{{= "' + text + '" }}')).toEqual(text);
  });

  xit("passes data from the header to the content", function () {
    var title = random.word();
    var header = JSON.stringify({
      title: title
    });

    var content = '{{= it.title }}';
    expect(page(header + content)).toEqual(title);
  });

  xdescribe("when it has an 'include' statement", function() {

    it("includes a partial", function () {
      var content = '{{= it.include("asdf") }}';
      expect(page(content)).toEqual(partials.asdf);
    });

    it("has acces to meta data from the included partial", function () {
      var content = '{{= it.include("qwer").a }}';
      expect(page(content)).toEqual('1');
    });

    it("compiles the partial with doT", function () {
      var content = '{{= it.include("dotted") }}';
      expect(page(content)).toEqual('asdf');
    });

    it("can specify extra parameters to be passed to the partial", function () {
      var content = '{{= it.include("dotted_w_params", {title:"asdf"}) }}';
      expect(page(content)).toEqual('asdf');
    });

    it("can process other include statements inside this one", function() {
      var content = '{{= it.include("nested_include") }} Hello';
      expect(page(content)).toEqual(partials.asdf + ' Hello');
    });
  });
});
