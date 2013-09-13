var exec = require('child_process').exec;

var fs = require('fs');

describe("stencil task", function () {
  it("all fixtures have expected result", function (done) {
    exec('grunt stencil:fixtures', function (error, stdout, stderr) {
      expect(function () {
        if (error && error.code) {
          throw Error(stdout + stderr);
        }

        var expected_dir = 'spec/expected';
        fs.readdirSync(expected_dir).forEach(function (name) {
          expect(
            fs.readFileSync('tmp/' + name, 'utf8')
          ).toEqual(
            fs.readFileSync('spec/expected/' + name, 'utf8')
          );
        });
      }).not.toThrow();
      done();
    });
  });
});
