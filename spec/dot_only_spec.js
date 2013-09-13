var exec = require('child_process').exec;

var fs = require('fs');

describe("stencil task", function () {
  it("compiles dot_only.dot.html", function (done) {
    exec('grunt stencil:test_dot_only', function (error, stdout, stderr) {
      expect(function () {
        if (error && error.code) {
          throw Error(stdout + stderr);
        }

        expect(
          fs.readFileSync('tmp/dot_only.html', 'utf8')
        ).toEqual(
          fs.readFileSync('spec/expected/dot_only.html', 'utf8')
        );
      }).not.toThrow();
      done();
    });
  });
});
