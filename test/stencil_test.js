'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.stencil = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  selfstanding: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/selfstanding.html');
    var expected = grunt.file.read('test/expected/selfstanding.html');
    test.equal(actual, expected, '');

    test.done();
  },
  custom_options: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/with_template.html');
    var expected = grunt.file.read('test/expected/with_template.html');
    test.equal(actual, expected, '');

    test.done();
  },
};
