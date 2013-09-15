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
      fixtures: {
        options: {
          includes: 'spec/includes'
        },
        files: [{
          expand: true,
          cwd: 'spec/fixtures',
          src: '*.dot.html',
          dest: 'tmp',
          ext: '.html'
        }]
      }
    }
  });
};
