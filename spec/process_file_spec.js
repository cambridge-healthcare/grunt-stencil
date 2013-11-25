"use strict";

var random = require("./random");
var file = require("../lib/file")
var process_file_setup = require("../lib/process_file");
var trim = require("./trim");

describe("process_file", function () {

  var circular_error = new Error("Circular dependency detected.");

  describe("when converted to a string", function() {
    it("returns the contents of a file", function () {
      var content = random.word();

      var process_file = process_file_setup({
        read_header: function () { return {}; },
        compile: function () { return content; },
        find_closest_match: function () { return ""; }
      });

      expect(process_file().toString()).toEqual(content);
    });
  });

  describe("when requesting a header field", function () {
    it("returns its value", function () {
      var title = random.word();

      var process_file = process_file_setup({
        read_header: function () { return { title: title }; },
        compile: function () { return ""; },
        find_closest_match: function () { return ""; }
      });

      expect(process_file().title).toEqual(title);
    });
  });

  describe("when the page includes partial(s)", function() {

    it("contains the compiled content of the partial", function () {
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

      expect(function () { process_file(partial_name); }).toThrow(circular_error);
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

    describe("when the included partial defines a template", function() {

      it("the partial is wrapped in the template", function() {
        var template_name       = random.word(),
            partial_placeholder = random.word(),
            template_content    = template_name + partial_placeholder;

        var page_name    = random.word(),
            page_content = random.word();

        var partial_name    = random.word(),
            partial_content = random.word();

        var process_file = process_file_setup({
          read_header: function (filename) {
            return filename === partial_name ? {template: template_name} : {}; },
          compile: function (name, params) {
            if (name === page_name) {
              return page_content + params.include(partial_name);
            }
            else if (name === partial_name) {
              return partial_content;
            }
            else {
              return template_content.replace(partial_placeholder, partial_content);
            }
          },
          find_closest_match: function (folder, name) { return name; }
        });

        expect(process_file(page_name).toString()).toEqual(page_content + template_name + partial_content);
      });
    });
  });

  describe("when a page defines a template", function() {

    var template_name    = "template_name",
        page_placeholder = "page_placeholder",
        template_content = template_name + page_placeholder;

    var page_name    = "page_name",
        page_content = "page_content",
        page_param   = "page_param";

    function compile_template (name, params) {
      return template_content.replace(page_placeholder, page_content);
    };

    it("the page is wrapped in the template", function() {

      var process_file = process_file_setup({
        read_header: function (filename) {
          return filename === page_name ? {template: template_name} : {};
        },
        compile: function (name, params) {
          return name === page_name ? page_content : compile_template(name, params);
        },
        find_closest_match: function (folder, name) { return name; }
      });

      expect(process_file(page_name).toString()).toEqual(template_name + page_content);
    });

    it("detects circular dependencies in templates", function() {
      var process_file = process_file_setup({
        read_header: function (filename) {
          return {template: template_name};
        },
        compile: function (name, params) {
          return name === page_name ? page_content : compile_template(name, params);
        },
        find_closest_match: function (folder, name) { return name; }
      });

      expect(function() {process_file(page_name)}).toThrow(circular_error);
    });

    it("the wrapped page exposes its header fields", function() {
      var process_file = process_file_setup({
        read_header: function (filename) {
          return filename === page_name ? {template: template_name, param: page_param} : {};
        },
        compile: function (name, params) {
          return name === page_name ? page_content : compile_template(name, params);
        },
        find_closest_match: function (folder, name) { return name; }
      });

      expect(process_file(page_name).param).toEqual(page_param);
    });

    it("the template has access to the meta data defined in the page", function() {
      var param_placeholder = "param_placeholder";
      template_content = template_name + page_placeholder + param_placeholder;

      var process_file = process_file_setup({
        read_header: function (filename) {
          return filename === page_name ? {template: template_name, param: page_param} : {};
        },
        compile: function (name, params) {
          if(name === page_name) return page_content;
          else {
            return template_content.replace(page_placeholder, page_content)
                                   .replace(param_placeholder, params.document.param);
          }
        },
        find_closest_match: function (folder, name) { return name; }
      });

      expect(process_file(page_name).toString()).toEqual(template_name + page_content + page_param);
    });
  });
});
