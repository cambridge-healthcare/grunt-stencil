'use strict';

var random = require('./random');

describe('dot_compiler', function() {
  describe("compile", function () {
    var compiler = new (require('../lib/dot_compiler'))({});
    // TODO: test if options are passed to dot properly.

    it('compiles dot templates', function() {
      var word = random.word();
      var content = '{{= "' + word + '" }}';
      expect(compiler.compile(content)).toEqual(word);
    });
  });

  describe("applies_to", function () {
    var compiler = new (require('../lib/dot_compiler'))({});

    it("returns true for a dot path", function () {
      expect(compiler.applies_to('file.dot')).toEqual(true);
      expect(compiler.applies_to('file.dot.md.haml')).toEqual(true);
    });

    it("returns false for a non-dot path", function () {
      expect(compiler.applies_to("file.html")).toEqual(false);
    });
  });
});
