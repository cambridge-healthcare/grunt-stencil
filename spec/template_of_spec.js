"use strict";

var random = require("./random");
var template_of_setup = require("../lib/template_of.js");

describe("template_of", function () {
  describe("when a file doesn't match any path in default_templates", function () {
    describe("when a file has a template defined in header", function () {
      it("returns the value of the `template` field in the header", function () {
        var file_name = random.word();
        var template = random.word();

        var template_of = template_of_setup({
          read_header: function (name) {
            return name === file_name ? { template: template } : {};
          }
        });

        expect(template_of(file_name)).toEqual(template);
      });
    });

    describe("when a file doesn't have a template defined in header", function () {
      it("returns a falsy value", function () {
        var template_of = template_of_setup({
          read_header: function () { return {}; }
        });

        expect(template_of(random.word())).toBeFalsy();
      });
    });
  });

  describe("when file matches a glob in default_templates", function () {
    it("returns the template for the last matched glob", function () {
      // TODO.
      expect(false).toBe(true);
    });
  });
});
