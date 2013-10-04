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
      all: {
        options: {
          partials: 'spec/includes',
          templates: 'spec/templates',
          dot_template_settings: {
            strip: true
          },
          vars: {
            parameter: 'value'
          }
        },
        files: [{
          expand: true,
          cwd: 'spec/fixtures',
          src: '*.html',
          dest: 'tmp',
          ext: '.html',
          flatten: true
        }]
      }
    }
  });
};
