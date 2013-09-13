/*
 * grunt-stencil
 * https://github.com/cambridge-healthcare/grunt-stencil
 *
 * Copyright (c) 2013 Cambridge Healthcare
 * Licensed under the MIT license.
 */

"use strict";

module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
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

    // Before generating any new files, remove any previously-created files.
    clean: {
      tmp: ["tmp"],
    },

    // Configuration to be run (and then tested).
    stencil: {
      main: {
        options: {
          dot_template_settings: {strip: false},
          dot_it_object: {
            partial_border: "2px dashed #dfdfdf",
            page_border: "2px solid #red",
            file_lists: {
              stylesheets: [{cwd: "."},"test/data/styles/*.css"],
              partials: [{}, "test/data/partials/*"]
            }
          },
          templates_folder: "test/data/templates",
          partials_folder: "test/data/partials"
        },
        files: [
          {
            expand: true,
            cwd: "test/data/pages",
            src: ["*.dot.html", "*.md"],
            dest: "tmp/",
            ext: ".html",
            flatten: true
          }
        ]
      },

      inclusion_error: {
        options: {
          dot_it_object: {
            partial_border: "2px dashed #dfdfdf",
            page_border: "2px solid #red",
            file_lists: {
              stylesheets: [{cwd: "."},"test/data/styles/*.css"],
              partials: [{}, "test/data/partials/*"]
            }
          },
          templates_folder: "test/data/templates",
          partials_folder: "test/data/partials"
        },
        files: [
          {
            expand: true,
            cwd: "test/data/pages",
            src: ["infinite.html"],
            dest: "tmp/",
            ext: ".html"
          }
        ]
      }
    }

  });

  // Actually load this plugin"s task(s).
  grunt.loadTasks("tasks");

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
