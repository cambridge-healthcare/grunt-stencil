"use strict";

/*
 * This module encapsulates the rules that are used
 * to configure compilers for a given file, and apply
 * those compilers. At the moment, only dot and
 * markdown compilers are ever used.
 *
 * Each compiler given to this module needs to have
 * an applies_to function that tests whether the input
 * file requires this compiler.
 *
 */

module.exports = setup;

function setup (config) {
  var read_content = config.read_content,
      compilers    = config.compilers || [];

  return compile;

  function compile (input_file, params) {
    var src = read_content(input_file);
    return apply_compilers(assign_compilers(input_file), src, params);
  }

  function assign_compilers (input_file) {
    return compilers.filter(function (compiler) {
      return compiler.applies_to(input_file);
    });
  }

  function apply_compilers (assigned_compilers, src, params) {
    return assigned_compilers.reduce(function(result, compiler) {
      return compiler.compile(result, params);
    }, src);
  }
}
