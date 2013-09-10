'use strict';
var _ = require('underscore');
var grunt = require('grunt');
var dot = require('dot');
var err = require('./error_handlers.js');

module.exports = {
  compile_dot: compile_dot,
  find_closest_match: find_closest_match,
  meta_data: meta_data,
  prepare_it_obj: prepare_it_obj
};

function compile_dot (template_settings, meta_data_sep, input_file, it) {
  var src = grunt.file.read(input_file);
  _.extend(dot.templateSettings, template_settings);
  return err.try(function () {
    return dot.template(content(src, meta_data_sep))(it);
  }, err.msgs.cannot_process(input_file));
}

function content (src, meta_data_sep) {
  return contains_meta_data(src) ? extract_content(src, meta_data_sep) : src;
}

function contains_meta_data (src) {
  return src[0] === '{';
}

function expand_file_lists (file_lists) {
  var expanded_lists = {};

  // Underscore's .each can iterate over objects
  _.each(file_lists, function(value, key) {
    expanded_lists[key] = grunt.file.expand(value[0], value[1]);
  });

  return expanded_lists;
}

function extract_content (src, meta_data_sep) {
  var chunks = src.split(meta_data_sep);
  return chunks.slice(1).join(meta_data_sep);
}

function extract_meta_data (chunks) {
  return chunks[0];
}

// Return a filepath given a folder to look in,
// and a relative path which may or may not contain an extension
function find_closest_match (folder, rel_path) {
  var separator = folder.length ? '/' : '';
  var extension = has_extension(rel_path) ? '' : '.*';
  var pattern = folder + separator + rel_path + extension;
  return grunt.file.expand(pattern);
}

function fold_fns () {
  return Array.prototype.reduce.call(arguments, function (arg, fn) {
    return fn(arg);
  });
}

// Attempt to extract an extension from a filepath
// and return whether it has a length
function has_extension (path) {
  return path.match(/\.[0-9a-z]+$/i).length;
}

function meta_data (input_file, meta_data_sep) {
  var src = grunt.file.read(input_file);
  var chunks = src.split(meta_data_sep);
  return err.try(function () {
    return contains_meta_data(src) ? fold_fns(chunks,
                                              extract_meta_data,
                                              parse_meta_data)
                                   : {};
  }, err.msgs.cannot_parse(input_file));
}

function parse_meta_data (meta_data_str) {
  return JSON.parse(meta_data_str);
}

function prepare_it_obj (given_it) {
  // Expand values in file_lists
  given_it.file_lists = expand_file_lists(given_it.file_lists);
  return given_it;
}