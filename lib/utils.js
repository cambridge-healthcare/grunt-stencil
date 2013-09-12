'use strict';
var _ = require('underscore');
var grunt = require('grunt');
var dot = require('dot');
var md = require('marked');
var err = require('./error_handlers.js');

module.exports = {
  compile_dot: compile_dot,
  find_closest_match: find_closest_match,
  meta_data: meta_data,
  prepare_it_obj: prepare_it_obj,
  md_to_html: md_to_html
};

//=========================================================
// Use dot to compile the contents of a given input file,
// discarding any meta data that may be present
//=========================================================

function compile_dot (template_settings, meta_data_sep, disable_strip, input_file, it) {

  var src = grunt.file.read(input_file);
  template_settings.strip = disable_strip ? false : template_settings.strip;
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

function extract_content (src, meta_data_sep) {
  var chunks = src.split(meta_data_sep);
  return chunks.slice(1).join(meta_data_sep);
}

//=========================================================
// Return a filepath given a folder to look in,
// and a relative path which may or may not contain an extension
//=========================================================

function find_closest_match (folder, rel_path) {

  // Warn user if the base folder doesn't exist
  err.warn(!grunt.file.isDir(folder), err.msgs.nonexisting(folder));

  var pattern = build_pattern(folder, rel_path);
  var file = grunt.file.expand(pattern)[0];

  // Warn again if the resulting file doesn't exist
  err.warn(!file.length, err.msgs.nonexisting(pattern));

  return file;
}

function build_pattern (folder, rel_path) {
  var separator = folder.length ? '/' : '';
  var extension = has_extension(rel_path) ? '' : '.*';
  return folder + separator + rel_path + extension;
}

function has_extension (path) {
  return path.match(/\.[0-9a-z]+$/i);
}

//=========================================================
// Given an input file, return an object containing the
// meta data that may or may not have been defined in the
// beginning of the file, or in the beginning of any file
// 'include'd in the input file
//=========================================================
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

function fold_fns () {
  return Array.prototype.reduce.call(arguments, function (arg, fn) {
    return fn(arg);
  });
}

function extract_meta_data (chunks) {
  return chunks[0];
}

function parse_meta_data (meta_data_str) {
  return JSON.parse(meta_data_str);
}

//=========================================================
// Build an appropriate it object to pass to a dot template
// Values in the 'file_lists' key need to be expanded to actual paths
//=========================================================

function prepare_it_obj (given_it, partials_compiler) {

  // Convert given patterns to actual file paths
  given_it.file_lists = expand_file_lists(given_it.file_lists);

  // Assign a function to include
  // to give it_obj access to contents of a given file
  given_it.include = partials_compiler;

  return given_it;
}

function expand_file_lists (file_lists) {
  var expanded_lists = {};

  // Underscore's .each can iterate over objects
  _.each(file_lists, function(value, key) {
    expanded_lists[key] = grunt.file.expand(value[0], value[1]);
  });

  return expanded_lists;
}

//=========================================================
// Compile a file's contents to markdown.
// If a source is given, compile it instead.
//=========================================================
function md_to_html(input_file, src) {
  var contents_to_compile = src || grunt.file.read(input_file);
  if (is_markdown(input_file)) {
    contents_to_compile = md(contents_to_compile);
  }
  return contents_to_compile;
}

function is_markdown(input_file) {
  return /\.md$/.test(input_file);
}