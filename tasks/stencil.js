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
                                                 compile.bind(null, options));

    // Iterate over all specified file groups.
    // mapping.src already contains only existing files
    this.files.forEach(function(mapping) {

      // Check there is a 1:1 src-dest mapping
      err.fail(mapping.src.length > 1, err.msgs.mapping_cardinality);

      // Compile the source of the input file
      var input_file = mapping.src[0];
      var compiled_src = compile(options, input_file, true);

      // Write the destination file.
      grunt.file.write(mapping.dest, compiled_src);

      // Print a success message.
      grunt.log.writeln('File ' + mapping.dest.cyan + ' created.');
    });
  });

  // Compile the source of an input file
  function compile (options, input_file, is_page) {
    console.log("\nInclude has been called on " + input_file.cyan + (is_page ? ", which is a page!" : ""));
    console.log("Initial it: ");
    console.log(options.dot_it_object);

    // Define a dot template compiler based on given options
    var dot_compiler = utils.compile_dot.bind(null,
                                              options.dot_template_settings,
                                              options.meta_data_sep);

    // Build the it object and add meta data if we find some
    var it = _.extend(options.dot_it_object,
                      utils.meta_data(input_file, options.meta_data_sep));
    console.log("It after meta data:")
    console.log(it);

    // Compile dot template using it object
    var doc = dot_compiler(input_file, it);

    console.log("Now back to " + input_file)

    // In case a parent template is defined in the meta data,
    // compile it with the document passed in the it object
    var parent_template;
    if (it.template && is_page) {
      console.log(input_file + " DID have a template specified!!");
      parent_template = utils.find_closest_match(options.templates_folder, it.template);
      _.extend(it, { document: doc });
      doc = dot_compiler(parent_template, it);
    }

    return doc;
  }
};
