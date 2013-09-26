'use strict';

/*
 * grunt-stencil
 * https://github.com/cambridge-healthcare/grunt-stencil
 *
 * Copyright (c) 2013 Cambridge Healthcare
 * Licensed under the MIT license.
 */

var separator = '\n\n';
var file = require('../lib/file');

module.exports = function(grunt) {

  grunt.registerMultiTask('stencil', 'HTML compilation from separate components with doT and Markdown', stencil);

  function stencil () {

    var options = this.options({
      partials: '.',
      dotvar: {},
      dot_template_settings: {},
      meta_data_separator: '\n\n'
    });

    var process_file = new (require('../lib/process_file'))({
      read: require('../lib/file').read,
      options: options
    });

    this.files.forEach(function (mapping) {
      var result = process_file(mapping.src).toString();
      grunt.file.write(mapping.dest, result);
    });
  }
};
