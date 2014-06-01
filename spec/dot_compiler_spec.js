"use strict";

var random = require("./random");
var dot_compiler_setup = require("../lib/dot_compiler");

describe("dot_compiler", function() {
  describe("compile", function () {

    it("compiles dot templates", function() {
      var compiler = dot_compiler_setup({});
      var word = random.word();
      var content = "{{= \"" + word + "\" }}";
      expect(compiler.compile(content)).toEqual(word);
    });

    it("uses the dotvar parameters passed to it", function() {
      var title = random.word();
      var compiler = dot_compiler_setup({
        dotvar: {title: title}
      });
      var content = "{{= it.title }}";
      expect(compiler.compile(content)).toEqual(title);
    });

    it("uses the dot template settings passed to it", function() {
      var title = random.word();
      var compiler = dot_compiler_setup({
        dotvar: {title: title},
        template_settings: {varname: "newvar"}
      });
      var content = "{{= newvar.title }}";
      expect(compiler.compile(content)).toEqual(title);
    });

  });

  describe("applies_to", function () {
    var compiler = dot_compiler_setup({});

    it("returns true for a dot path", function () {
      expect(compiler.applies_to("file.dot.md")).toEqual(true);
      expect(compiler.applies_to("file.html")).toEqual(true);
    });


    it("returns false for a non-dot path", function () {
      expect(compiler.applies_to("file.asdf")).toEqual(false);
    });
  });
});
