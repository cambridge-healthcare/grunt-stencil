"use strict";

/*
 * grunt-stencil
 * https://github.com/cambridge-healthcare/grunt-stencil
 *
 * Copyright (c) 2013 Cambridge Healthcare
 * Licensed under the MIT license.
 */

var file = require("../lib/file");

var parse_setup = require("../lib/parse");
var compilers_setup = require("../lib/compilers");
var process_file_setup = require("../lib/process_file");

var _ = require("underscore");

module.exports = function(grunt) {

  grunt.registerMultiTask("stencil", "HTML compilation from separate components with doT and Markdown", stencil);

  function stencil () {

    var options = this.options({
      partials: ".",
      templates: ".",
      env: {},
      dot_template_settings: {},
      meta_data_separator: /\r?\n\r?\n/
    });

    var parse = parse_setup(options.meta_data_separator);

    var compile =  compilers_setup({
      read_content: _.compose(parse.content, grunt.file.read),
      compilers: [
        require("../lib/dot_compiler")({
          template_settings: options.dot_template_settings
        }),
        require("../lib/markdown_compiler")
      ]
    });

    var process_file = new process_file_setup({
      options: options,
      compile: compile,
      read_header: _.compose(parse.header, grunt.file.read),
      find_closest_match: file.find_closest_match
    });

    this.files.forEach(function (mapping) {
      var result = process_file(mapping.src).toString();
      grunt.file.write(mapping.dest, result);
    });
  }
};
