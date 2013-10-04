/*
 * grunt-stencil
 * https://github.com/cambridge-healthcare/grunt-stencil
 *
 * Copyright (c) 2013 Cambridge Healthcare
 * Licensed under the MIT license.
 */

"use strict";

module.exports = function (grunt) {
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-clean");

  grunt.loadTasks("tasks");

  grunt.registerTask("default", ["clean", "stencil", "jshint"]);

  // Project configuration.
  grunt.initConfig({

    stencil: {
      fixtures: {
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
    },

    jshint: {
      all: [
        "Gruntfile.js",
        "tasks/*.js",
        "lib/*.js"
      ],
      options: {
        jshintrc: ".jshintrc",
      },
    },

    clean: {
      tmp: ["tmp"],
    }
  });
};
