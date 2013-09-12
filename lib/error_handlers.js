/*
 * This library file is used for anything that
 * has to do with validation, error messages,
 * or throwing errors to interrupt the grunt task.
 */

'use strict';
var grunt = require('grunt');

module.exports = {
  fail: fail,
  try: try_and_report,
  warn: warn,

  msgs: {

    // Thrown when the dot templating engine encounters
    // an error when processing a given file
    cannot_process: function(file) {
      return "Error processing ".red + file.cyan + ":";
    },

    // Thrown when a JSON meta data header cannot be parsed
    cannot_parse: function(file) {
      return "Error parsing JSON header in ".red + file.cyan + ":";
    },

    circular_inclusion: function(file) {
      return "Circular inclusion statement detected in " + file.cyan;
    },

    // Thrown when the user is attempting to map several
    // input files to a single destination
    mapping_cardinality: "You are attempting to compile a single output file " +
                         "from several input files.\nEither amend the src declaration," +
                         "or use a dynamic file mapping instead.",

    // Thrown when trying to reference a folder that doesn't
    // exist, eg for finding templates
    nonexisting: function(path) {
      return path.cyan + " doesn't exist!";
    }

  }
};

function fail (condition, error_msg) {
  if (condition) {
    grunt.fail.fatal(error_msg);
  }
}

function try_and_report (action, error_msg) {
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