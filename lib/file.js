"use strict";

/*
 * A set of functions that manipulate and read files and filepaths
 */

module.exports = {
  find_closest_match: find_closest_match,
  has_extension: has_extension,
  file_template_map_setup: file_template_map_setup
};

var grunt = require("grunt");
var _     = require("underscore");

function find_closest_match (folder, filename) {
  if (!grunt.file.isDir(folder)) grunt.fail.warn("The folder " + folder + " does not exist.");

  var pattern = build_pattern(folder, filename);
  var filepath = grunt.file.expand(pattern);

  // Warn again if the resulting file doesn't exist
  if (!filepath.length) grunt.fail.warn("The file " + pattern + " cannot be found.");

  return filepath[0];
}

function build_pattern (folder, filename) {
  var separator = "";
  if (folder) {
    separator = folder.length ? "/" : "";
  }
  var extension = has_extension(filename) ? "" : ".*";
  return folder + separator + filename + extension;
}

function file_template_map_setup (pattern_map) {
  return _.reduce(pattern_map, function (agg, spec) {
    if (!spec || !spec.match || !spec.template) {
      return agg;
    }
    var matchedFiles = grunt.file.expand(spec.match);
    for (var i = 0, length = matchedFiles.length; i < length; i++) {
      agg[matchedFiles[i]] = spec.template;
    }
    return agg;
  }, {});
}

function has_extension (filename) {
  return filename.toString().match(/\.[0-9a-z]+$/i);
}
