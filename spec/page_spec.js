var random = require('./random');
var parse = require('../lib/parse')('\n\n');
var page = require('../lib/page');

describe("page", function () {

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


  it("has access to fields in the input's header", function() {
    input = JSON.stringify({title: "asdf"}) + "\n\nContent";
    var compile = page({parser: parse});
    expect(compile(input).title).toEqual("asdf");
  });

  describe("when a dot compiler is given", function() {
    it("uses given dotvar object and template settings", function() {
      input = "{{= x.variable }}";
      var compile = page({
        compilers: [new (require('../lib/dot_compiler'))({
          dotvar: {variable: 123},
          template_settings: {varname: "x"}
        })],
        parser: parse
      });
      expect(compile(input).toString()).toEqual("123");
    });
  });

  describe("when no compilers are given", function() {
    it("returns the same string", function() {
      var compile = page({parser: parse});
      expect(compile(input).toString()).toEqual(input);
    });
  });
});
