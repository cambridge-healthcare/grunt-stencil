/*
 * grunt-stencil
 * https://github.com/cambridge-healthcare/grunt-stencil
 *
 * Copyright (c) 2013 Cambridge Healthcare
 * Licensed under the MIT license.
 */

'use strict';
var dot = require('dot');
var _ = require('underscore');
var lib = require('../lib/lib.js');

module.exports = function(grunt) {

  grunt.registerMultiTask('stencil', 'A Grunt plugin to generate static HTML files from given components.', function() {

    // Define default options
    var options = this.options({
      dot_template_settings: {},
      dot_it_object: {
        file_lists: {}
      },
      templates_folder: '',
    });

    // Build it object
    var it = options.dot_it_object;
    it.file_lists = lib.expand_file_lists(it.file_lists);

    // Override default dot templateSettings with given options
    _.extend(dot.templateSettings, options.dot_template_settings);

    // Specify where to find templates
    var get_template_path = lib.find_closest_match.bind(null, options.templates_folder);

    // Iterate over all specified file groups.
    // mapping.src already contains only existing files
    this.files.forEach(function(mapping) {

      // Check there is a 1:1 src-dest mapping
      validate_mapping(mapping);

      // Compile the source of the input file
      var src = compile(get_template_path, it, mapping.src[0]);

      // Write the destination file.
      grunt.file.write(mapping.dest, src);

      // Print a success message.
      grunt.log.writeln('File ' + mapping.dest.cyan + ' created.');
    });
  });

  // Compile the source of an input file
  function compile (get_template_path, it, src_path) {
    var src = grunt.file.read(src_path);

    var meta = lib.try_and_report(function () {
      return lib.meta_data(src);
    }, 'Error parsing JSON header in', src_path);

    _.extend(it, meta);

    // Compile document
    var document = lib.try_and_report(function () {
      return dot.template(lib.content(src))(it);
    }, 'Error processing template of', src_path);

    // Wrap the document in it's template
    document = lib.try_and_report(function () {
      return wrap(get_template_path, document, it);
    }, 'Error processing template', it.template);

    return document;
  }

  function wrap (get_template_path, document, it) {
    // If the it object now has a 'template' option,
    // We need to first compile the pages to a 'document' cache

    // The dot template is now the new file,
    // which gets access to the compiled original file
    var template;

    if (it.template) {
      _.extend(it, { document: document });

      template = lib.fold_fns(it.template,
                              get_template_path,
                              grunt.file.read,
                              dot.template);
      return template(it);
    } else {
      return document;
    }
  }

  function validate_mapping (mapping) {
    if (mapping.src.length > 1) {
      grunt.fail.warn("You are attempting to compile a single output file " +
                      "from several input files.\nEither amend the src declaration," +
                      "or use a dynamic file mapping instead.");
    }
  }

};
