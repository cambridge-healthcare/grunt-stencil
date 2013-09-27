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
