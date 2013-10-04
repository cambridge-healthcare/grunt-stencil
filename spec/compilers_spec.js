"use strict";

var random = require("./random");
var compilers_setup = require("../lib/compilers");

describe("compilers", function() {

  var prefix, affix;
  beforeEach(function() {
    prefix = random.word();
    affix = random.word();
  });

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
        compile: function (x) { return x + affix; },
        applies_to: function (input_file) { return true; }
      }, {
        compile: function (x) { return prefix + x; },
        applies_to: function (input_file) { return true; }
      }]
    });

    expect(compile()).toEqual(prefix + affix);
  });

  it("executes only matching compilers", function () {
    var compile = compilers_setup({
      read_content: function () { return ""; },
      compilers: [{
        compile: function (x) { return x + affix; },
        applies_to: function (input_file) { return false; }
      }, {
        compile: function (x) { return prefix + x; },
        applies_to: function (input_file) { return true; }
      }]
    });

    expect(compile()).toEqual(prefix);
  });

  it("passes extra params to compilers", function () {
    var content = random.word();
    var param = random.word();
    var compile = compilers_setup({
      read_content: function () { return content; },
      compilers: [{
        compile: function (x, params) { return x + params; },
        applies_to: function (input_file) { return true; }
      }]
    });

    expect(compile(null, param)).toEqual(content + param);
  });

});
