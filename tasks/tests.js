/*
 * grunt-stencil
 * https://github.com/cambridge-healthcare/grunt-stencil
 *
 * Copyright (c) 2013 Cambridge Healthcare
 * Licensed under the MIT license.
 */

'use strict';
var _ = require('underscore');
var jasmine = require('jasmine-node');

module.exports = function(grunt) {

  grunt.registerTask('stencil-tests', function() {
    console.log("Running the test task");
  });
};