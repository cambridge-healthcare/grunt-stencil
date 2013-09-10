/*
 * This library file is used for anything that
 * has to do with validation, error messages,
 * or throwing errors to interrupt the grunt task.
 */

'use strict';
var grunt = require('grunt');

module.exports = {
  fail: fail,
  try: try_and_fail,
  warn: warn,

  msgs: {

    // Thrown when the user is attempting to map several
    // input files to a single destination
    mapping_cardinality: "You are attempting to compile a single output file " +
                         "from several input files.\nEither amend the src declaration," +
                         "or use a dynamic file mapping instead.",

    // Thrown when the dot templating engine encounters
    // an error when processing a given file
    cannot_process: function(file) {
      return 'Error processing '.red + file.cyan + ':';
    }

  }
}

function fail (condition, error_msg) {
  if (condition) {
    grunt.fail.fatal(error_msg);
  }
}

function try_and_fail (action, error_msg) {
  try {
    return action();
  } catch (e) {
    grunt.log.errorlns(error_msg);
    throw e;
  }
}

function warn (condition, error_msg) {
  if (condition) {
    grunt.fail.warn(error_msg);
  }
}