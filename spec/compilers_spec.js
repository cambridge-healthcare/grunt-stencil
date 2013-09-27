'use strict';

var random = require('./random');
var compilers = require('../lib/compilers');

describe("compilers", function() {

  var markdown_compiler = {
    compile: function (src) {
      var md = require('marked');
      return md(src);
    }
  };

  var dot_compiler = new (require('../lib/dot_compiler'))({});

  var input_file;
  beforeEach(function() {
    input_file = random.word();
  });

  it("does not throw an error with an empty configuration", function() {
    expect(compilers({})).not.toThrow();
  });

  describe("when the input file has a .html extension", function() {
    it("assigns an empty list of compilers", function() {
      input_file += '.html';
      var assigned_compilers = compilers({})(input_file);
      expect(assigned_compilers).toEqual([]);
    });
  });

  describe("when the input file has a .md extension", function() {

    it("assigns the markdown compiler", function() {
      input_file += '.md';
      var assigned_compilers = compilers({})(input_file);
      expect(assigned_compilers.toString()).toEqual([markdown_compiler].toString());
    });

    describe("and other extensions", function() {

      it("assigns the markdown compiler as the first compiler", function() {

        input_file += '.md.html';
        var assigned_compilers = compilers({})(input_file);
        expect(assigned_compilers[0].toString()).toEqual(markdown_compiler.toString());

        input_file = random.word() + '.md.dot.html';
        assigned_compilers = compilers({})(input_file);
        expect(assigned_compilers[0].toString()).toEqual(markdown_compiler.toString());

        input_file = random.word() + '.dot.md.html';
        assigned_compilers = compilers({})(input_file);
        expect(assigned_compilers[0].toString()).toEqual(markdown_compiler.toString());

      });

    });

  });

  describe("when the input_file has a .dot extension", function() {

    var dotvar_param;
    beforeEach(function() {
      dotvar_param = random.word();
    });

    it("assigns the dot compiler", function() {
      input_file += '.dot';
      var assigned_compilers = compilers({})(input_file);
      expect(assigned_compilers.toString()).toEqual([dot_compiler].toString());
    });

    it("uses the given dotvar in the assigned dot compiler", function() {

      input_file += '.dot';
      var assigned_compilers = compilers({
        dotvar: {param: dotvar_param}
      })(input_file);

      var dot_src = '{{= it.param }}';
      var compiled_dot = assigned_compilers[0].compile(dot_src);

      expect(compiled_dot).toEqual(dotvar_param);
    });

    it("uses the given template settings in the assigned dot compiler", function() {

      input_file += '.dot';
      var assigned_compilers = compilers({
        dotvar: {param: dotvar_param},
        dot_settings: {varname: 'x'}
      })(input_file);

      var dot_src = '{{= x.param }}';
      var compiled_dot = assigned_compilers[0].compile(dot_src);

      expect(compiled_dot).toEqual(dotvar_param);
    });

    describe("and other extensions", function() {
      it("assigns the dot compiler as the last compiler", function() {

        input_file += '.dot.html';
        var assigned_compilers = compilers({})(input_file);
        expect(assigned_compilers[0].toString()).toEqual(dot_compiler.toString());

        input_file = random.word() + '.md.dot.html';
        assigned_compilers = compilers({})(input_file);
        expect(assigned_compilers[1].toString()).toEqual(dot_compiler.toString());

        input_file = random.word() + '.dot.md.html';
        assigned_compilers = compilers({})(input_file);
        expect(assigned_compilers[1].toString()).toEqual(dot_compiler.toString());

      });
    });

  });

});