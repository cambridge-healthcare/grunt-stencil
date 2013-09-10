/*
 * This library file is used for anything that
 * has to do with validation, error messages,
 * or throwing errors to interrupt the grunt task.
 */

'use strict';
var grunt = require('grunt');

module.exports = {
  fail: fail,
  warn: warn
}

function fail (condition, error_msg) {
  if (condition) {
    grunt.fail.fatal(error_msg);
  }
}

function warn (condition, error_msg) {
  if (condition) {
    grunt.fail.warn(error_msg);
  }
}