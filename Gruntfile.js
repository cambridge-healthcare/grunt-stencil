/*
 * grunt-stencil
 * https://github.com/cambridge-healthcare/grunt-stencil
 *
 * Copyright (c) 2013 Cambridge Healthcare
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  grunt.loadTasks('./tasks');

  grunt.initConfig({
    stencil: {
      test_dot_only: {
        files: {
          'tmp/dot_only.html': 'spec/fixtures/dot_only.dot.html'
        }
      }
    }
  });
};
