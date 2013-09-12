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

    // Prepare the it object for dot
    options.dot_it_object = utils.prepare_it_obj(options.dot_it_object,
                                                 process_inclusion.bind(null, options));

    // Iterate over all specified file groups.
    // mapping.src already contains only existing files
    this.files.forEach(function(mapping) {

      // Check there is a 1:1 src-dest mapping
      err.fail(mapping.src.length > 1, err.msgs.mapping_cardinality);

      // Compile the source of the input file
      var input_file = mapping.src[0];
      var compiled_src = process_inclusion(options, input_file, true);

      // Write the destination file.
      grunt.file.write(mapping.dest, compiled_src);

      // Print a success message.
      grunt.log.writeln('File ' + mapping.dest.cyan + ' created.');
    });
  });

  // Process a single include statement
  function process_inclusion (options, input_file, is_page, meta_data_field) {

    // First make sure we have the full path
    var base_folder = is_page ? '' : options.partials_folder;
    input_file = utils.find_closest_match(base_folder, input_file);

    // Register the input file type
    options.is_page = is_page;

    // Run the source through compilers
    var compiled_src = compile(input_file, options);

    return compiled_src;
  }

  // Run a file through compilers based on its meta data and return the result
  function compile (input_file, options) {

    var is_page = _.clone(options.is_page);

    // Define a dot template compiler based on given options
    var dot_compiler = utils.compile_dot.bind(null,
                                              _.clone(options.dot_template_settings),
                                              options.meta_data_sep,
                                              !is_page);

    // Build the it object and add meta data if we find some
    var it = _.extend(options.dot_it_object,
                      utils.meta_data(input_file, options.meta_data_sep));

    // Compile file
    var doc = dot_compiler(input_file, it);
    doc = utils.to_markdown(input_file, doc);
    doc = is_page
          ? add_to_template(doc, options.templates_folder, it, dot_compiler)
          : doc;

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