/*
 * grunt-stencil
 * https://github.com/cambridge-healthcare/grunt-stencil
 *
 * Copyright (c) 2013 Cambridge Healthcare
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        'lib/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    stencil: {
      task: {
        options: {
          dot_template_settings: {strip: false},
          dot_it_object: {
            selfstanding_title: "Stencil-generated self-standing page",
            selfstanding_msg:   "I am a page that is not wrapped in a template.",
            template_msg:       "I am a page that has meta data which says I need to be wrapped in a template.",
            dot_msg:            "The contents of this file should be parsed by dot (with stripping enabled regardless of use oprions).",
            file_lists: {
              stylesheets: [{cwd: '.'},'test/data/styles/*.css']
            }
          },
          templates_folder: 'test/data/templates'
          //partials_folder: 'test/data/partials'
        },
        files: [
          {
            expand: true,
            cwd: 'test/data/',
            src: ['pages/*'],
            dest: 'tmp/',
            ext: '.html',
            flatten: true
          }
        ]
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'stencil', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
