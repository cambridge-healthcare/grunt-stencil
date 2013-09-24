'use strict';

/*
 * grunt-stencil
 * https://github.com/cambridge-healthcare/grunt-stencil
 *
 * Copyright (c) 2013 Cambridge Healthcare
 * Licensed under the MIT license.
 */

var separator = '\n\n';
var source = require('../lib/source')(separator);

module.exports = function(grunt) {

  grunt.registerMultiTask('stencil', 'HTML compilation from separate components with doT and Markdown', stencil);

  function stencil () {
    var options = this.options({
      partials: '.'
    });

    var process_file = require('../lib/process_file')({
      read: function (name) {
        var find_path = options.partials + '/' + name + '.*';
        return grunt.file.read(grunt.file.expand(find_path));
      }
    });

    var page = require('../lib/page')({
      source: source,
      process_file: process_file
    });

    this.files.forEach(function (mapping) {
      var src = grunt.file.read(mapping.src);
      var result = page(src);
      grunt.file.write(mapping.dest, result);
    });
  }
};
