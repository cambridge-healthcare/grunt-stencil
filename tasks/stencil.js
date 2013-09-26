'use strict';

/*
 * grunt-stencil
 * https://github.com/cambridge-healthcare/grunt-stencil
 *
 * Copyright (c) 2013 Cambridge Healthcare
 * Licensed under the MIT license.
 */

var separator = '\n\n';
var parse = require('../lib/parse')(separator);

module.exports = function(grunt) {

  grunt.registerMultiTask('stencil', 'HTML compilation from separate components with doT and Markdown', stencil);

  function stencil () {
    var options = this.options({
      partials: '.'
    });

    var process_file = require('../lib/process_file')({
      read: function (name) {
        var pattern = options.partials + '/' + name + '.*';
        return grunt.file.read(grunt.file.expand(pattern));
      }
    });

    this.files.forEach(function (mapping) {
      var input_file = grunt.file.read(mapping.src);
      var result = process_file(input_file);
      grunt.file.write(mapping.dest, result);
    });
  }
};
