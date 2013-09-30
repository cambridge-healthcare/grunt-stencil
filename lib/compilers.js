'use strict';

/*
 * This module encapsulates the rules that are used
 * to configure compilers for a given file. At the moment,
 * only dot and markdown compilers are
 * ever used.
 *
 * To configure a markdown compiler, we just look at
 * the file extension and see if it is md.
 * To configure a dot compiler, we also need to access
 * to a given dotvar object, template settings, and
 * any extra information dot should have access to.
 *
 * The module returns an array of custom configured
 * compilers, in the correct order that they should
 * be applied in.
 */

module.exports = setup;

var file = require('./file');

function setup (config) {
  var read_content = config.read_content;
  var compilers = config.compilers || [];

  return compile;

  function compile (input_file, params) {
    var src = read_content(input_file);
    return apply_compilers(assign_compilers(input_file), src, params);
  };

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
};
