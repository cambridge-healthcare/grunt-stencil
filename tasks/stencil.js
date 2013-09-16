/*
 * grunt-stencil
 * https://github.com/cambridge-healthcare/grunt-stencil
 *
 * Copyright (c) 2013 Cambridge Healthcare
 * Licensed under the MIT license.
 */

'use strict';
var _ = require('underscore');
var utils = require('../lib/utils.js');
var err = require('../lib/error_handlers.js');
var Stack = require('../lib/stack.js')

module.exports = function(grunt) {

  grunt.registerMultiTask('stencil', 'An HTML builder.', function() {

    // Define default options
    var options = this.options({
      dot_template_settings: {},
      dot_it_object: {
        file_lists: {}
      },
      meta_data_sep: '\n\n',
      templates_folder: '',
      partials_folder: ''
    });

    // Iterate over all specified file groups.
    // mapping.src already contains only existing files
    this.files.forEach(function(mapping) {

      var opts = _.clone(options);

      // Check there is a 1:1 src-dest mapping
      err.fail(mapping.src.length > 1, err.msgs.mapping_cardinality);
      var input_file = mapping.src[0];

      // Prepare the it object for dot
      var partials_stack = new Stack;
      opts.dot_it_object = utils.prepare_it_obj(_.clone(opts.dot_it_object),
                                                process_inclusion.bind(null, opts, false, partials_stack));

      // Compile the source of the input file
      var compiled_src = process_inclusion(opts, true, partials_stack, input_file);

      // Write the destination file.
      grunt.file.write(mapping.dest, compiled_src);

      // Print a success message.
      grunt.log.writeln('File ' + mapping.dest.cyan + ' created.');
    });
  });

  // Process a single include statement
  function process_inclusion (options, is_page, partials_stack, input_file, requested_header_field) {

    // First make sure we have the full path
    var base_folder = is_page ? '' : options.partials_folder;
    input_file = utils.find_closest_match(base_folder, input_file);

    // Is the inclusion request for a meta data element,
    // or the compiled src itself?
    var response;
    if (requested_header_field) {
      response = utils.meta_data(input_file, options.meta_data_sep)[requested_header_field];
    }
    else {
      // Check if we have already processed this inclusion up the stack
      // if not, compile
      err.fail(partials_stack.contains(input_file), err.msgs.circular_inclusion(input_file));
      partials_stack.add(input_file);
      response = compile(input_file, _.extend(options, {is_page: is_page}));
      partials_stack.remove(input_file);
    }

    return response;
  }

  // Run a file through compilers based on its meta data and return the result
  function compile (input_file, options) {

    // Define a dot template compiler based on given options
    var dot_compiler = utils.compile_dot.bind(null,
                                              _.clone(options.dot_template_settings),
                                              options.meta_data_sep);

    // Build the it object, adding meta data if we find some
    var it = _.extend(_.clone(options.dot_it_object),
                      utils.meta_data(input_file, options.meta_data_sep));

    // Compile file
    var doc = dot_compiler(input_file, it);
    doc = utils.md_to_html(input_file, doc);
    doc = add_to_template(doc, options.templates_folder, it, dot_compiler)

    return doc;
  }

  // When parent templates are specified, *they* should be compiled
  // instead, with the original source passed to the it object
  function add_to_template (src, templates, it, dot_compiler) {
    if (it.template) {
      var parent_template = utils.find_closest_match(templates, it.template);
      _.extend(it, { document: src });
      src = dot_compiler(parent_template, it);
    }
    return src;
  }
};