"use strict";

var random = require("./random");
var compilers_setup = require("../lib/compilers");

describe("compilers", function() {

  it("compiles file", function () {
    var file_name = random.word();
    var content = random.word();

    var compile = compilers_setup({
      read_content: function (file) { if (file === file_name) return content; },
    });

    expect(compile(file_name)).toEqual(content);
  });

  it("executes compilers in configured order", function () {
    var compile = compilers_setup({
      read_content: function () { return ""; },
      compilers: [{
        compile: function (x) { return x + "asdf"; },
        applies_to: function (input_file) { return true; }
      }, {
        compile: function (x) { return x + "qwer"; },
        applies_to: function (input_file) { return true; }
      }]
    });

    expect(compile()).toEqual("asdfqwer");
  });

  it("executes only matching compilers", function () {
    var compile = compilers_setup({
      read_content: function () { return ""; },
      compilers: [{
        compile: function (x) { return x + "asdf"; },
        applies_to: function (input_file) { return false; }
      }, {
        compile: function (x) { return x + "qwer"; },
        applies_to: function (input_file) { return true; }
      }]
    });

    expect(compile()).toEqual("qwer");
  });

  it("passes extra params to compilers", function () {
    var compile = compilers_setup({
      read_content: function () { return "asdf"; },
      compilers: [{
        compile: function (x, params) { return x + params; },
        applies_to: function (input_file) { return true; }
      }]
    });

    expect(compile(null, "qwer")).toEqual("asdfqwer");
  });

});
