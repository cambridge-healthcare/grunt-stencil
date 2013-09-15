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

  grunt.registerMultiTask('stencil', 'HTML compilation with doT, Markdown and includes', stencil);

  function stencil () {
    var options = this.options({
      includes: '.'
    });

    var include = require('../lib/include')({
      read: function (name) {
        var find_path = options.includes + '/' + name + '.*';
        return grunt.file.read(grunt.file.expand(find_path));
      }
    });

    var page = require('../lib/page')({
      source: source,
      include: include
    });

    this.files.forEach(function (mapping) {
      var src = grunt.file.read(mapping.src);
      var result = page(src);
      grunt.file.write(mapping.dest, result);
    });
  }
};
