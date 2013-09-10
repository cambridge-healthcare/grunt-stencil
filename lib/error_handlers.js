/*
 * This library file is used for anything that
 * has to do with validation, error messages,
 * or throwing errors to interrupt the grunt task.
 */

'use strict';

module.exports = {
  validate_mapping: validate_mapping
}

function validate_mapping (mapping) {
  if (mapping.src.length > 1) {
    grunt.fail.warn("You are attempting to compile a single output file " +
                    "from several input files.\nEither amend the src declaration," +
                    "or use a dynamic file mapping instead.");
  }
}