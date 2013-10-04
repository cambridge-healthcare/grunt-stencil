"use strict";

var random = require("./random");
var trim = require("./trim");

describe("markdown_compiler", function () {

  var compiler = require("../lib/markdown_compiler");

  describe("applies_to", function () {
    it("returns true for a markdown path", function () {
      expect(compiler.applies_to("file.md")).toEqual(true);
      expect(compiler.applies_to("file.dot.md.haml")).toEqual(true);
    });

    it("returns false for a non-markdown path", function () {
      expect(compiler.applies_to("file.html")).toEqual(false);
    });
  });

  describe("compile", function () {
    it("compiles markdown", function () {
      var content = random.word();
      expect(trim(compiler.compile(content))).toEqual("<p>" + content + "</p>");
    });
  });
});
