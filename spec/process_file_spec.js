"use strict";

var random = require("./random");
var file = require("../lib/file")
var process_file_setup = require("../lib/process_file");
var trim = require("./trim");

describe("process_file", function () {

  describe("when converted to a string", function() {
    it("returns the contents of a file", function () {
      var content = random.word();

      var process_file = process_file_setup({
        read_header: function () { return {}; },
        compile: function () { return content; },
        find_closest_match: function () { return ''; }
      });

      expect(process_file().toString()).toEqual(content);
    });
  });

  describe("when requesting a header field", function () {
    it("returns its value", function () {
      var title = random.word();

      var process_file = process_file_setup({
        read_header: function () { return { title: title }; },
        compile: function () { return ''; },
        find_closest_match: function () { return ''; }
      });

      expect(process_file().title).toEqual(title);
    });
  });

  describe("when the file includes partial(s)", function() {
    it("contains compiled content of the partial", function () {
      var partial_content = random.word();
      var partial_name = random.word();
      var page_name = random.word();

      function page (params) { return params.include(partial_name).toString(); }

      var process_file = process_file_setup({
        read_header: function () { return {}; },
        compile: function (name, params) {
          return name === page_name ? page(params) : partial_content;
        },
        find_closest_match: function (folder, name) { return name; }
      });

      expect(process_file(page_name).toString()).toEqual(partial_content);
    });

    it("detects circular dependencies in partials", function () {
      var partial_name = random.word();

      var process_file = process_file_setup({
        read_header: function () { return {}; },
        compile: function (name, params) {
          return params.include(partial_name);
        },
        find_closest_match: function (folder, name) { return name; }
      });

      expect(function () { process_file(partial_name); }).toThrow(new Error("Circular dependency detected."));
    });

    it("allows including the same partial twice in one file", function () {
      var partial_name = random.word();
      var page_name = random.word();

      var process_file = process_file_setup({
        read_header: function () { return {}; },
        compile: function (name, params) {
          if (name === page_name) {
            params.include(partial_name);
            params.include(partial_name);
          }
        },
        find_closest_match: function (folder, name) { return name; }
      });

      expect(function () { process_file(page_name); }).not.toThrow();
    });
  });
});
