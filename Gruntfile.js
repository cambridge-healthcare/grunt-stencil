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
          partials: 'spec/includes'
        },
        files: [{
          expand: true,
          cwd: 'spec/fixtures',
          src: '*.html',
          dest: 'tmp',
          ext: '.html',
          flatten: true
        }]
      },

      dot_only: {
        options: {
          partials: 'spec/includes'
        },
        files: [{
          expand: true,
          src: 'spec/fixtures/dot_only.dot.html',
          dest: 'tmp',
          ext: '.html',
          flatten: true
        }]
      },

      include_with_params: {
        options: {
          partials: 'spec/includes'
        },
        files: [{
          expand: true,
          src: 'spec/fixtures/include_with_params.dot.html',
          dest: 'tmp',
          ext: '.html',
          flatten: true
        }]
      },


      includes_partial: {
        options: {
          partials: 'spec/includes'
        },
        files: [{
          expand: true,
          src: 'spec/fixtures/includes_partial.dot.html',
          dest: 'tmp',
          ext: '.html',
          flatten: true
        }]
      },

      nested_include: {
        options: {
          partials: 'spec/includes'
        },
        files: [{
          expand: true,
          src: 'spec/fixtures/nested_include.dot.html',
          dest: 'tmp',
          ext: '.html',
          flatten: true
        }]
      },


      with_header: {
        options: {
          partials: 'spec/includes'
        },
        files: [{
          expand: true,
          src: 'spec/fixtures/with_header.md.dot.html',
          dest: 'tmp',
          ext: '.html',
          flatten: true
        }]
      },

      circular: {
        options: {
          partials: 'spec/includes'
        },
        files: [{
          expand: true,
          src: 'spec/includes/example_with_circular_include.dot.html',
          dest: 'tmp',
          ext: '.html',
          flatten: true
        }]
      }
    }
  });
};
