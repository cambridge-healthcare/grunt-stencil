"use strict";

var exec = require("child_process").exec;
var fs = require("fs");

describe("stencil task", function () {
  it("all fixtures have expected result", function (done) {
    exec("grunt clean stencil:fixtures", function (error, stdout, stderr) {
      expect(function () {
        if (error && error.code) {
          throw Error(stdout + stderr);
        }

        var expected_dir = "spec/expected";
        fs.readdirSync(expected_dir).forEach(function (name) {
          expect(
            name + ":" + strip(fs.readFileSync("tmp/" + name, "utf8"))
          ).toEqual(
            name + ":" + strip(fs.readFileSync("spec/expected/" + name, "utf8"))
          );
        });
      }).not.toThrow();
      done();
    });
  });
});

function strip (str) {
  return str.replace(/(^\s+)|(\s+$)/g, "");
}
