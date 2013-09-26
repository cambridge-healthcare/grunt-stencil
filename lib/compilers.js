'use strict';

/*
 * This module encapsulates the rules that are used
 * to configure compilers for a given file.
 *
 * At the moment, only dot and markdown compilers are
 * ever used.

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

  var input_file       = config.input_file,
      dotvar           = config.dotvar || {},
      dot_settings     = config.dot_settings || {}

  var compilers = [];
  assign_compilers();
  return compilers;

  function assign_compilers () {
    // Reflect required order of compilers
    if (file.is_markdown(input_file)) add_md_compiler();
    if (file.is_dot(input_file))      add_dot_compiler();
    return compilers;
  };

  function add_dot_compiler () {
    var dot_compiler = configure_dot_compiler();
    compilers.push(dot_compiler);
  };

  function add_md_compiler () {
    var md_compiler = configure_md_compiler();
    compilers.push(md_compiler);
  };

  function configure_dot_compiler () {
    return new (require('./dot_compiler'))({
      dotvar: dotvar,
      template_settings: dot_settings
    });
  };

  function configure_md_compiler () {
    return {
      compile: function (src) {
        var md = require('marked');
        return md(src);
      }
    }
  };
}