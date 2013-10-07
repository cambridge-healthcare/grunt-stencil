"use strict";

/*
 * This module handles the logic of processing a single
 * given file, whether it is a template, page or partial.
 *
 * The compiler, options, readers and file matchers to
 * be used are all injected.
 *
 * Mainly, this module makes sure that circular dependencies
 * do not occur with partial inclusions, by keeping track
 * of processed files.
 */

module.exports = setup;

var _ = require("underscore");

function setup (config) {

  var options            = config.options || {},
      read_header        = config.read_header,
      compile            = config.compile,
      find_closest_match = config.find_closest_match;

  var process_page     = process_file.bind(null, "."),
      process_partial  = process_file.bind(null, options.partials),
      process_template = process_file.bind(null, options.templates),
      processed        = {};

  var initial_env = _.extend({}, options.env, { include: process_partial });

  return process_page;

  function process_file (folder, filename, params) {
    var input_file = find_closest_match(folder, filename);

    if (processed[input_file]) throw new Error("Circular dependency detected.");
    processed[input_file] = true;

    var compiled_page = page(input_file, params);

    delete processed[input_file];
    return compiled_page;
  }

  function page (input_file, params) {
    var header  = read_header(input_file);
    var env     = merge_env(header, params);

    var content = bundle(compile(input_file, env), header);

    if (header.template) {
      content = bundle(wrap(header.template, content), header);
    }

    return content;
  }

  function wrap (template, page) {
    return process_template(template, { document: page }).toString();
  }

  function merge_env (/* objects... */) {
    return _.flatten([
      initial_env,
      arguments
    ]).reduce(function (agg, value) {
      return _.extend(agg, value);
    }, {});
  }

  /*
   * This function takes advantage of JavaScript feature for objects
   * that whenever an object is conctenated to a string, the
   * toString() method is invoked.
   *
   * valueOf() is useful in comparisons.
   */
  function bundle (str, header) {
    return _.extend(header, {
      valueOf:  function () { return str; },
      toString: function () { return str; }
    });
  }
}
