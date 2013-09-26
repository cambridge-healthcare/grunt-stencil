'use strict';

module.exports = setup;

var _ = require('underscore');
var file = require('./file');

function setup (config) {

  var options   = config.options;
  var parse     = require('./parse')(options.meta_data_separator);

  var processed = {};

  var process_page    = process_file.bind(null, config.read, '.'),
      process_partial = process_file.bind(null, config.read, options.partials);

  return process_page;

  function process_file (read, folder, filename, params) {
    if (processed[filename]) throw new Error('Circular dependency detected.');
    processed[filename] = true;

    var src = read(folder, filename);
    var page = require('./page')({
      compilers: require('./compilers')({
        input_file: file.find_closest_match(folder, filename),
        dotvar: _.extend(options.dotvar, parse.header(src), params, {include: process_partial}),
        dot_settings: options.dot_template_settings
      }),
      parser: parse
    });

    var result = page(src);

    delete processed[filename];

    return result;
  }
}
