'use strict';

/*
 * A set of functions that manipulate and read files and filepaths
 */

module.exports = {
  read: read,
  find_closest_match: find_closest_match,
  is_markdown: is_markdown,
  is_dot: is_dot,
  has_extension: has_extension
};

var grunt = require('grunt');

function read (filename, folder) {
  if (folder) filename = find_closest_match(folder, filename);
  return grunt.file.read(filename);
}

function find_closest_match (folder, filename) {
  if (!grunt.file.isDir(folder)) grunt.warn.log("The folder " + folder + " does not exist.");

  var pattern = build_pattern(folder, filename);
  var file = grunt.file.expand(pattern);

  // Warn again if the resulting file doesn't exist
  if (!file.length) grunt.fail.warn("The file " + pattern + " cannot be found.");

  return file[0];
};

function build_pattern (folder, filename) {
  var separator = '';
  if (folder) {
    separator = folder.length ? '/' : '';
  }
  var extension = has_extension(filename) ? '' : '.*';
  return folder + separator + filename + extension;
}

function is_markdown (file) {
  return /\.md$|\.md\..*$/.test(file);
};

function is_dot (file) {
  return /\.dot$|\.dot\..*$/.test(file.toString());
};

function has_extension (file) {
  return file.toString().match(/\.[0-9a-z]+$/i);
};