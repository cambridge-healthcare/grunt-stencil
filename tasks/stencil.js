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
      partials: '.',
      dot_it_obj: {}
    });

    var process_file = new (require('../lib/process_file'))({
      read: function (file, folder) {
        var pattern = folder + '/' + file;
        if (!file.toString().match(/\.[0-9a-z]+$/i)) pattern += '.*';
        return grunt.file.read(grunt.file.expand(pattern));
      },
      options: options
    });

    this.files.forEach(function (mapping) {
      var result = process_file(mapping.src).toString();
      grunt.file.write(mapping.dest, result);
    });
  }
};
