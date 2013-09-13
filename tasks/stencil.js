/*
 * grunt-stencil
 * https://github.com/cambridge-healthcare/grunt-stencil
 *
 * Copyright (c) 2013 Cambridge Healthcare
 * Licensed under the MIT license.
 */

'use strict';

var page = require('../lib/page');

module.exports = function(grunt) {
  grunt.registerMultiTask('stencil', 'HTML compilation with doT, Markdown and includes', stencil);

  function stencil () {
    this.files.forEach(function (mapping) {
      var src = grunt.file.read(mapping.src);
      var result = page(src);
      grunt.file.write(mapping.dest, result);
    });
  }
};
