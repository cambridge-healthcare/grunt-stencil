"use strict";

/*
 * A set of functions that manipulate and read files and filepaths
 */

module.exports = setup;

var grunt = require("grunt");
var _     = require("underscore");

function setup (pattern_map) {
  var file_to_template = build_map(pattern_map || []);

  return resolve_template;

  function resolve_template (header, input_file) {
    if (!header || header && header.template || !input_file) return;

    header.template = file_to_template[input_file];
  }

  function build_map (pattern_map) {
    return _.reduce(pattern_map, function (agg, spec) {
      if (!spec || !spec.match || !spec.template) return agg;

      var matchedFiles = grunt.file.expand(spec.match);
      for (var i = 0, length = matchedFiles.length; i < length; i++) {
        agg[matchedFiles[i]] = spec.template;
      }
      return agg;
    }, {});
  }
}